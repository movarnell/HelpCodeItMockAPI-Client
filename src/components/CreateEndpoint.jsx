// src/components/CreateEndpoint.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

function CreateEndpoint() {
  const [endpointName, setEndpointName] = useState('');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/endpoints', {
        endpoint_name: endpointName,
        http_method: httpMethod,
      });
      navigate('/endpoints');
    } catch (err) {
      setError(err.response.data.message || 'Failed to create endpoint');
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Create New Endpoint</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Endpoint Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={endpointName}
            onChange={(e) => setEndpointName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">HTTP Method</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={httpMethod}
            onChange={(e) => setHttpMethod(e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Create Endpoint
        </button>
      </form>
      <div className="px-4 py-2 mb-4 mt-24 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default CreateEndpoint;