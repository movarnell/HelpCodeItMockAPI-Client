import React from 'react';
import { Link } from 'react-router-dom';
//import { IoArrowBack } from 'react-icons/io5';
import Navigation from './Navigation';
import logo from '../assets/Mock It.png';
function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          {/* <Link
            to="/"
            className="mr-4 text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
          >
            <IoArrowBack className="w-6 h-6" />
          </Link> */}
          <h1 data-testid="Dashboard" className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="mx-auto space-x-4">
              <h3 className="text-2xl font-semibold text-gray-800 ms-4">Latest Updates</h3>
              <ul className="list-disc list-inside">
                <li> New and improved UI</li>
                <li>

                  Added ability to add data using JSON input
                </li>
              </ul>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center p-6 space-y-4 border-4 border-gray-200 border-dashed rounded-lg">
          <div className="w-full max-w-xs">
            <img
              src={logo}
              alt="logo"
              className="object-contain w-full h-auto"
            />
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-800" data-testid="Welcome">Welcome to Your Dashboard</h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link
              to="/endpoints/create"
              className="px-4 py-2 font-medium text-white transition duration-150 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              data-testid="Create New Endpoint"
            >
              Create New Endpoint
            </Link>
            <Link
              to="/endpoints"
              className="px-4 py-2 font-medium text-white transition duration-150 ease-in-out bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View Endpoints
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;