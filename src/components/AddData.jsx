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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Prepare data to send
        const dataToSend = { ...formData };

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

        await axiosInstance.post(`/api/${endpointName}`, dataToSend);
        navigate(`/api/${endpointName}`);
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to add data');
    }
};

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Add Data to {endpointName}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
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
))}
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Add Data
        </button>
      </form>

      <div className="px-4 py-2 mb-4 mt-24 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default AddData;