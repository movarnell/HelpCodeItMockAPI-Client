import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FieldList from './FieldList';
import axiosInstance from '../api/axiosInstance';
import { act } from 'react';

jest.mock('../api/axiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ id: '1' }),
}));

describe('FieldList Component', () => {
  const mockFields = [
    { field_id: 1, field_name: 'name', data_type: 'STRING', is_required: true },
    { field_id: 2, field_name: 'age', data_type: 'INT', is_required: false },
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockFields });
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/endpoints/1/fields']}>
          <Routes>
            <Route path="/endpoints/:id/fields" element={<FieldList />} />
          </Routes>
        </MemoryRouter>
      );
    });
    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalled());
  };

  test('renders FieldList component', async () => {
    await renderComponent();
    expect(screen.getByText('Field List')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('age')).toBeInTheDocument();
  });

  test('navigates to add field page when Add Field button is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByText(/add field/i));
    expect(mockNavigate).toHaveBeenCalledWith('/endpoints/1/fields/add');
  });

  test('navigates back to endpoints when back arrow is clicked', async () => {
    await renderComponent();
    fireEvent.click(screen.getByTestId('back-arrow'));
    expect(mockNavigate).toHaveBeenCalledWith('/endpoints');
  });
});