import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams } from 'react-router-dom';
import DataList from './DataList';
import axiosInstance from '../api/axiosInstance';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';

jest.mock('../api/axiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
}));

describe('DataList Component', () => {
  const mockData = [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
  ];

  beforeEach(() => {
    useParams.mockReturnValue({ endpointName: 'test_endpoint' });
    axiosInstance.get.mockResolvedValue({ data: mockData });
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <DataList />
        </BrowserRouter>
      );
    });
    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalled());
  };

  test('renders data list', async () => {
    await renderComponent();
    expect(screen.getByText(/data for the test_endpoint endpoint/i)).toBeInTheDocument();
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  test('renders add data button', async () => {
    await renderComponent();
    expect(screen.getByText('Add Data')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <DataList />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});