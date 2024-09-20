import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Login from './Login';
import axiosInstance from '../api/axiosInstance';
import { act } from 'react-dom/test-utils';

jest.mock('../api/axiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });
  };

  test('renders login form', async () => {
    await renderComponent();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });
    await renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error message on login failure', async () => {
    axiosInstance.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
    await renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});