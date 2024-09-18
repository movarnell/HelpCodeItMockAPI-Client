// src/components/AddField.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useParams, Link } from 'react-router-dom';

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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Add Field</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Field Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value.trim())}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Data Type</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          >
            {dataTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
          />
          <label className="ml-2 text-sm">Is Required</label>
        </div>
        <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Add Field
        </button>
      </form>
      <div className="mt-4 space-x-2">
        <button
          className="px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600"
          onClick={() => handleNavigate(`/endpoints/${id}/add-data`)}
        >
          Add Data
        </button>
        <button
          className="px-4 py-2 font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600"
          onClick={() => handleNavigate(`/endpoints/${id}`)}
        >
          Back to Main
        </button>
      </div>
      <div className="px-4 py-2 mt-24 mb-4 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default AddField;