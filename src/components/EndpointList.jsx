import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { IoArrowBack } from 'react-icons/io5';

function EndpointList() {
  const [endpoints, setEndpoints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const response = await axiosInstance.get('/endpoints');
        setEndpoints(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEndpoints();
  }, []);

  const deleteEndpoint = async (id) => {
    try {
      await axiosInstance.delete(`/endpoints/${id}`);
      setEndpoints(endpoints.filter(endpoint => endpoint.endpoint_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="mr-4 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
            data-testid="back-arrow"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Endpoint List</h1>
        </div>
        <div className="mb-8 overflow-x-auto bg-white shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">Name</th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">URL</th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">Methods</th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {endpoints.map((endpoint) => (
                <tr key={endpoint.endpoint_id}>
                  <td className="px-3 py-4 text-sm font-medium text-gray-900 sm:px-6 whitespace-nowrap">{endpoint.endpoint_name}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 break-all sm:px-6">{`https://backend.michaelvarnell.com:5100/api/${endpoint.endpoint_name}`}</td>
                  <td className="px-3 py-4 text-sm text-gray-500 sm:px-6 whitespace-nowrap">{endpoint.http_methods.join(', ')}</td>
                  <td className="px-3 py-4 text-sm font-medium sm:px-6">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => navigate(`/endpoints/${endpoint.endpoint_id}/fields`)}
                        className="px-3 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Manage Fields
                      </button>
                      <button
                        onClick={() => navigate(`/api/${endpoint.endpoint_name}`)}
                        className="px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Data
                      </button>
                      <button
                        onClick={() => deleteEndpoint(endpoint.endpoint_id)}
                        className="px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mb-4 text-lg font-medium leading-6 text-gray-900">How to Use Your Endpoints</h2>
            {endpoints.map((endpoint) => (
              <div key={endpoint.endpoint_id} className="mb-8">
                <h3 className="mb-2 font-medium text-gray-900 text-md">{endpoint.endpoint_name}</h3>
                <p className="mb-2 text-sm text-gray-600">Base URL: <code className="p-1 break-all bg-gray-100 rounded">{`https://backend.michaelvarnell.com:5100/api/${endpoint.endpoint_name}`}</code></p>
                {endpoint.http_methods.includes('GET') && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900">GET (Read data)</h4>
                    <pre className="p-2 overflow-x-auto text-sm bg-gray-100 rounded">
                      <code className="break-words whitespace-pre-wrap">
{`const fetchData = async () => {
  try {
    const response = await fetch('https://backend.michaelvarnell.com:5100/api/${endpoint.endpoint_name}');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

fetchData();`}
                      </code>
                    </pre>
                  </div>
                )}
                {endpoint.http_methods.includes('POST') && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900">POST (Create new data)</h4>
                    <pre className="p-2 overflow-x-auto text-sm bg-gray-100 rounded">
                      <code className="break-words whitespace-pre-wrap">
{`const postData = async (newData) => {
  try {
    const response = await fetch('https://backend.michaelvarnell.com:5100/api/${endpoint.endpoint_name}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
};

const newData = { /* your data here */ };
postData(newData);`}
                      </code>
                    </pre>
                  </div>
                )}
                {endpoint.http_methods.includes('PUT') && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900">PUT (Update existing data)</h4>
                    <pre className="p-2 overflow-x-auto text-sm bg-gray-100 rounded">
                      <code className="break-words whitespace-pre-wrap">
{`const updateData = async (id, updatedData) => {
  try {
    const response = await fetch(\`https://backend.michaelvarnell.com:5100/api/${endpoint.endpoint_name}/\${id}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
};

const id = '123'; // Replace with actual ID
const updatedData = { /* your updated data here */ };
updateData(id, updatedData);`}
                      </code>
                    </pre>
                  </div>
                )}
                {endpoint.http_methods.includes('DELETE') && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900">DELETE (Remove data)</h4>
                    <pre className="p-2 overflow-x-auto text-sm bg-gray-100 rounded">
                      <code className="break-words whitespace-pre-wrap">
{`const deleteData = async (id) => {
  try {
    const response = await fetch(\`https://backend.michaelvarnell.com:5100/api/${endpoint.endpoint_name}/\${id}\`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
};

const id = '123'; // Replace with actual ID
deleteData(id);`}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <Link to="/dashboard" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EndpointList;