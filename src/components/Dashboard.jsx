// src/components/Dashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between p-6 bg-white shadow">
        <h1 className="text-2xl font-bold">Dynamic API App</h1>
        <div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="p-6">
        <div className="space-y-4">
          <Link
            to="/endpoints/create"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Create New Endpoint
          </Link>
          <Link
            to="/endpoints"
            className="px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600"
          >
            View Endpoints
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;