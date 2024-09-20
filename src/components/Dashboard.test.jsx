import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import renderer from 'react-test-renderer';

// Mock the Navigation component
jest.mock('./Navigation', () => () => <div data-testid="navigation" />);

describe('Dashboard Component', () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  test('renders dashboard title', () => {
    renderComponent();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renders create endpoint button', () => {
    renderComponent();
    expect(screen.getByText('Create New Endpoint')).toBeInTheDocument();
  });

  test('renders view endpoints button', () => {
    renderComponent();
    expect(screen.getByText('View Endpoints')).toBeInTheDocument();
  });

  test('renders navigation component', () => {
    renderComponent();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});