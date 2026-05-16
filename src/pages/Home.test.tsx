import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { useFeaturedBooks } from '../hooks/useBooks';

jest.mock('../hooks/useBooks', () => ({
  useFeaturedBooks: jest.fn(),
}));

jest.mock('../components/book/BookGrid', () => ({
  BookGrid: ({ books = [], isLoading = false }: any) => (
    <div data-testid="book-grid">
      {isLoading ? 'Loading featured books' : books.map((book: any) => book.title).join(', ')}
    </div>
  ),
}));

const mockedUseFeaturedBooks = jest.mocked(useFeaturedBooks);

describe('Home page', () => {
  it('renders the hero, featured books, and genre navigation', () => {
    mockedUseFeaturedBooks.mockReturnValue({
      data: [
        {
          bookId: 1,
          title: 'The Testing Book',
          author: 'A. Reader',
          isbn: '1234567890',
          genre: 'Fiction',
          price: 499,
          stock: 3,
          rating: 4.6,
          description: 'A book about testing',
          coverImageUrl: '',
          publishedDate: '2024-01-01',
        },
      ],
      isLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /your cozy reading corner/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse books/i })).toHaveAttribute('href', '/books');
    expect(screen.getByRole('link', { name: /join free/i })).toHaveAttribute('href', '/register');
    expect(screen.getByText('10,000+ Books')).toBeInTheDocument();
    expect(screen.getByText('Verified Reviews')).toBeInTheDocument();
    expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
    expect(screen.getByTestId('book-grid')).toHaveTextContent('The Testing Book');
    expect(screen.getByRole('link', { name: 'Fiction' })).toHaveAttribute('href', '/books?genre=Fiction');
    expect(screen.getByRole('link', { name: 'View all' })).toHaveAttribute('href', '/books');
  });
});
