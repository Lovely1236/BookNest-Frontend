import { render } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the provided loading text', () => {
    const { getByText } = render(<LoadingSpinner text="Loading books" />);

    expect(getByText('Loading books')).toBeInTheDocument();
  });

  it('renders the full-page overlay when requested', () => {
    const { container } = render(<LoadingSpinner fullPage />);

    expect(container.firstChild).toHaveClass('fixed', 'inset-0');
  });
});
