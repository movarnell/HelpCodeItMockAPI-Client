import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import AddData from './AddData';
import axiosInstance from '../api/axiosInstance';
import { act } from 'react-dom/test-utils';

jest.mock('../api/axiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
}));

describe('AddData Component', () => {
  const mockFields = [
    { field_id: 1, field_name: 'name', data_type: 'STRING', is_required: true },
    { field_id: 2, field_name: 'age', data_type: 'INT', is_required: false },
  ];

  beforeEach(() => {
    useParams.mockReturnValue({ endpointName: 'test_endpoint' });
    axiosInstance.get.mockResolvedValueOnce({ data: [{ endpoint_id: 1, endpoint_name: 'test_endpoint' }] });
    axiosInstance.get.mockResolvedValueOnce({ data: mockFields });
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AddData />
        </BrowserRouter>
      );
    });
    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalledTimes(2));
  };

  test('renders add data form', async () => {
    await renderComponent();
    expect(screen.getByText(/add data to test_endpoint/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
  });

  test('submits form with data', async () => {
    axiosInstance.post.mockResolvedValue({ data: { id: 1 } });
    await renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Name' } });
      fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '25' } });
      fireEvent.click(screen.getByRole('button', { name: /add data/i }));
    });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/test_endpoint', {
        name: 'Test Name',
        age: 25,
      });
    });
  });
});