import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateEndpoint from './CreateEndpoint';
import axiosInstance from '../api/axiosInstance';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';

jest.mock('../api/axiosInstance');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('CreateEndpoint Component', () => {
  const renderComponent = async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <CreateEndpoint />
        </BrowserRouter>
      );
    });
  };

  test('renders create endpoint form', async () => {
    await renderComponent();
    expect(screen.getByLabelText('Endpoint Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create endpoint/i })).toBeInTheDocument();
  });

  test('submits form with endpoint data', async () => {
    axiosInstance.post.mockResolvedValue({ data: { endpoint_id: 1 } });
    await renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Endpoint Name'), { target: { value: 'test_endpoint' } });
      fireEvent.click(screen.getByRole('button', { name: /create endpoint/i }));
    });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/endpoints', {
        endpoint_name: 'test_endpoint',
        http_methods: expect.arrayContaining(['GET', 'POST', 'PUT', 'DELETE'])
      });
    });
  });

  test('matches snapshot', () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <CreateEndpoint />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});