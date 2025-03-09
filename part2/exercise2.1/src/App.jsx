import { useState, useEffect } from 'react';
import { FilterText, AddNewName, FilterPerson } from './components/component';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');

  // Fetch data from server
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilterName(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      window.alert(`${newName} is already in the phonebook.`);
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    axios.post('http://localhost:3001/persons', newPerson)
      .then(response => {
        setPersons([...persons, response.data]);
        setNewName('');
        setNewNumber('');
      })
      .catch(error => console.error("Error adding person:", error));
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div>
      <FilterText filterName={filterName} handleFilterChange={handleFilterChange} />
      <AddNewName addPerson={addPerson} newName={newName} newNumber={newNumber} handleNumberChange={handleNumberChange} handleNameChange={handleNameChange} />
      <FilterPerson filteredPersons={filteredPersons} setPersons={setPersons} /> 
    </div>
  );
};

export default App;
