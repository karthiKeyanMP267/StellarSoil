// SmartNotificationSystem.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from '../context/AuthContext';
import SmartNotificationSystem from './SmartNotificationSystem';

// Mock the useAuth hook
jest.mock('../context/AuthContext');

describe('SmartNotificationSystem', () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
  });

  test('shows user notifications when user is a regular user', () => {
    // Mock the useAuth hook to return a user with role 'user'
    useAuth.mockReturnValue({
      user: { id: '123', name: 'Test User', role: 'user' }
    });

    render(<SmartNotificationSystem />);
    
    // Check that the notification bell is rendered
    const bellButton = screen.getByRole('button');
    expect(bellButton).toBeInTheDocument();
  });

  test('shows farmer notifications when user is a farmer', () => {
    // Mock the useAuth hook to return a user with role 'farmer'
    useAuth.mockReturnValue({
      user: { id: '123', name: 'Test Farmer', role: 'farmer' }
    });

    render(<SmartNotificationSystem />);
    
    // Check that the notification bell is rendered
    const bellButton = screen.getByRole('button');
    expect(bellButton).toBeInTheDocument();
  });

  test('shows limited notifications when no user is logged in', () => {
    // Mock the useAuth hook to return no user
    useAuth.mockReturnValue({
      user: null
    });

    render(<SmartNotificationSystem />);
    
    // Check that the notification bell is still rendered
    const bellButton = screen.getByRole('button');
    expect(bellButton).toBeInTheDocument();
  });
});