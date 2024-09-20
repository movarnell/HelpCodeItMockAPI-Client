import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from './Navigation';

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
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Endpoint</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label htmlFor="endpointName" className="block text-sm font-medium text-gray-700">Endpoint Name</label>
              <input
                type="text"
                id="endpointName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={endpointName}
                onChange={(e) => setEndpointName(e.target.value)}
                required
              />
              {!endpointName && <p className="mt-2 text-sm text-red-600">Endpoint name is required.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">HTTP Methods</label>
              <div className="mt-2 space-y-2">
                {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
                  <div key={method} className="flex items-center">
                    <input
                      id={`method-${method}`}
                      name={method}
                      type="checkbox"
                      checked={httpMethods[method]}
                      onChange={handleMethodChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`method-${method}`} className="ml-2 block text-sm text-gray-900">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
              {!Object.values(httpMethods).some(Boolean) && <p className="mt-2 text-sm text-red-600">At least one HTTP method must be selected.</p>}
            </div>
            <button
              type="submit"
              disabled={!endpointName || !Object.values(httpMethods).some(Boolean)}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                (!endpointName || !Object.values(httpMethods).some(Boolean)) && 'opacity-50 cursor-not-allowed'
              }`}
            >
              Create Endpoint
            </button>
          </form>
        </div>
        <div className="mt-8">
          <Link to="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateEndpoint;