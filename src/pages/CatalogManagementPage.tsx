import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  BookOpen,
  Edit2,
  Package2,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Book } from '../types/book';
import { formatCurrency, formatDate } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { GENRES } from '../utils/constants';
import { adminService } from '../services/api/adminService';

type CatalogFormState = Omit<Book, 'bookId' | 'itemId'>;

const emptyBook: CatalogFormState = {
  title: '',
  author: '',
  isbn: '',
  genre: '',
  publisher: '',
  price: 0,
  stock: 0,
  rating: 0,
  description: '',
  coverImageUrl: '',
  publishedDate: new Date().toISOString().split('T')[0],
};

const stockOptions = [
  { value: 'all', label: 'All inventory' },
  { value: 'healthy', label: 'Healthy stock' },
  { value: 'low', label: 'Low stock' },
  { value: 'out', label: 'Out of stock' },
] as const;

const normalizeDate = (value?: string) => (value ? value.split('T')[0] : '');

export const CatalogManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [stockStatus, setStockStatus] = useState<(typeof stockOptions)[number]['value']>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<CatalogFormState>(emptyBook);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'catalog', search, genre, stockStatus],
    queryFn: () =>
      adminService.getCatalog({
        search: search || undefined,
        genre: genre || undefined,
        stockStatus,
        limit: 100,
      }),
  });

  const refreshCatalog = () => queryClient.invalidateQueries({ queryKey: ['admin', 'catalog'] });

  const { mutate: createBook, isPending: isCreating } = useMutation({
    mutationFn: (book: CatalogFormState) => adminService.createBook(book),
    onSuccess: () => {
      toast.success('Book added successfully');
      setModalOpen(false);
      setFormData(emptyBook);
      refreshCatalog();
    },
    onError: () => toast.error('Failed to add book'),
  });

  const { mutate: updateBook, isPending: isUpdating } = useMutation({
    mutationFn: ({ bookId, book }: { bookId: number; book: CatalogFormState }) =>
      adminService.updateBook(bookId, book),
    onSuccess: () => {
      toast.success('Book updated successfully');
      setModalOpen(false);
      setEditBook(null);
      refreshCatalog();
    },
    onError: () => toast.error('Failed to update book'),
  });

  const { mutate: deleteBook, isPending: isDeleting } = useMutation({
    mutationFn: (bookId: number) => adminService.deleteBook(bookId),
    onSuccess: () => {
      toast.success('Book deleted successfully');
      refreshCatalog();
    },
    onError: () => toast.error('Failed to delete book'),
  });

  const { mutate: updateStock } = useMutation({
    mutationFn: ({ bookId, stock }: { bookId: number; stock: number }) =>
      adminService.updateBookStock(bookId, stock),
    onSuccess: () => {
      toast.success('Inventory updated');
      refreshCatalog();
    },
    onError: () => toast.error('Failed to update stock'),
  });

  const books = data?.books ?? [];
  const lowStockCount = data?.lowStockCount ?? books.filter((book) => book.stock > 0 && book.stock <= 10).length;
  const outOfStockCount = data?.outOfStockCount ?? books.filter((book) => book.stock === 0).length;

  const statCards = [
    { title: 'Visible books', value: data?.total ?? books.length, icon: BookOpen, tone: 'bg-slate-900 text-white' },
    { title: 'Catalog total', value: data?.totalCount ?? books.length, icon: Package2, tone: 'bg-white text-slate-900' },
    { title: 'Low stock', value: lowStockCount, icon: AlertTriangle, tone: 'bg-amber-50 text-amber-900' },
    { title: 'Out of stock', value: outOfStockCount, icon: Trash2, tone: 'bg-rose-50 text-rose-900' },
  ];

  const openCreate = () => {
    setEditBook(null);
    setFormData(emptyBook);
    setModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      publisher: book.publisher ?? '',
      price: book.price,
      stock: book.stock,
      rating: book.rating,
      description: book.description,
      coverImageUrl: book.coverImageUrl,
      publishedDate: normalizeDate(book.publishedDate),
    });
    setModalOpen(true);
  };

  const handleChange = (field: keyof CatalogFormState, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBook) {
      updateBook({ bookId: editBook.bookId, book: formData });
      return;
    }
    createBook(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn space-y-6">
      <section className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/80">Admin Catalog</p>
            <h1 className="mt-3 text-3xl font-bold">Manage every book listing from one desk.</h1>
            <p className="mt-3 text-sm text-slate-300">
              Add new titles, correct metadata, track stock pressure, and keep the storefront aligned with the admin service.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Add New Book
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ title, value, icon: Icon, tone }) => (
          <article key={title} className={`rounded-3xl border border-slate-200/70 p-5 shadow-sm ${tone}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className="mt-3 text-3xl font-bold">{value}</p>
              </div>
              <span className="rounded-2xl bg-black/5 p-3">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, ISBN, publisher..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="">All genres</option>
            {GENRES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value as (typeof stockOptions)[number]['value'])}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          >
            {stockOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Catalog inventory</h2>
              <p className="text-sm text-slate-500">Showing {books.length} books from the admin service.</p>
            </div>
            {isDeleting && <span className="text-xs font-medium text-slate-500">Removing book...</span>}
          </div>

          {books.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No books match this filter</h3>
              <p className="mt-2 text-sm text-slate-500">Try a different search, or add a fresh title to the catalog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Book</th>
                    <th className="px-5 py-3 font-medium">Meta</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {books.map((book) => (
                    <tr key={book.bookId} className="align-top transition hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <div className="flex gap-4">
                          <div className="h-24 w-16 overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                            {book.coverImageUrl ? (
                              <img src={book.coverImageUrl} alt={book.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-500">
                                {book.title.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-900">{book.title}</p>
                            <p className="text-slate-500">by {book.author}</p>
                            <div className="flex flex-wrap gap-2 pt-1 text-xs">
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">{book.genre || 'Uncategorized'}</span>
                              {book.publisher && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{book.publisher}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <p><span className="font-medium text-slate-800">ISBN:</span> {book.isbn || '—'}</p>
                        <p className="mt-1"><span className="font-medium text-slate-800">Published:</span> {book.publishedDate ? formatDate(book.publishedDate) : '—'}</p>
                        <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                          {book.description || 'No description added yet.'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{formatCurrency(book.price)}</p>
                        <p className="mt-1 text-xs text-slate-500">Rating {book.rating.toFixed(1)} / 5</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            book.stock === 0
                              ? 'bg-rose-100 text-rose-700'
                              : book.stock <= 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {book.stock === 0 ? 'Out of stock' : `${book.stock} in stock`}
                        </span>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => updateStock({ bookId: book.bookId, stock: Math.max(0, book.stock + 5) })}
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            +5 stock
                          </button>
                          {book.stock > 0 && (
                            <button
                              onClick={() => updateStock({ bookId: book.bookId, stock: Math.max(0, book.stock - 1) })}
                              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              -1 stock
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(book)}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${book.title}" from the catalog?`)) {
                                deleteBook(book.bookId);
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-[30px] bg-white shadow-2xl">
            <div className="grid lg:grid-cols-[1.1fr_1.3fr]">
              <aside className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-blue-200/80">
                      {editBook ? 'Edit Book' : 'New Listing'}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold">
                      {editBook ? 'Update catalog details' : 'Add a new book to BookNest'}
                    </h2>
                    <p className="mt-3 text-sm text-slate-300">
                      Keep the storefront accurate with complete metadata, pricing, stock, and cover art.
                    </p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="mx-auto flex h-56 max-w-[14rem] items-center justify-center overflow-hidden rounded-[24px] bg-white/10">
                    {formData.coverImageUrl ? (
                      <img src={formData.coverImageUrl} alt={formData.title || 'Book cover preview'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="px-6 text-center text-sm text-slate-300">
                        Add a cover image URL to preview how this book will appear in the catalog.
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-lg font-semibold">{formData.title || 'Untitled book'}</p>
                    <p className="text-sm text-slate-300">{formData.author || 'Author name'}</p>
                    <p className="text-sm text-blue-200">{formData.genre || 'Genre'}</p>
                  </div>
                </div>
              </aside>

              <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { field: 'title', label: 'Title', type: 'text', required: true },
                    { field: 'author', label: 'Author', type: 'text', required: true },
                    { field: 'isbn', label: 'ISBN', type: 'text', required: false },
                    { field: 'publisher', label: 'Publisher', type: 'text', required: false },
                    { field: 'price', label: 'Price (INR)', type: 'number', required: true },
                    { field: 'stock', label: 'Stock', type: 'number', required: true },
                    { field: 'rating', label: 'Rating', type: 'number', required: false },
                    { field: 'publishedDate', label: 'Published Date', type: 'date', required: false },
                  ].map(({ field, label, type, required }) => (
                    <label key={field} className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                      <input
                        type={type}
                        value={String(formData[field as keyof CatalogFormState] ?? '')}
                        onChange={(e) =>
                          handleChange(
                            field as keyof CatalogFormState,
                            type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                        min={type === 'number' ? 0 : undefined}
                        step={field === 'rating' ? '0.1' : undefined}
                        max={field === 'rating' ? 5 : undefined}
                        required={required}
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Genre</span>
                    <select
                      value={formData.genre}
                      onChange={(e) => handleChange('genre', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                    >
                      <option value="">Select a genre</option>
                      {GENRES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Cover Image URL</span>
                    <input
                      type="url"
                      value={formData.coverImageUrl}
                      onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                    placeholder="Short summary, highlights, and any notes for the storefront."
                  />
                </label>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isCreating || isUpdating ? 'Saving...' : editBook ? 'Update Book' : 'Create Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogManagementPage;
