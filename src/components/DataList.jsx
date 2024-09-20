// src/components/DataList.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams, Link } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
function DataList() {
  const { endpointName } = useParams();
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState('');

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/api/${endpointName}`);
      console.log('Fetched Data:', response.data); // Debugging line
      setDataList(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpointName]);

  // Handle delete action
  const handleDelete = async (dataId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    console.log(`Attempting to delete data_id: ${dataId}`); // Debugging line

    try {
      await axiosInstance.delete(`/api/${endpointName}`, {
        params: { id: dataId }, // Using params option
      });
      console.log(`Deleted data_id: ${dataId}`); // Debugging line
      // Update the dataList state to remove the deleted item
      setDataList(dataList.filter(item => item.data_id !== dataId));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete data.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link
              to="/dashboard"
              className="mr-4 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
            >
              <IoArrowBack className="w-8 h-8" />
            </Link>
        <h1 className="text-3xl font-bold ">Data for the {endpointName} endpoint</h1>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Link
        to={`/api/${endpointName}/add`}
        className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Add Data
      </Link>
      <table className="w-full mt-10 text-left border border-collapse border-gray-300 table-auto">
        <thead>
          <tr className="bg-gray-200">
            {dataList.length > 0 &&
              Object.keys(dataList[0]).map((key) => (
                key !== 'data_id' && ( // Optionally hide data_id from the table
                  <th key={key} className="px-4 py-2 border border-gray-300">
                    {key}
                  </th>
                )
              ))}
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.data_id} className="hover:bg-gray-100">
              {Object.entries(item).map(([key, value]) => (
                key !== 'data_id' && ( // Optionally hide data_id from the table
                  <td key={key} className="px-4 py-2 border border-gray-300">
                    {value}
                  </td>
                )
              ))}
              <td className="px-4 py-2 border border-gray-300">
                <button
                  onClick={() => handleDelete(item.data_id)}
                  className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 mt-24 mb-4 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default DataList;