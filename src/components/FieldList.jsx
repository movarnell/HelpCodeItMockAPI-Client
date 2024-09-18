// src/components/FieldList.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams, Link } from 'react-router-dom';

function FieldList() {
  const { id } = useParams(); // Endpoint ID
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axiosInstance.get(`/endpoints/${id}/fields`);
        setFields(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFields();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Manage Fields</h1>
      <Link
        to={`/endpoints/${id}/fields/add`}
        className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Add Field
      </Link>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Field Name</th>
            <th className="px-4 py-2">Data Type</th>
            <th className="px-4 py-2">Is Required</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.field_id}>
              <td className="px-4 py-2">{field.field_name}</td>
              <td className="px-4 py-2">{field.data_type}</td>
              <td className="px-4 py-2">{field.is_required ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FieldList;