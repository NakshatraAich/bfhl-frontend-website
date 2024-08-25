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
      <div className='mt-4'>
        <h2 className='text-lg font-semibold mb-2'>Response:</h2>
        {selectedOptions.includes('Numbers') && (
          <div className='mb-4'>
            <h3 className='text-md font-medium mb-1'>Numbers:</h3>
            <ul className='list-disc pl-5'>
              {response.numbers.map((num, index) => (
                <li key={index}>{num}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedOptions.includes('Alphabets') && (
          <div className='mb-4'>
            <h3 className='text-md font-medium mb-1'>Alphabets:</h3>
            <ul className='list-disc pl-5'>
              {response.alphabets.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
        )}
        {selectedOptions.includes('Highest lowercase alphabet') && (
          <div className='mb-4'>
            <h3 className='text-md font-medium mb-1'>Highest Lowercase Alphabet:</h3>
            <ul className='list-disc pl-5'>
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
    <div className='flex flex-col gap-8 p-8 max-w-md mx-auto bg-gray-100 border border-gray-300 rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-4'>API Input</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-lg font-medium mb-2'>
            Input (JSON format):
            <textarea
              value={inputValue}
              onChange={handleChange}
              required
              rows="6"
              className='w-full p-2 border border-gray-300 rounded-md'
            />
          </label>
        </div>
        <button 
          type="submit"
          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
        >
          Submit
        </button>
      </form>
      {response && (
        <div>
          <label className='block text-lg font-medium mb-2'>
            Select options to display:
            <select 
              multiple={true} 
              onChange={handleSelectChange} 
              className='w-full mt-2 p-2 border border-gray-300 rounded-md'
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
            </select>
          </label>
          {renderResponse()}
        </div>
      )}
      {error && (
        <div className='mt-4'>
          <h2 className='text-lg font-semibold text-red-600'>Error:</h2>
          <p className='text-red-600'>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Form;
