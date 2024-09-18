// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateEndpoint from './components/CreateEndpoint';
import EndpointList from './components/EndpointList';
import FieldList from './components/FieldList';
import AddField from './components/AddField';
import DataList from './components/DataList';
import AddData from './components/AddData';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/endpoints/create" element={<CreateEndpoint />} />
        <Route path="/endpoints" element={<EndpointList />} />
        <Route path="/endpoints/:id/fields" element={<FieldList />} />
        <Route path="/endpoints/:id/fields/add" element={<AddField />} />

        {/* Dynamic API Interaction */}
        <Route path="/api/:endpointName" element={<DataList />} />
        <Route path="/api/:endpointName/add" element={<AddData />} />

        {/* Default Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;