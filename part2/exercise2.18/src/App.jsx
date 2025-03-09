import { useState, useEffect } from "react";
import axios from "axios";
import {Content, Weather} from "./components/component";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/";

function App() {
  const [countries, setCountries] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  
  // Fetch data from server for the first time
  useEffect(() => {
    axios.get(baseUrl + "all")
      .then(response => setCountries(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  
  // Update filtered list when userInput or countries change
  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredList(filtered);
  }, [userInput, countries]);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div>
      <label>Find Countries:</label>
      <input type="text" value={userInput} onChange={handleUserInput} />
      <h3>Matching Countries:</h3>
      <Content setUserInput={setUserInput} filteredList={filteredList} />
    </div>
  );
}

export default App;
