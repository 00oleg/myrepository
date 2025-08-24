import type { User } from 'types/user';
import { create } from 'zustand';

const initialState: { users: User[] } = {
  users: [],
};

interface UserActions {
  addUser: (userData: User) => void;
  clearLast: () => void;
}

interface UserState {
  users: User[];
}

interface UserStore extends UserState, UserActions {}

export const useFormDataStore = create<UserStore>((set) => ({
  ...initialState,

  addUser: (userData: User) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...userData,
        },
      ],
    })),

  clearLast: () =>
    set((state) => ({
      users: state.users.map((user: User) => ({ ...user, isLast: false })),
    })),
}));

export const userActions = {
  addUser: (userData: User) => useFormDataStore.getState().addUser(userData),
  clearLast: () => useFormDataStore.getState().clearLast(),
};
