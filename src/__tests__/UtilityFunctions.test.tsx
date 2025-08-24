/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import {
  renderHook,
  act,
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { validationSchema } from '../utils/validationSchema';
import { useYupValidationResolver } from '../utils/yupResolver';
import countriesAll from '../utils/countriesAll';
import type { UserFormValues } from '../types/user';
import PasswordStrength from '../components/PasswordStrength';
import ControlledForm from '../components/ControlledForm';
import userEvent from '@testing-library/user-event';

type ValidationResult<T> = {
  values: T;
  errors: Record<string, { type: string; message: string }>;
};

global.FileList = class FileList {
  length: number;
  [index: number]: File;

  constructor(files: File[]) {
    this.length = files.length;
    files.forEach((file, index) => {
      this[index] = file;
    });
  }

  item(index: number): File | null {
    return this[index] || null;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this[i];
    }
  }
} as typeof FileList;

class MockFileReader extends FileReader {
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  constructor() {
    super();
  }

  readAsDataURL(file: File) {
    setTimeout(() => {
      Object.defineProperty(this, 'result', {
        value: `data:${file.type};base64,mockBase64String`,
        writable: false,
      });
      if (typeof this.onloadend === 'function') {
        const event = { type: 'loadend' } as ProgressEvent<FileReader>;
        this.onloadend(event);
      }
    }, 0);
  }
}

global.FileReader = MockFileReader;

describe('Test password strength validation', () => {
  it('should return "none" for empty password', () => {
    const { container } = render(<PasswordStrength password="" />);
    const strengthElement = container.querySelector('.password-strength--none');
    expect(strengthElement).toBeInTheDocument();
  });

  it('should return "weak" for password with only one character type', () => {
    const weakPasswords = ['password', 'PASSWORD', '12345', '!@#$%'];

    weakPasswords.forEach((password) => {
      const { container } = render(<PasswordStrength password={password} />);
      const strengthElement = container.querySelector(
        '.password-strength--weak'
      );
      expect(strengthElement).toBeInTheDocument();
    });
  });

  it('should return "medium" for password with two character types', () => {
    const mediumPasswords = [
      'Password',
      'pass123',
      'PASS123',
      'pass!',
      'PASS!',
      '123!',
    ];

    mediumPasswords.forEach((password) => {
      const { container } = render(<PasswordStrength password={password} />);
      const strengthElement = container.querySelector(
        '.password-strength--medium'
      );
      expect(strengthElement).toBeInTheDocument();
    });
  });

  it('should return "strong" for password with all character types', () => {
    const strongPasswords = ['Password123!', 'MyP@ssw0rd', 'Test1@'];

    strongPasswords.forEach((password) => {
      const { container } = render(<PasswordStrength password={password} />);
      const strengthElement = container.querySelector(
        '.password-strength--strong'
      );
      expect(strengthElement).toBeInTheDocument();
    });
  });
});

