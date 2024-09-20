import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams, Link } from 'react-router-dom';
import Navigation from './Navigation';
import { IoArrowBack } from 'react-icons/io5';

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
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link
            to="/endpoints"
            className="mr-4 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
          >
            <IoArrowBack className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Field List</h1>
        </div>
        <div className="mb-6">
          <Link
            to={`/endpoints/${id}/fields/add`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Field
          </Link>
        </div>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Field Name</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Data Type</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Is Required</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((field) => (
                <tr key={field.field_id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{field.field_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{field.data_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{field.is_required ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default FieldList;