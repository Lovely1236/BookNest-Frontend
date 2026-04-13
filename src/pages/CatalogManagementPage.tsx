import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../hooks/useBooks';
import { Book } from '../types/book';
import { formatCurrency } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { GENRES } from '../utils/constants';

const emptyBook: Omit<Book, 'bookId'> = {
  title: '',
  author: '',
  isbn: '',
  genre: '',
  price: 0,
  stock: 0,
  rating: 0,
  description: '',
  coverImageUrl: '',
  publishedDate: new Date().toISOString().split('T')[0],
};

export const CatalogManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState(emptyBook);

  const { data, isLoading } = useBooks({ search, limit: 50 });
  const { mutate: createBook, isPending: isCreating } = useCreateBook();
  const { mutate: updateBook, isPending: isUpdating } = useUpdateBook();
  const { mutate: deleteBook } = useDeleteBook();

  const openCreate = () => {
    setEditBook(null);
    setFormData(emptyBook);
    setModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditBook(book);
    setFormData({ ...book });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBook) {
      updateBook(
        { bookId: editBook.bookId, updates: formData },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createBook(formData, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catalog Management</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Book</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Genre</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.books.map((book) => (
                <tr key={book.bookId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-gray-500 text-xs">{book.author}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{book.genre}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(book.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      book.stock === 0 ? 'bg-red-100 text-red-700' : book.stock <= 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {book.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(book)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this book?')) deleteBook(book.bookId);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editBook ? 'Edit Book' : 'Add New Book'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {(
                [
                  { field: 'title', label: 'Title', type: 'text' },
                  { field: 'author', label: 'Author', type: 'text' },
                  { field: 'isbn', label: 'ISBN', type: 'text' },
                  { field: 'price', label: 'Price (₹)', type: 'number' },
                  { field: 'stock', label: 'Stock', type: 'number' },
                  { field: 'publishedDate', label: 'Published Date', type: 'date' },
                  { field: 'coverImageUrl', label: 'Cover Image URL', type: 'url' },
                ] as const
              ).map(({ field, label, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={formData[field as keyof typeof formData] as string}
                    onChange={(e) => handleChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={['title', 'author', 'price'].includes(field)}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleChange('genre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select genre</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {isCreating || isUpdating ? 'Saving...' : editBook ? 'Update' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogManagementPage;
