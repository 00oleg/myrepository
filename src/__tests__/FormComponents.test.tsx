/**
 * @jest-environment jsdom
 */

import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UncontrolledForm from '../components/UncontrolledForm';
import ControlledForm from '../components/ControlledForm';

const validFormData = {
  name: 'John Doe',
  age: 25,
  email: 'john.doe@example.com',
  password: 'Test123!@#',
  passwordConfirm: 'Test123!@#',
  gender: 'male',
  terms: true,
  country: 'United States of America',
};

const mockValidFile = new File(['small content'], 'test-image.png', {
  type: 'image/png',
});

const mockAddUser = jest.fn();
const mockOnClose = jest.fn();
const mockCountriesList = [
  'United States of America',
  'United Kingdom',
  'Canada',
  'Australia',
];

jest.mock('../store/usersStore', () => ({
  useFormDataStore: (
    selector?: (state: { addUser: typeof mockAddUser }) => unknown
  ) => {
    const state = { addUser: mockAddUser };
    return selector ? selector(state) : state;
  },
}));

jest.mock('../store/countriesStore', () => ({
  useCountriesStore: (selector?: (state: { list: string[] }) => unknown) => {
    const state = { list: mockCountriesList };
    return selector ? selector(state) : state;
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('UncontrolledForm Component', () => {
  it('renders all required form fields', () => {
    const { container } = render(<UncontrolledForm onClose={mockOnClose} />);

    expect(screen.getByLabelText(/name/i)).toBeTruthy();
    expect(screen.getByLabelText(/age/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(container.querySelector('#input-password')).toBeTruthy();
    expect(screen.getByLabelText(/password confirm/i)).toBeTruthy();
    expect(screen.getByLabelText(/gender/i)).toBeTruthy();
    expect(screen.getByLabelText(/terms/i)).toBeTruthy();
    expect(screen.getByLabelText(/picture/i)).toBeTruthy();
    expect(screen.getByLabelText(/country/i)).toBeTruthy();
  });

  it('Test field validation', async () => {
    const { container } = render(<UncontrolledForm onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/name/i);
    const ageInput = screen.getByLabelText(/age/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = container.querySelector(
      '#input-password'
    ) as HTMLInputElement;
    const passwordConfirmInput = screen.getByLabelText(/password confirm/i);

    fireEvent.change(nameInput, { target: { value: 'john' } });
    fireEvent.change(ageInput, { target: { value: '-5' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.change(passwordConfirmInput, {
      target: { value: 'DifferentPass123!' },
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeTruthy();
      expect(screen.getByText(/age must be positive/i)).toBeTruthy();
      expect(
        screen.getByText(/name must start with an english uppercase letter/i)
      ).toBeTruthy();
      expect(
        screen.getByText(/password must contain at least 1 special character/i)
      ).toBeTruthy();
      expect(screen.getByText(/passwords must match/i)).toBeTruthy();
    });
  });

  it('Test password strength component', async () => {
    const { container } = render(<UncontrolledForm onClose={mockOnClose} />);

    const passwordInput = container.querySelector(
      '#input-password'
    ) as HTMLInputElement;
    const strengthContainer = screen
      .getByText('Weak')
      .closest('.password-strength');

    expect(strengthContainer?.className).toContain('password-strength--none');
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const updatedContainer = screen
        .getByText('Weak')
        .closest('.password-strength');
      expect(updatedContainer?.className).toContain('password-strength--weak');
    });

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      const updatedContainer = screen
        .getByText('Weak')
        .closest('.password-strength');
      expect(updatedContainer?.className).toContain(
        'password-strength--medium'
      );
    });

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      const updatedContainer = screen
        .getByText('Weak')
        .closest('.password-strength');
      expect(updatedContainer?.className).toContain(
        'password-strength--strong'
      );
    });
  });

  describe('Test form submission with valid/invalid data', () => {
    it('submits form with valid data', async () => {
      const { container } = render(<UncontrolledForm onClose={mockOnClose} />);
      const passwordInput = container.querySelector(
        '#input-password'
      ) as HTMLInputElement;
      const passwordConfirmInput = container.querySelector(
        '#input-password-confirm'
      ) as HTMLInputElement;

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: validFormData.name },
      });
      fireEvent.change(screen.getByLabelText(/age/i), {
        target: { value: validFormData.age.toString() },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: validFormData.email },
      });
      fireEvent.change(passwordInput, {
        target: { value: validFormData.password },
      });
      fireEvent.change(passwordConfirmInput, {
        target: { value: validFormData.passwordConfirm },
      });
      fireEvent.change(screen.getByLabelText(/gender/i), {
        target: { value: validFormData.gender },
      });
      fireEvent.click(screen.getByLabelText(/terms/i));
      fireEvent.change(screen.getByLabelText(/country/i), {
        target: { value: validFormData.country },
      });
      fireEvent.change(screen.getByLabelText(/picture/i), {
        target: { files: [mockValidFile] },
      });

      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockAddUser).toHaveBeenCalledWith(
          expect.objectContaining({
            name: validFormData.name,
            age: validFormData.age,
            email: validFormData.email,
            password: validFormData.password,
            gender: validFormData.gender,
            terms: validFormData.terms,
            country: validFormData.country,
            picture: expect.any(String),
            isLast: true,
          })
        );
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('prevents submission with empty required fields', async () => {
      render(<UncontrolledForm onClose={mockOnClose} />);

      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockAddUser).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
      });
    });
  });

  describe('Test error message display and clearing', () => {
    it('displays multiple validation errors simultaneously', async () => {
      render(<UncontrolledForm onClose={mockOnClose} />);

      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeTruthy();
        expect(screen.getByText(/age must be positive/i)).toBeTruthy();
        expect(screen.getByText(/email is required/i)).toBeTruthy();
        expect(screen.getByText(/password is required/i)).toBeTruthy();
        expect(screen.getByText(/gender is required/i)).toBeTruthy();
      });
    });
  });
});

