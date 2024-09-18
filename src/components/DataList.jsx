// src/components/DataList.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams, Link } from 'react-router-dom';

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
      <h1 className="mb-4 text-2xl font-bold">Data for {endpointName}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Link
        to={`/api/${endpointName}/add`}
        className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Add Data
      </Link>
      <table className="w-full mt-10 text-left table-auto border-collapse border border-gray-300">
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
      <div className="px-4 py-2 mb-4 mt-24 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 w-fit">
        <Link to={'/dashboard'}> Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default DataList;