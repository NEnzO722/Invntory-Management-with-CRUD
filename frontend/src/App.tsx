import { useState, useEffect, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import InventoryList from './components/InventoryList';
import InventoryForm from './components/InventoryForm';
import ErrorPage from './components/ErrorPage';
import { Item, InventoryStats } from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api/items';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);

  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const [error, setError] = useState<{ code: number | string; message: string } | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}?search=${search}&category=${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      setError({ 
        code: err.message.includes(' ') ? err.message.split(' ').pop() : 500, 
        message: "We couldn't load the inventory. Please check your connection."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category]);

  const stats = useMemo<InventoryStats>(() => {
    return {
      totalItems: items.reduce((acc, curr) => acc + curr.quantity, 0),
      lowStockItems: items.filter((item) => item.quantity <= 5).length,
      totalValue: items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
      categories: new Set(items.map((item) => item.category)).size,
    };
  }, [items]);

  const handleCreate = async (data: FormData) => {
    try {
      setError(null);
      const response = await fetch(API_URL, {
        method: 'POST',
        body: data,
      });
      
      if (!response.ok) {
        setError({ 
          code: response.status, 
          message: "Failed to create the item. This might be due to an invalid image or server issues."
        });
        return;
      }
      
      fetchItems();
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error creating item:', err);
      setError({ code: 500, message: "A network error occurred while creating the item." });
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!editingItem?._id) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/${editingItem._id}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        setError({ 
          code: response.status, 
          message: "Failed to update the item. Please try again."
        });
        return;
      }

      fetchItems();
      setIsFormOpen(false);
      setEditingItem(undefined);
    } catch (err) {
      console.error('Error updating item:', err);
      setError({ code: 500, message: "A network error occurred while updating the item." });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setError(null);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setError({ code: response.status, message: "Failed to delete the item." });
        return;
      }
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      setError({ code: 500, message: "A network error occurred while deleting the item." });
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 md:px-12 lg:px-20 max-w-[1600px] mx-auto animate-fade-in relative z-10">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-slide-up">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-ethereal flex items-center justify-center shadow-[0_10px_30px_rgba(167,199,231,0.4)] rotate-3">
              <svg className="w-8 h-8 text-moonlight-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-1">
                <span className="text-premium-gradient">STOCK</span>
                <span className="text-ethereal">FLOW</span>
                <span className="w-2 h-2 rounded-full bg-mocha ml-1 animate-pulse" />
              </h1>
              <p className="text-secondary-theme font-medium text-sm tracking-widest uppercase">Manage your stock</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-ethereal hover:bg-ethereal-500/10 hover:border-ethereal/30 transition-all duration-500 group relative overflow-hidden"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className={`transition-all duration-700 ${theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-12 opacity-0 rotate-90'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div className={`absolute transition-all duration-700 ${theme === 'light' ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-12 opacity-0 -rotate-90'}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 9H3m3.343-5.657l.707.707m12.728 12.728l.707.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => {
              setEditingItem(undefined);
              setIsFormOpen(true);
            }}
            className="btn-primary group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Item
          </button>
        </div>
      </header>

      {/* Modern Dashboard Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-premium p-8 rounded-[2rem] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ethereal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-ethereal/10 transition-all duration-700" />
          <span className="label-mocha">Total Items</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-primary-theme">{stats.totalItems}</span>
          </div>
        </div>

        <div className="glass-premium p-8 rounded-[2rem] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-mocha/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-mocha/10 transition-all duration-700" />
          <span className="label-mocha">Low Stock</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-mocha-500 dark:text-mocha transition-colors duration-500">{stats.lowStockItems}</span>
            <span className="text-xs text-secondary-theme font-bold uppercase tracking-wider">Need to restock</span>
          </div>
        </div>

        <div className="glass-premium p-8 rounded-[2rem] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ethereal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-ethereal/10 transition-all duration-700" />
          <span className="label-mocha">Total Value</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-primary-theme italic">
              ${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div className="glass-premium p-8 rounded-[2rem] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ethereal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-ethereal/10 transition-all duration-700" />
          <span className="label-mocha">Categories</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-primary-theme">{stats.categories}</span>
          </div>
        </div>
      </section>

      {/* Filter & Content Section */}
      <main className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 rounded-[2.5rem] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <InventoryList
            items={items}
            onEdit={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
            viewMode={viewMode}
          />
        )}
      </main>

      {/* Modal Overlay */}
      {isFormOpen && (
        <InventoryForm
          item={editingItem}
          onClose={() => setIsFormOpen(false)}
          onSubmit={editingItem ? handleUpdate : handleCreate}
        />
      )}

      {/* Full Page Error */}
      {error && (
        <ErrorPage 
          code={error.code} 
          message={error.message} 
          onRetry={() => {
            setError(null);
            fetchItems();
          }}
        />
      )}

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-ethereal/10 blur-[150px] animate-float" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-mocha/10 blur-[150px] animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>
    </div>
  );
}

export default App;
