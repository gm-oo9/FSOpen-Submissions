import { useState, useEffect } from "react";
import axios from "axios";
const geoLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?"; 
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?"
const api_key = import.meta.env.VITE_SOME_KEY

const Weather = ({ country }) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!country.capital) return;
  
      // First API call to get the lat/lon with capital
      axios.get(`${geoLocationUrl}q=${country.capital}&appid=${api_key}`)
        .then(response => {
          if (response.data.length === 0) throw new Error("Location not found");
          const lat = response.data[0].lat;
          const lon = response.data[0].lon;
  
          // Second API call to get the weather
          return axios.get(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);
        })
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          setError(error.message);
        });
    }, [country]); // Runs when `country` changes
  
    if (error) return <p>Error loading weather: {error}</p>;
    if (!weather) return <p>Loading weather...</p>;
  
    return (
      <div>
        <h4>Weather in {country.capital}</h4>
        <p>Temperature: {weather.main.temp}°C</p>
        <p>Weather: {weather.weather[0].description}</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="Weather icon" />
      </div>
    );
  };
  
  const Content = ({  setUserInput, filteredList }) => {
    let content;
    if (filteredList.length > 10) {
      content = <p>Too many matches, specify another filter</p>;
    } else if (filteredList.length > 1) {
      content = (
        <ul>
          {filteredList.map(country => (
            <li key={country.name.common}>{country.name.common} <button onClick={() => setUserInput(country.name.common)}>Show</button></li>
          ))}
        </ul>
      );
    } else if (filteredList.length === 1) {
      const country = filteredList[0];
      content = (
        <div>
          <h3>{country.name.common}</h3>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area}</p>
          <h4>Languages:</h4>
          <ul>
            {Object.values(country.languages).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={country.name.common}  />
          <Weather country={country} />
        </div>
      );
    } else {
      content = <p>No matches found</p>;
    }
  
    return content;
      
  }
  
  export {Content, Weather};