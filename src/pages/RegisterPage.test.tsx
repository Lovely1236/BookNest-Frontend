import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { useAuthStore } from '../stores/authStore';

jest.mock('../stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../components/auth/RegisterForm', () => ({
  RegisterForm: () => <div>Register form mock</div>,
}));

const mockedUseAuthStore = jest.mocked(useAuthStore);

describe('RegisterPage', () => {
  it('renders the registration experience for guests', () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
    } as any);

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Join BookNest')).toBeInTheDocument();
    expect(screen.getByText('Register form mock')).toBeInTheDocument();
    expect(screen.getByText(/create your account and start discovering amazing books today/i)).toBeInTheDocument();
  });

  it('redirects authenticated users to the home page', async () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<div>Home page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Home page')).toBeInTheDocument();
    });
  });
});