describe('ControlledForm Component', () => {
  it('renders all required form fields', () => {
    const { container } = render(<ControlledForm onClose={mockOnClose} />);

    expect(screen.getByLabelText(/name/i)).toBeTruthy();
    expect(screen.getByLabelText(/age/i)).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(container.querySelector('input[name="password"]')).toBeTruthy();
    expect(screen.getByLabelText(/password confirm/i)).toBeTruthy();
    expect(screen.getByLabelText(/gender/i)).toBeTruthy();
    expect(screen.getByLabelText(/terms/i)).toBeTruthy();
    expect(screen.getByLabelText(/picture/i)).toBeTruthy();
    expect(screen.getByLabelText(/country/i)).toBeTruthy();
  });

  it('Test field validation', async () => {
    const { container } = render(<ControlledForm onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/name/i);
    const ageInput = screen.getByLabelText(/age/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = container.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    const passwordConfirmInput = screen.getByLabelText(/password confirm/i);

    fireEvent.change(nameInput, { target: { value: 'john' } });
    fireEvent.change(ageInput, { target: { value: '-5' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.change(passwordConfirmInput, {
      target: { value: 'DifferentPass123!' },
    });

    fireEvent.blur(nameInput);
    fireEvent.blur(ageInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText(/name must start with an english uppercase letter/i)
      ).toBeTruthy();
      expect(screen.getByText(/age must be positive/i)).toBeTruthy();
      expect(screen.getByText(/invalid email format/i)).toBeTruthy();
      expect(
        screen.getByText(/password must contain at least 1 special character/i)
      ).toBeTruthy();
      expect(screen.getByText(/passwords must match/i)).toBeTruthy();
    });
  });

  it('Test password strength as user types', async () => {
    const { container } = render(<ControlledForm onClose={mockOnClose} />);

    const passwordInput = container.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    const strengthContainer = screen
      .getByText('Weak')
      .closest('.password-strength');

    expect(strengthContainer?.className).toContain('password-strength--none');

    fireEvent.change(passwordInput, { target: { value: 'password' } });
    await waitFor(() => {
      const updatedContainer = screen
        .getByText('Weak')
        .closest('.password-strength');
      expect(updatedContainer?.className).toContain('password-strength--weak');
    });

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    await waitFor(() => {
      const updatedContainer = screen
        .getByText('Weak')
        .closest('.password-strength');
      expect(updatedContainer?.className).toContain(
        'password-strength--medium'
      );
    });

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    await waitFor(() => {
      const updatedContainer = screen
        .getByText('Weak')
        .closest('.password-strength');
      expect(updatedContainer?.className).toContain(
        'password-strength--strong'
      );
    });
  });

  describe('Test form submission with valid/invalid data', () => {
    it('submits form with valid data', async () => {
      const { container } = render(<ControlledForm onClose={mockOnClose} />);

      const passwordInput = container.querySelector(
        '#input-password'
      ) as HTMLInputElement;
      const passwordConfirmInput = container.querySelector(
        '#input-password-confirm'
      ) as HTMLInputElement;
      const pictureInput = container.querySelector(
        '#input-picture'
      ) as HTMLInputElement;

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: validFormData.name },
      });
      fireEvent.change(screen.getByLabelText(/age/i), {
        target: { value: validFormData.age.toString() },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: validFormData.email },
      });
      fireEvent.change(passwordInput, {
        target: { value: validFormData.password },
      });
      fireEvent.change(passwordConfirmInput, {
        target: { value: validFormData.passwordConfirm },
      });
      fireEvent.change(screen.getByLabelText(/gender/i), {
        target: { value: validFormData.gender },
      });
      fireEvent.click(screen.getByLabelText(/terms/i));
      fireEvent.change(screen.getByLabelText(/country/i), {
        target: { value: validFormData.country },
      });
      await userEvent.upload(pictureInput, mockValidFile);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddUser).toHaveBeenCalledWith(
          expect.objectContaining({
            name: validFormData.name,
            age: validFormData.age,
            email: validFormData.email,
            password: validFormData.password,
            gender: validFormData.gender,
            terms: validFormData.terms,
            country: validFormData.country,
            picture: expect.any(String),
            isLast: true,
          })
        );
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('prevents submission with invalid form state', async () => {
      render(<ControlledForm onClose={mockOnClose} />);

      const submitButton = screen.getByRole('button', { name: /submit/i });

      expect(submitButton.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Test error message display and clearing', () => {
    it('displays validation errors for all fields when invalid', async () => {
      const { container } = render(<ControlledForm onClose={mockOnClose} />);

      const fields = [
        screen.getByLabelText(/name/i),
        screen.getByLabelText(/age/i),
        screen.getByLabelText(/email/i),
        container.querySelector('input[name="password"]') as HTMLInputElement,
        container.querySelector(
          'input[name="passwordConfirm"]'
        ) as HTMLInputElement,
        screen.getByLabelText(/gender/i),
        screen.getByLabelText(/terms/i),
        screen.getByLabelText(/picture/i),
        screen.getByLabelText(/country/i),
      ];

      fields.forEach((field) => {
        fireEvent.focus(field);
        fireEvent.blur(field);
      });

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeTruthy();
        expect(screen.getByText(/age is required/i)).toBeTruthy();
        expect(screen.getByText(/email is required/i)).toBeTruthy();
        expect(screen.getByText(/password is required/i)).toBeTruthy();
        expect(screen.getByText(/password confirm is required/i)).toBeTruthy();
        expect(screen.getByText(/gender is required/i)).toBeTruthy();
      });
    });

    it('clears validation errors when valid data is entered', async () => {
      render(<ControlledForm onClose={mockOnClose} />);

      const nameInput = screen.getByLabelText(/name/i);

      fireEvent.change(nameInput, { target: { value: 'john' } });
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(
          screen.getByText(/name must start with an english uppercase letter/i)
        ).toBeTruthy();
      });

      fireEvent.change(nameInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(
          screen.queryByText(
            /name must start with an english uppercase letter/i
          )
        ).toBeNull();
      });
    });
  });
});
