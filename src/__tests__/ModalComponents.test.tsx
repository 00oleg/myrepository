/**
 * @jest-environment jsdom
 */

import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../components/Modal';

let mockOnClose: jest.Mock;

beforeEach(() => {
  mockOnClose = jest.fn();
});

describe('Modal opening/closing functionality', () => {
  it('should render modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should call onClose when modal overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    const modalOverlay = screen.getByRole('dialog');
    fireEvent.click(modalOverlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show/hide modal content based on isOpen prop changes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Accessibility features (focus management, ESC key)', () => {
  it('should close modal when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should trap focus within modal using Tab key', async () => {
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>
          <button>First Button</button>
          <input placeholder="Input field" />
          <button>Last Button</button>
        </div>
      </Modal>
    );

    const firstButton = screen.getByText('First Button');
    const lastButton = screen.getByText('Last Button');
    const input = screen.getByPlaceholderText('Input field');

    const modal = screen.getByRole('dialog');
    await waitFor(() => {
      expect(modal).toHaveFocus();
    });

    await user.tab();
    expect(firstButton).toHaveFocus();

    await user.tab();
    expect(input).toHaveFocus();

    await user.tab();
    expect(lastButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();
  });
});

it('Click outside to close behavior', async () => {
  const user = userEvent.setup();
  render(
    <Modal isOpen={true} onClose={mockOnClose}>
      <div>Modal Content</div>
    </Modal>
  );

  const modalOverlay = screen.getByRole('dialog');
  await user.click(modalOverlay);

  expect(mockOnClose).toHaveBeenCalledTimes(1);
});

it('should render modal content in document.body via portal', () => {
  render(
    <Modal isOpen={true} onClose={mockOnClose}>
      <div>Modal Content</div>
    </Modal>
  );

  const modalInBody = document.body.querySelector('[role="dialog"]');
  expect(modalInBody).toBeInTheDocument();
  expect(modalInBody).toHaveClass('modal-overlay');
});
