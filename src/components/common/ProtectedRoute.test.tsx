import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../../stores/authStore';

jest.mock('../../stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

const mockedUseAuthStore = jest.mocked(useAuthStore);

describe('ProtectedRoute', () => {
  it('redirects guests to the login page', async () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
    } as any);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>Secret content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Login page')).toBeInTheDocument();
    });
  });

  it('renders protected content for the correct role', () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'CUSTOMER' } as any,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="CUSTOMER">
          <div>Secret content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Secret content')).toBeInTheDocument();
  });

  it('shows an access denied view when the role does not match', () => {
    mockedUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'CUSTOMER' } as any,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="ADMIN">
          <div>Secret content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
  });
});
