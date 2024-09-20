import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navigation from './Navigation';
import { IoArrowBack } from 'react-icons/io5'; // Import the back arrow icon

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
      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link
            to="/endpoints"
            className="mr-4 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
          >
            <IoArrowBack className="w-8 h-8" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add Field</h1>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Note: You don't need to assign an ID - the API will automatically generate and assign an ID for each new field.
        </p>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="fieldName" className="block text-sm font-medium text-gray-700">Field Name</label>
              <input
                type="text"
                id="fieldName"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value.trim())}
                required
              />
            </div>
            <div>
              <label htmlFor="dataType" className="block text-sm font-medium text-gray-700">Data Type</label>
              <select
                id="dataType"
                className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isRequired" className="font-medium text-gray-700">Is Required</label>
              </div>
            </div>
            <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Field
            </button>
          </form>
        </div>
        <div className="mt-8 space-x-4">
          <button
            onClick={() => handleNavigate(`/endpoints/${id}/add-data`)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Data
          </button>
          <Link to={'/endpoints'} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Back to Endpoints</Link>
          <Link to="/dashboard" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddField;