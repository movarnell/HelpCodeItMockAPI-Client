// src/components/EndpointList.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

function EndpointList() {
  const [endpoints, setEndpoints] = useState([]);

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

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Your API Endpoints</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Endpoint Name</th>
              <th className="px-4 py-2">URL</th>
              <th className="px-4 py-2">HTTP Methods</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <tr key={endpoint.endpoint_id}>
                <td className="px-4 py-2">{endpoint.endpoint_name}</td>
                <td className="px-4 py-2 break-all">{`https://backend.michaelvarnell.com:5100/api/${endpoint.endpoint_name}`}</td>
                <td className="px-4 py-2">
                  {endpoint.http_methods.join(', ')}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/endpoints/${endpoint.endpoint_id}/fields`}
                      className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                    >
                      Manage Fields
                    </Link>
                    <Link
                      to={`/api/${endpoint.endpoint_name}`}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      View Data
                    </Link>
                    <button
                      onClick={() => deleteEndpoint(endpoint.endpoint_id)}
                      className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
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
      <div className="px-4 py-2 mt-24 mb-4 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">How to Use This Endpoint</h2>
        <p className="mt-2">
          Send requests to the URL above using the listed HTTP methods. For example:
        </p>
        <pre className="p-2 bg-gray-100 rounded">
          <code>
            curl -X GET http://backend.michaelvarnell.com:5100/api/your-endpoint-name
          </code>
        </pre>
      </div>
    </div>
  );
}

export default EndpointList;