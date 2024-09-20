// src/components/Login.jsx
import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/Mock It.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 rounded">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded shadow">
        {/* <h1 className="text-4xl font-bold text-center">Mock API</h1> */}
        <img src={logo} alt="logo" className="w-1/2 mx-auto" />
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Login
          </button>
          <p className="text-sm text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
            <br />
            This app is currently free to use.
            <br />If you have any issues please let us know using our <a href="https://www.helpcodeit.com/contact" className="text-blue-500 hover:underline">contact form!</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;