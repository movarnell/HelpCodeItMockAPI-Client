import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navigation from './Navigation';

function AddField() {
  const { id } = useParams(); // Endpoint ID
  const [fieldName, setFieldName] = useState('');
  const [dataType, setDataType] = useState('VARCHAR');
  const [isRequired, setIsRequired] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const dataTypes = [
    'INT',
    'VARCHAR',
    'TEXT',
    'DATE',
    'DATETIME',
    'BOOLEAN',
    'FLOAT',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/endpoints/${id}/fields`, {
        fields: [
          {
            field_name: fieldName.trim(),
            data_type: dataType,
            is_required: isRequired,
          },
        ],
      });
      navigate(`/endpoints/${id}/fields`);
    } catch (err) {
      setError(err.response.data.message || 'Failed to add field');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Field</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">Field Name</label>
              <input
                type="text"
                id="fieldName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value.trim())}
                required
              />
            </div>
            <div>
              <label htmlFor="dataType" className="block text-sm font-medium text-gray-700">Data Type</label>
              <select
                id="dataType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              >
                {dataTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isRequired"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isRequired" className="font-medium text-gray-700">Is Required</label>
              </div>
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Field
            </button>
          </form>
        </div>
        <div className="mt-8 space-x-4">
          <button
            onClick={() => handleNavigate(`/endpoints/${id}/add-data`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Data
          </button>
          <button
            onClick={() => handleNavigate(`/endpoints/${id}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Main
          </button>
          <Link to="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddField;