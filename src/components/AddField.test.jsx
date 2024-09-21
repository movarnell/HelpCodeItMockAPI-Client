import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import AddField from './AddField';
import axiosInstance from '../api/axiosInstance';
import { act } from 'react-dom/test-utils';

jest.mock('../api/axiosInstance');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

describe('AddField Component', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: '1' });
    axiosInstance.get.mockResolvedValue({ data: { fields: [] } });
    axiosInstance.post.mockResolvedValue({ data: { field_id: 1 } });
    axiosInstance.delete.mockResolvedValue({});
    jest.clearAllMocks();
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AddField />
        </MemoryRouter>
      );
    });
  };

  test('renders add field form', async () => {
    await renderComponent();
    expect(screen.getByLabelText('Field Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Data Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Is Required')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add field/i })).toBeInTheDocument();
  });

  test('submits form with field data and navigates', async () => {
    await renderComponent();

    fireEvent.change(screen.getByLabelText(/field name/i), { target: { value: 'test_field' } });
    fireEvent.change(screen.getByLabelText(/data type/i), { target: { value: 'STRING' } });
    fireEvent.click(screen.getByLabelText(/is required/i));

    fireEvent.submit(screen.getByRole('button', { name: /add field/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/endpoints/1/fields', {
        fields: [{
          field_name: 'test_field',
          data_type: 'STRING',
          is_required: true
        }]
      });
      expect(mockNavigate).toHaveBeenCalledWith('/endpoints/1/fields');
    });
  });

  test('displays error when fetching fields fails', async () => {
    axiosInstance.get.mockRejectedValue(new Error('Network Error'));
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch fields')).toBeInTheDocument();
    });
  });

  test('displays error when form submission fails', async () => {
    axiosInstance.post.mockRejectedValue({
      response: { data: { message: 'Submission Failed' } },
    });
    await renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Field Name'), { target: { value: 'test_field' } });
      fireEvent.change(screen.getByLabelText('Data Type'), { target: { value: 'STRING' } });
      fireEvent.click(screen.getByLabelText('Is Required'));
      fireEvent.click(screen.getByRole('button', { name: /add field/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Submission Failed')).toBeInTheDocument();
    });
  });

  test('renders existing fields', async () => {
    const mockFields = [
      { id: 1, field_name: 'existing_field1' },
      { id: 2, field_name: 'existing_field2' },
    ];
    axiosInstance.get.mockResolvedValue({ data: { fields: mockFields } });
    await renderComponent();

    for (const field of mockFields) {
      expect(await screen.findByText(field.field_name)).toBeInTheDocument();
      expect(screen.getAllByText('Delete')).toHaveLength(mockFields.length);
    }
  });

  test('deletes a field', async () => {
    const mockFields = [
      { id: 1, field_name: 'existing_field1' },
      { id: 2, field_name: 'existing_field2' },
    ];
    axiosInstance.get.mockResolvedValue({ data: { fields: mockFields } });
    await renderComponent();

    // Ensure both fields are rendered
    expect(await screen.findByText('existing_field1')).toBeInTheDocument();
    expect(screen.getByText('existing_field2')).toBeInTheDocument();

    // Delete the first field
    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/endpoints/1/fields/1');
      expect(screen.queryByText('existing_field1')).not.toBeInTheDocument();
      expect(screen.getByText('existing_field2')).toBeInTheDocument();
    });
  });
});