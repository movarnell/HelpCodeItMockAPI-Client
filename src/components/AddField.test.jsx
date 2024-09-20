import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import AddField from './AddField';
import axiosInstance from '../api/axiosInstance';
import { act } from 'react-dom/test-utils';

jest.mock('../api/axiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
}));

describe('AddField Component', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ id: '1' });
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AddField />
        </BrowserRouter>
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

  test('submits form with field data', async () => {
    axiosInstance.post.mockResolvedValue({ data: { field_id: 1 } });
    await renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Field Name'), { target: { value: 'test_field' } });
      fireEvent.change(screen.getByLabelText('Data Type'), { target: { value: 'STRING' } });
      fireEvent.click(screen.getByLabelText('Is Required'));
      fireEvent.click(screen.getByRole('button', { name: /add field/i }));
    });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/endpoints/1/fields', {
        fields: [{
          field_name: 'test_field',
          data_type: 'STRING',
          is_required: true,
        }]
      });
    });
  });
});