/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { act, renderHook } from '@testing-library/react';
import { useFormDataStore, userActions } from '../store/usersStore';
import { useCountriesStore } from '../store/countriesStore';
import type { User } from '../types/user';

const mockUser: User = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  password: 'password123',
  gender: 'male',
  terms: true,
  country: 'United States of America',
  picture: 'profile.jpg',
  isLast: true,
};

const mockUser2: User = {
  name: 'Jane Smith',
  age: 25,
  email: 'jane@example.com',
  password: 'password456',
  gender: 'female',
  terms: true,
  country: 'Canada',
  picture: 'jane.jpg',
  isLast: false,
};

beforeEach(() => {
  renderHook(() => useFormDataStore());
  act(() => {
    useFormDataStore.setState({ users: [] });
  });
});

describe('Test actions and action creators', () => {
  it('should have addUser action creator', () => {
    expect(typeof userActions.addUser).toBe('function');
  });

  it('should have clearLast action creator', () => {
    expect(typeof userActions.clearLast).toBe('function');
  });

  it('should call addUser action through action creator', () => {
    const { result } = renderHook(() => useFormDataStore());

    act(() => {
      userActions.addUser(mockUser);
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0]).toEqual(mockUser);
  });

  it('should call clearLast action through action creator', () => {
    const { result } = renderHook(() => useFormDataStore());

    const userWithIsLast = { ...mockUser, isLast: true };
    const user2WithIsLast = { ...mockUser2, isLast: true };

    act(() => {
      userActions.addUser(userWithIsLast);
      userActions.addUser(user2WithIsLast);
    });

    expect(result.current.users[0].isLast).toBe(true);
    expect(result.current.users[1].isLast).toBe(true);

    act(() => {
      userActions.clearLast();
    });

    expect(result.current.users[0].isLast).toBe(false);
    expect(result.current.users[1].isLast).toBe(false);
  });
});

describe('Test reducers with different action types', () => {
  it('should handle addUser action correctly', () => {
    const { result } = renderHook(() => useFormDataStore());

    expect(result.current.users).toHaveLength(0);

    act(() => {
      result.current.addUser(mockUser);
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0]).toEqual(mockUser);

    act(() => {
      result.current.addUser(mockUser2);
    });

    expect(result.current.users).toHaveLength(2);
    expect(result.current.users[1]).toEqual(mockUser2);
  });

  it('should handle clearLast action correctly', () => {
    const { result } = renderHook(() => useFormDataStore());

    const user1 = { ...mockUser, isLast: true };
    const user2 = { ...mockUser2, isLast: true };

    act(() => {
      result.current.addUser(user1);
      result.current.addUser(user2);
    });

    expect(result.current.users[0].isLast).toBe(true);
    expect(result.current.users[1].isLast).toBe(true);

    act(() => {
      result.current.clearLast();
    });

    expect(result.current.users[0].isLast).toBe(false);
    expect(result.current.users[1].isLast).toBe(false);
    expect(result.current.users[0].name).toBe(mockUser.name);
    expect(result.current.users[1].name).toBe(mockUser2.name);
  });
});

describe('Test selectors', () => {
  it('should select users from store', () => {
    const { result } = renderHook(() =>
      useFormDataStore((state) => state.users)
    );

    expect(result.current).toEqual([]);

    act(() => {
      useFormDataStore.getState().addUser(mockUser);
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual(mockUser);
  });

  it('should select addUser function from store', () => {
    const { result } = renderHook(() =>
      useFormDataStore((state) => state.addUser)
    );

    expect(typeof result.current).toBe('function');
  });

  it('should select clearLast function from store', () => {
    const { result } = renderHook(() =>
      useFormDataStore((state) => state.clearLast)
    );

    expect(typeof result.current).toBe('function');
  });

  it('should select specific user properties', () => {
    act(() => {
      useFormDataStore.getState().addUser(mockUser);
      useFormDataStore.getState().addUser(mockUser2);
    });

    const { result } = renderHook(() =>
      useFormDataStore((state) =>
        state.users.length > 0 ? state.users[0].name : ''
      )
    );

    expect(result.current).toBe('John Doe');
  });
});

it('Test store state updates after form submissions', () => {
  const { result } = renderHook(() => useFormDataStore());

  const formData: User = {
    name: 'Form User',
    age: 28,
    email: 'formuser@example.com',
    password: 'formpass123',
    gender: 'other',
    terms: true,
    country: 'Germany',
    picture: 'form-pic.jpg',
    isLast: true,
  };

  act(() => {
    result.current.addUser(formData);
  });

  expect(result.current.users).toHaveLength(1);
  expect(result.current.users[0]).toEqual(formData);
});

it('should have countries list available', () => {
  const { result } = renderHook(() => useCountriesStore());

  expect(Array.isArray(result.current.list)).toBe(true);
  expect(result.current.list.length).toBeGreaterThan(0);
});
