import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useFeaturedBooks } from '../hooks/useBooks';
import { BookGrid } from '../components/book/BookGrid';
import { GENRES } from '../utils/constants';

export const Home: React.FC = () => {
  const { data: featured, isLoading } = useFeaturedBooks();

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <BookOpen className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Cozy Reading Corner</h1>
          <p className="text-lg text-blue-100 mb-8">
            Discover thousands of books, from bestsellers to hidden gems. Read more, pay less.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/books"
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              Browse Books <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-400 transition-colors"
            >
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: BookOpen, title: '10,000+ Books', desc: 'Curated collection across all genres' },
            { icon: Star, title: 'Verified Reviews', desc: 'Honest ratings from real buyers' },
            { icon: ShoppingBag, title: 'Fast Delivery', desc: 'Delivered to your doorstep' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
          <Link to="/books" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <BookGrid books={featured} isLoading={isLoading} />
      </section>

      {/* Browse by Genre */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Genre</h2>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <Link
                key={genre}
                to={`/books?genre=${encodeURIComponent(genre)}`}
                className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
