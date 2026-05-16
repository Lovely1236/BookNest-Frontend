import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./OAuthButton', () => ({
  OAuthButton: () => <div>OAuth button mock</div>,
}));

const mockedUseAuth = jest.mocked(useAuth);

describe('LoginForm', () => {
  it('renders the login form fields and password toggle', () => {
    mockedUseAuth.mockReturnValue({
      login: jest.fn(),
      isLoginLoading: false,
    } as any);

    const { container } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    const toggleButton = container.querySelector('button[type="button"]') as HTMLButtonElement;

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByText('OAuth button mock')).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    mockedUseAuth.mockReturnValue({
      login: jest.fn(),
      isLoginLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('submits valid credentials through the auth hook', async () => {
    const loginMock = jest.fn();
    mockedUseAuth.mockReturnValue({
      login: loginMock,
      isLoginLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'reader@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'reader@example.com',
        password: 'secret123',
      });
    });
  });
});
