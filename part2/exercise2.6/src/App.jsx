import { useState , useEffect } from 'react'
import { FilterText, AddNewName, FilterPerson }  from './components/component';
import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'
const App = () => {
  // const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '9872966804', id:1 }])
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [greenNotificationMessage, setGreenNotificationMessage] = useState(null);
  const [redNotificationMessage, setRedNotificationMessage] = useState(null);

  useEffect(() => {
    axios.get(baseUrl).then(response =>setPersons(response.data))
  }, [])

  const GreenNotification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='green_msg'>
        {message}
      </div>
    )
  }

  const RedNotification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='red_msg'>
        {message}
      </div>
    )
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange= (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }
  const addPerson = (event) => {
    event.preventDefault();
  
    const trimmedName = newName.trim(); // Remove leading & trailing spaces
    const trimmedNumber = newNumber.trim(); 
  
    if (!trimmedName) {
      alert("Name cannot be empty!");
      return;
    }
    axios.get(baseUrl).then(response => {
      const latestPersons = response.data;

      // Check if the name already exists
      const existingPerson = latestPersons.find(person => person.name.trim().toLowerCase() === trimmedName.toLowerCase());

      if (existingPerson) {
        const confirmationReplace = window.confirm(
          `${trimmedName} is already in the phonebook. Do you want to replace the old number with a new one?`
        );

        if (confirmationReplace) {
          axios.put(`${baseUrl}/${existingPerson.id}`, {
            name: trimmedName,
            number: trimmedNumber
          })
          .then(response => {
            setPersons(latestPersons.map(person =>
              person.id === response.data.id ? response.data : person
            ));
            setGreenNotificationMessage(`Updated ${trimmedName}'s number`);
            setTimeout(() => {
              setGreenNotificationMessage(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.log("Error updating person:", error);
            setRedNotificationMessage(`Error updating ${trimmedName}'s number`);
            setTimeout(() => {
              setRedNotificationMessage(null);
            }, 5000);
          });
        }
        return;
      }
    
    // Add new person if not found
    axios.post(baseUrl, { name: trimmedName, number: trimmedNumber })
      .then(response => {
        setPersons([...persons, response.data]);
        setNewName('');
        setNewNumber('');
        setGreenNotificationMessage(`Added ${trimmedName}`);
        setTimeout(() => {
          setGreenNotificationMessage(null);
        }, 5000);
      })
      .catch(error => {console.error("Error adding person:", error)
        setRedNotificationMessage(`Error adding ${trimmedName}`);
        setTimeout(() => {
          setRedNotificationMessage(null);}, 5000);
      });
    });
  };
 
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()));

  return(
    <div>
      <GreenNotification message={greenNotificationMessage} />
      <RedNotification message={redNotificationMessage} />
      <FilterText filterName={filterName} handleFilterChange={handleFilterChange}/>

      <AddNewName addPerson={addPerson} newName={newName} newNumber={newNumber} handleNumberChange={handleNumberChange} handleNameChange={handleNameChange}/>
      <FilterPerson filteredPersons={filteredPersons} setPersons={setPersons} setGreenNotificationMessage={setGreenNotificationMessage} setRedNotificationMessage={setRedNotificationMessage}/>
      
    </div>
  
  ); 

};
export default App;
