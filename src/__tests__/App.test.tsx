/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page404 from '../pages/404';
import MainPage from '../pages/Main';
import { useFormDataStore } from '../store/usersStore';
import type { User } from '../types/user';

jest.mock('../store/usersStore', () => ({
  useFormDataStore: jest.fn(),
}));

jest.mock('../components/UncontrolledForm', () => {
  return function MockUncontrolledForm({ onClose }: { onClose: () => void }) {
    return (
      <div data-testid="uncontrolled-form">
        <h2>Uncontrolled Form</h2>
        <button onClick={onClose}>Close Uncontrolled Form</button>
      </div>
    );
  };
});

jest.mock('../components/ControlledForm', () => {
  return function MockControlledForm({ onClose }: { onClose: () => void }) {
    return (
      <div data-testid="controlled-form">
        <h2>Controlled Form</h2>
        <button onClick={onClose}>Close Controlled Form</button>
      </div>
    );
  };
});

const mockUseFormDataStore = useFormDataStore as jest.MockedFunction<
  typeof useFormDataStore
>;

beforeEach(() => {
  (window.fetch as jest.Mock) = jest.fn();
  localStorage.clear();
  jest.clearAllMocks();

  mockUseFormDataStore.mockReturnValue({
    users: [],
    addUser: jest.fn(),
    clearLast: jest.fn(),
  });
});

describe('MainPage Component', () => {
  it('renders main page information', () => {
    render(<MainPage />);
    expect(screen.getByText(/Form Modal/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Uncontrolled Form/i)).toBeInTheDocument();
    expect(screen.getByText(/Open Controlled Form/i)).toBeInTheDocument();
    expect(screen.getByText(/Users list is empty/i)).toBeInTheDocument();
  });

  it('opens and closes uncontrolled form modal', async () => {
    const user = userEvent.setup();
    render(<MainPage />);

    expect(screen.queryByTestId('uncontrolled-form')).not.toBeInTheDocument();

    const openButton = screen.getByRole('button', {
      name: /Open Uncontrolled Form/i,
    });
    await user.click(openButton);

    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', {
      name: /Close Uncontrolled Form/i,
    });
    await user.click(closeButton);

    expect(screen.queryByTestId('uncontrolled-form')).not.toBeInTheDocument();
  });

  it('opens and closes controlled form modal', async () => {
    const user = userEvent.setup();
    render(<MainPage />);

    expect(screen.queryByTestId('controlled-form')).not.toBeInTheDocument();

    const openButton = screen.getByRole('button', {
      name: /Open Controlled Form/i,
    });
    await user.click(openButton);

    expect(screen.getByTestId('controlled-form')).toBeInTheDocument();
    expect(screen.getByText('Controlled Form')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', {
      name: /Close Controlled Form/i,
    });
    await user.click(closeButton);

    expect(screen.queryByTestId('controlled-form')).not.toBeInTheDocument();
  });

  it('handles multiple users with mixed isLast flags correctly', () => {
    const mockClearLast = jest.fn();
    const mockUsers: User[] = [
      {
        name: 'User 1',
        age: 25,
        email: 'user1@example.com',
        password: 'pass1',
        gender: 'male',
        terms: true,
        country: 'Country1',
        picture: 'data:image/jpeg;base64,user1',
        isLast: false,
      },
      {
        name: 'User 2',
        age: 30,
        email: 'user2@example.com',
        password: 'pass2',
        gender: 'female',
        terms: true,
        country: 'Country2',
        picture: 'data:image/jpeg;base64,user2',
        isLast: true,
      },
      {
        name: 'User 3',
        age: 35,
        email: 'user3@example.com',
        password: 'pass3',
        gender: 'other',
        terms: false,
        country: 'Country3',
        picture: 'data:image/jpeg;base64,user3',
        isLast: false,
      },
    ];

    mockUseFormDataStore.mockReturnValue({
      users: mockUsers,
      addUser: jest.fn(),
      clearLast: mockClearLast,
    });

    jest.useFakeTimers();
    render(<MainPage />);

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('User 3')).toBeInTheDocument();

    const user1Card = screen.getByText('User 1').closest('.card');
    const user2Card = screen.getByText('User 2').closest('.card');
    const user3Card = screen.getByText('User 3').closest('.card');

    expect(user1Card).not.toHaveClass('last');
    expect(user2Card).toHaveClass('last');
    expect(user3Card).not.toHaveClass('last');

    expect(screen.getAllByText('Accepted')).toHaveLength(2);
    expect(screen.getAllByText('Not accepted')).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockClearLast).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});

it('renders 404 information', () => {
  render(<Page404 />);
  expect(screen.getByText(/Page not found 404/i)).toBeInTheDocument();
});
