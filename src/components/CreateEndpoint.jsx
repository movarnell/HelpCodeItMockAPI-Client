// src/components/CreateEndpoint.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

function CreateEndpoint() {
  const [endpointName, setEndpointName] = useState('');
  const [httpMethods, setHttpMethods] = useState({
    GET: true,
    POST: true,
    PUT: true,
    DELETE: true,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedMethods = Object.keys(httpMethods).filter(
        (method) => httpMethods[method]
      );
      console.log('Endpoint Name:', endpointName);
      console.log('Selected Methods:', selectedMethods);

      await axiosInstance.post('/endpoints', {
        endpoint_name: endpointName,
        http_methods: selectedMethods,
      });
      navigate('/endpoints');
    } catch (err) {
      console.error('Error Response:', err.response);
      setError(err.response?.data?.message || 'Failed to create endpoint');
    }
  };

  const handleMethodChange = (e) => {
    const { name, checked } = e.target;
    setHttpMethods((prevMethods) => ({
      ...prevMethods,
      [name]: checked,
    }));
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
          {!endpointName && (
            <p className="text-red-500">Endpoint name is required.</p>
          )}
        </div>
        <div>
          <label className="block text-sm">HTTP Methods</label>
          <div className="flex space-x-4">
            {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="checkbox"
                  name={method}
                  checked={httpMethods[method]}
                  onChange={handleMethodChange}
                  className="mr-2"
                />
                {method}
              </label>
            ))}
          </div>
          {!Object.values(httpMethods).some(Boolean) && (
            <p className="text-red-500">At least one HTTP method must be selected.</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!endpointName || !Object.values(httpMethods).some(Boolean)}
          className={`px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 ${
            (!endpointName || !Object.values(httpMethods).some(Boolean)) && 'opacity-50 cursor-not-allowed'
          }`}
        >
          Create Endpoint
        </button>
      </form>
      <div className="px-4 py-2 mt-24 mb-4 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default CreateEndpoint;