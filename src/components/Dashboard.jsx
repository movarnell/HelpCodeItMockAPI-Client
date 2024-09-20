import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col items-center justify-center space-y-6 border-4 border-gray-200 border-dashed rounded-lg h-96">
            <h2 className="mb-4 text-3xl font-semibold text-gray-800">Welcome to Your Dashboard</h2>
            <div className="flex space-x-4">
              <Link
                to="/endpoints/create"
                className="px-6 py-3 font-medium text-white transition duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Endpoint
              </Link>
              <Link
                to="/endpoints"
                className="px-6 py-3 font-medium text-white transition duration-150 ease-in-out bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View Endpoints
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;