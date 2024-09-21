// src/components/AddData.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useParams, Link } from 'react-router-dom';

function AddData() {
  const { endpointName } = useParams();
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState('');
  const [inputMode, setInputMode] = useState('form'); // 'form' or 'json'

  useEffect(() => {
    const fetchFields = async () => {
      try {
        // Fetch the endpoint ID
        const endpointResponse = await axiosInstance.get('/endpoints');
        const endpoint = endpointResponse.data.find(
          (ep) => ep.endpoint_name === endpointName
        );
        console.log("AddData shows endpoint: ", endpoint);
        if (!endpoint) {
          setError('Endpoint not found');
          return;
        }
        const endpointId = endpoint.endpoint_id;

        // Fetch fields for the endpoint
        const fieldsResponse = await axiosInstance.get(
          `/endpoints/${endpointId}/fields`
        );
        console.log("AddData shows fieldsResponse: ", fieldsResponse.data);
        setFields(fieldsResponse.data);
      } catch (err) {
        setError('Failed to fetch fields');
      }
    };

    fetchFields();
  }, [endpointName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataToSend;

      if (inputMode === 'form') {
        // Prepare data to send
        dataToSend = { ...formData };

        // Convert data types if necessary
        fields.forEach((field) => {
          const { field_name, data_type } = field;
          if (dataToSend[field_name]) {
            switch (data_type) {
              case 'INT':
                dataToSend[field_name] = parseInt(dataToSend[field_name], 10);
                break;
              case 'FLOAT':
                dataToSend[field_name] = parseFloat(dataToSend[field_name]);
                break;
              case 'BOOLEAN':
                dataToSend[field_name] = dataToSend[field_name] === 'true';
                break;
              default:
                // For other types, keep as is
                break;
            }
          }
        });

        // {{ Remove the duplicate POST request and navigation }}
        // await axiosInstance.post(`/api/${endpointName}`, dataToSend);
        // navigate(`/api/${endpointName}`);
      } else {
        // Parse JSON input
        try {
          dataToSend = JSON.parse(jsonInput);
        } catch (err) {
          setError('Invalid JSON format');
          return;
        }
      }

      // Send data based on the input mode
      if (Array.isArray(dataToSend)) {
        // Send multiple objects
        await Promise.all(
          dataToSend.map((item) => axiosInstance.post(`/api/${endpointName}`, item))
        );
      } else {
        // Send single object
        await axiosInstance.post(`/api/${endpointName}`, dataToSend);
      }

      navigate(`/api/${endpointName}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add data');
    }
  };

  const generatePlaceholder = () => {
    const sampleObject = fields.reduce((acc, field) => {
      switch (field.data_type) {
        case 'INT':
          acc[field.field_name] = 0;
          break;
        case 'FLOAT':
          acc[field.field_name] = 0.0;
          break;
        case 'BOOLEAN':
          acc[field.field_name] = true;
          break;
        default:
          acc[field.field_name] = "value";
      }
      return acc;
    }, {});

    const singleObjectExample = JSON.stringify(sampleObject, null, 2);
    const arrayExample = JSON.stringify([sampleObject, sampleObject], null, 2);

    return `Single object example:\n${singleObjectExample}\n\nArray example:\n${arrayExample}`;
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Add Data to {endpointName}</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 font-bold text-white rounded-md ${inputMode === 'form' ? 'bg-blue-500' : 'bg-gray-400'}`}
          onClick={() => setInputMode('form')}
        >
          Form Input
        </button>
        <button
          className={`px-4 py-2 font-bold text-white rounded-md ${inputMode === 'json' ? 'bg-blue-500' : 'bg-gray-400'}`}
          onClick={() => setInputMode('json')}
        >
          JSON Input
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputMode === 'form' ? (
          fields.map((field) => (
            <div key={field.field_id}>
              <label className="block text-sm">{field.field_name}</label>
              <input
                type="text"
                name={field.field_name}
                className="w-full px-4 py-2 border rounded-md"
                value={formData[field.field_name] || ''}
                onChange={handleChange}
                required={field.is_required}
              />
            </div>
          ))
        ) : (
          <div>
            <label className="block text-sm">JSON Input (Array or Single Object)</label>
            <textarea
              className="w-full px-4 py-2 font-mono text-sm border rounded-md"
              rows="15"
              value={jsonInput}
              onChange={handleJsonChange}
              placeholder={generatePlaceholder()}
            ></textarea>
          </div>
        )}
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Add Data
        </button>
      </form>

      <div className="px-4 py-2 mt-24 mb-4 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default AddData;