describe('Test image to base64 conversion in real form components', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('should convert JPEG file to base64 in ControlledForm component', async () => {
    const { useFormDataStore } = require('../store/usersStore');
    const { getByRole, container } = render(
      <ControlledForm onClose={mockOnClose} />
    );
    const pictureInput = container.querySelector(
      '#input-picture'
    ) as HTMLInputElement;
    const file = new File(['fake image content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const nameInput = container.querySelector(
      '#input-name'
    ) as HTMLInputElement;
    const ageInput = container.querySelector('#input-age') as HTMLInputElement;
    const emailInput = container.querySelector(
      '#input-email'
    ) as HTMLInputElement;
    const passwordInput = container.querySelector(
      '#input-password'
    ) as HTMLInputElement;
    const passwordConfirmInput = container.querySelector(
      '#input-password-confirm'
    ) as HTMLInputElement;
    const genderSelect = container.querySelector(
      '#input-gender'
    ) as HTMLSelectElement;
    const termsCheckbox = container.querySelector(
      '#input-terms'
    ) as HTMLInputElement;
    const countryInput = container.querySelector(
      '#input-country'
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(ageInput, { target: { value: '30' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(passwordConfirmInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.change(genderSelect, { target: { value: 'male' } });
    fireEvent.click(termsCheckbox);
    fireEvent.change(countryInput, {
      target: { value: 'United States of America' },
    });

    await userEvent.upload(pictureInput, file);

    const submitButton = getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const users = useFormDataStore.getState().users;
      const lastUser = users[users.length - 1];
      expect(lastUser.picture).toBeDefined();
      expect(typeof lastUser.picture).toBe('string');
      expect(lastUser.picture).toMatch(/^data:image\/jpeg;base64,/);
      expect(lastUser.picture).toBe('data:image/jpeg;base64,mockBase64String');
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});

describe('Test form validation helpers', () => {
  const mockFormData: UserFormValues = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
    password: 'Password123!',
    passwordConfirm: 'Password123!',
    gender: 'male',
    terms: true,
    picture: (() => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const FileListConstructor = global.FileList as new (
        files: File[]
      ) => FileList;
      const fileList = new FileListConstructor([file]);
      return fileList;
    })(),
    country: 'United States of America',
  };

  it('should validate name field correctly', async () => {
    const { result } = renderHook(() =>
      useYupValidationResolver(validationSchema)
    );

    const invalidNames = [
      '',
      'john',
      'john123',
      'john!',
      'john саша',
      'j'.repeat(11),
    ];

    for (const invalidName of invalidNames) {
      const testData = { ...mockFormData, name: invalidName };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.name
      ).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.name
          .message
      ).toBeTruthy();
    }

    const validNames = ['John', 'John Doe', 'Mary Jane Smith', 'A'];

    for (const validName of validNames) {
      const testData = { ...mockFormData, name: validName };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.name
      ).toBeUndefined();
    }
  });

  it('should validate age field correctly', async () => {
    const { result } = renderHook(() =>
      useYupValidationResolver(validationSchema)
    );
    const invalidAges = [-1, 0, 151, 999];

    for (const invalidAge of invalidAges) {
      const testData = { ...mockFormData, age: invalidAge };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.age
      ).toBeDefined();
    }

    const validAges = [1, 18, 30, 65, 150];

    for (const validAge of validAges) {
      const testData = { ...mockFormData, age: validAge };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.age
      ).toBeUndefined();
    }
  });

  it('should validate email field correctly', async () => {
    const { result } = renderHook(() =>
      useYupValidationResolver(validationSchema)
    );

    const invalidEmails = ['', 'invalid', '@invalid.com', 'test@'];

    for (const invalidEmail of invalidEmails) {
      const testData = { ...mockFormData, email: invalidEmail };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.email
      ).toBeDefined();
    }

    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'test+tag@example.org',
      'numbers123@test.com',
    ];

    for (const validEmail of validEmails) {
      const testData = { ...mockFormData, email: validEmail };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.email
      ).toBeUndefined();
    }
  });

  it('should validate password field correctly', async () => {
    const { result } = renderHook(() =>
      useYupValidationResolver(validationSchema)
    );

    const invalidPasswords = [
      '',
      'password',
      'PASSWORD',
      '12345678',
      'Password',
      'Password123',
      'пароль123!',
    ];

    for (const invalidPassword of invalidPasswords) {
      const testData = {
        ...mockFormData,
        password: invalidPassword,
        passwordConfirm: invalidPassword,
      };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.password
      ).toBeDefined();
    }

    const validPasswords = ['Password123!', 'MyP@ssw0rd', 'Test1@', 'Aa1!'];

    for (const validPassword of validPasswords) {
      const testData = {
        ...mockFormData,
        password: validPassword,
        passwordConfirm: validPassword,
      };
      let validationResult: unknown;

      await act(async () => {
        validationResult = await result.current(testData);
      });

      expect(validationResult).toBeDefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors.password
      ).toBeUndefined();
      expect(
        (validationResult as ValidationResult<UserFormValues>).errors
          .passwordConfirm
      ).toBeUndefined();
    }
  });

  it('should validate password confirmation matches', async () => {
    const { result } = renderHook(() =>
      useYupValidationResolver(validationSchema)
    );

    const testData = {
      ...mockFormData,
      password: 'Password123!',
      passwordConfirm: 'DifferentPassword123!',
    };

    let validationResult: unknown;
    await act(async () => {
      validationResult = await result.current(testData);
    });

    expect(validationResult).toBeDefined();
    expect(
      (validationResult as ValidationResult<UserFormValues>).errors
        .passwordConfirm
    ).toBeDefined();
    expect(
      (validationResult as ValidationResult<UserFormValues>).errors
        .passwordConfirm.message
    ).toContain('must match');
  });

  it('should validate terms acceptance', async () => {
    const { result } = renderHook(() =>
      useYupValidationResolver(validationSchema)
    );

    const testData = { ...mockFormData, terms: false };

    let validationResult: unknown;
    await act(async () => {
      validationResult = await result.current(testData);
    });

    expect(validationResult).toBeDefined();
    expect(
      (validationResult as ValidationResult<UserFormValues>).errors.terms
    ).toBeDefined();
    expect(
      (validationResult as ValidationResult<UserFormValues>).errors.terms
        .message
    ).toContain('Terms and Conditions');
  });
});

describe('Test country autocomplete filtering', () => {
  const filterCountries = (
    searchTerm: string,
    countries: string[]
  ): string[] => {
    if (!searchTerm) return countries;

    return countries.filter((country) =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  it('should return all countries when search term is empty', () => {
    const result = filterCountries('', countriesAll);
    expect(result).toEqual(countriesAll);
    expect(result.length).toBe(countriesAll.length);
  });

  it('should filter countries by partial name match', () => {
    const result = filterCountries('United', countriesAll);

    expect(result).toContain('United States of America');
    expect(result).toContain('United States Minor Outlying Islands');
    expect(
      result.every((country) => country.toLowerCase().includes('united'))
    ).toBe(true);
  });
});
