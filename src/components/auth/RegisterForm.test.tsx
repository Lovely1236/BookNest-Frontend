import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./OAuthButton', () => ({
  OAuthButton: () => <div>OAuth button mock</div>,
}));

const mockedUseAuth = jest.mocked(useAuth);

describe('RegisterForm', () => {
  it('shows password strength feedback while typing', () => {
    mockedUseAuth.mockReturnValue({
      register: jest.fn(),
      isRegisterLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'StrongPass1' },
    });

    expect(screen.getByText('Password strength: Strong')).toBeInTheDocument();
  });

  it('submits valid registration data through the auth hook', async () => {
    const registerMock = jest.fn();
    mockedUseAuth.mockReturnValue({
      register: registerMock,
      isRegisterLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('John Doe'), {
      target: { value: 'Reader One' },
    });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'reader@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'StrongPass1' },
    });
    fireEvent.change(screen.getByPlaceholderText('9876543210'), {
      target: { value: '9876543210' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        fullName: 'Reader One',
        email: 'reader@example.com',
        password: 'StrongPass1',
        mobile: '9876543210',
      });
    });
  });
});
