import { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Parse the input JSON
      const parsedData = JSON.parse(inputValue);
      
      // Validate the parsed data
      if (!Array.isArray(parsedData.data)) {
        throw new Error('Invalid data format');
      }

      // Prepare the data for the POST request
      const data = JSON.stringify(parsedData);

      // Configure the Axios request
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bfhl-server.onrender.com/bfhl',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };

      // Make the Axios request
      const result = await axios.request(config);
      console.log('API Response:', result.data);

      // Check if response contains the necessary arrays
      if (result.data.numbers !== undefined && result.data.alphabets !== undefined) {
        setResponse(result.data);
        setError(null);
      } else {
        setResponse(null);
        setError('Incomplete response from server');
      }
    } catch (err) {
      console.error('API Error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data : err.message);
      setResponse(null);
    }
  };

  const handleSelectChange = (event) => {
    const { options } = event.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setSelectedOptions(selectedValues);
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div>
        <h2>Response:</h2>
        {selectedOptions.includes('Numbers') && (
          <div>
            <h3>Numbers:</h3>
            <ul>
              {response.numbers.map((num, index) => (
                <li key={index}>{num}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedOptions.includes('Alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <ul>
              {response.alphabets.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedOptions.includes('Highest lowercase alphabet') && (
          <div>
            <h3>Highest Lowercase Alphabet:</h3>
            <ul>
              {response.highest_lowercase_alphabet.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-10 bg-red-500 border-2 p-10 border-black'>
      <h1>API Input</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Input (JSON format):
          <textarea
            value={inputValue}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <label>
            Select options to display:
            <select multiple={true} onChange={handleSelectChange} className='dropdown'>
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
            </select>
          </label>
          {renderResponse()}
        </div>
      )}
      {error && (
        <div>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Form;
