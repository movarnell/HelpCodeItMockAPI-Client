import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import renderer from 'react-test-renderer';

// Mock the react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Navigation', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: '/' });
  });

  test('renders navigation links', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Help Mock It')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Endpoints')).toBeInTheDocument();
    expect(screen.getByText('Create Endpoint')).toBeInTheDocument();
  });

  test('logout button calls handleLogout', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );
    });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('active link has correct style', async () => {
    useLocation.mockReturnValue({ pathname: '/dashboard' });

    await act(async () => {
      render(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      );
    });

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toHaveClass('border-indigo-500');
    expect(dashboardLink).toHaveClass('text-gray-900');

    const endpointsLink = screen.getByText('Endpoints');
    expect(endpointsLink).toHaveClass('border-transparent');
    expect(endpointsLink).toHaveClass('text-gray-500');
  });

  test('matches snapshot', () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <Navigation />
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});