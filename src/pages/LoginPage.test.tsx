import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import { useAuthStore } from '../stores/authStore';

jest.mock('../stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../components/auth/LoginForm', () => ({
  LoginForm: () => <div>Login form mock</div>,
}));

const mockedUseAuthStore = jest.mocked(useAuthStore);

describe('LoginPage', () => {
  it('renders the login experience for guests', () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    } as any);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('BookNest')).toBeInTheDocument();
    expect(screen.getByText('Login form mock')).toBeInTheDocument();
    expect(screen.getByText(/your cozy corner for every book lover/i)).toBeInTheDocument();
  });

  it('redirects authenticated admins to the admin dashboard', async () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<div>Admin dashboard</div>} />
          <Route path="/" element={<div>Home page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
    });
  });
});
