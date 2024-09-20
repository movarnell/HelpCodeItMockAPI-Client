import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EndpointList from './EndpointList';
import axiosInstance from '../api/axiosInstance';
import { act } from 'react-dom/test-utils';

// Mock the axiosInstance
jest.mock('../api/axiosInstance');

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('EndpointList Component', () => {
  const mockEndpoints = [
    { endpoint_id: 1, endpoint_name: 'users', http_methods: ['GET', 'POST'] },
    { endpoint_id: 2, endpoint_name: 'products', http_methods: ['GET'] },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockEndpoints });
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <EndpointList />
        </BrowserRouter>
      );
    });
    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalled());
  };

  test('renders EndpointList component', async () => {
    await renderComponent();
    expect(screen.getByText('Endpoint List')).toBeInTheDocument();
    expect(screen.getByText('users')).toBeInTheDocument();
    expect(screen.getByText('products')).toBeInTheDocument();
  });

  test('navigates back to dashboard when back arrow is clicked', async () => {
    await renderComponent();
    const backArrow = screen.getByTestId('back-arrow');
    await act(async () => {
      fireEvent.click(backArrow);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
