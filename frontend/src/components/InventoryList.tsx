import React from 'react';
import { Item } from '../types';

interface InventoryListProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  viewMode: 'grid' | 'list';
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onEdit, onDelete, viewMode }) => {
  const resolveImageUrl = (url: string | undefined): string => {
    if (!url) return 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2574&auto=format&fit=crop';
    if (url.startsWith('http')) return url;
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}${url}`;
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 glass rounded-[3rem] border-white/5 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-mocha/5 flex items-center justify-center mb-6 border border-mocha/10">
          <svg className="w-10 h-10 text-mocha-300 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-primary-theme tracking-tight transition-colors">No products found</h3>
        <p className="text-secondary-theme mt-2 font-medium">Your inventory is currently clear.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="overflow-x-auto rounded-[2rem] glass border-white/5 animate-fade-in shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="table-header-mocha">Product</th>
              <th className="table-header-mocha">Category</th>
              <th className="table-header-mocha text-right">Price</th>
              <th className="table-header-mocha text-center">Stock</th>
              <th className="table-header-mocha text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item, index) => (
              <tr key={item._id} className="hover:bg-white/[0.03] transition-colors group" style={{ animationDelay: `${index * 50}ms` }}>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-black text-primary-theme group-hover:text-ethereal transition-colors">{item.name}</div>
                      <div className="text-xs text-secondary-theme font-mono tracking-widest uppercase mt-0.5">{item.sku || 'SERIAL-PENDING'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <span className="badge bg-ethereal/5 text-ethereal border-ethereal/20 self-start">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-mocha-300 font-bold uppercase tracking-wider pl-1">
                      {item.subcategory}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-black text-primary-theme text-lg italic transition-colors">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-8 py-6 text-center">
                  <div className={`px-4 py-1.5 rounded-xl inline-flex items-center gap-2 font-bold text-sm bg-white/5 border ${
                    item.quantity <= 5 ? 'text-mocha border-mocha/20' : 'text-emerald-400 border-emerald-400/20'
                  }`}>
                    {item.quantity} Units
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-3 rounded-xl hover:bg-ethereal hover:text-moonlight-900 text-mocha-400 dark:text-gray-400 transition-all shadow-lg"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => item._id && onDelete(item._id)}
                      className="p-3 rounded-xl hover:bg-mocha hover:text-white text-mocha-400 dark:text-gray-400 transition-all shadow-lg"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
      {items.map((item, index) => (
        <div
          key={item._id}
          className="card-premium group"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="relative h-72 overflow-hidden">
            <img
              src={resolveImageUrl(item.imageUrl)}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-moonlight-900/95 via-moonlight-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
            
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              <span className="badge bg-moonlight-900/80 backdrop-blur-md text-ethereal border-ethereal/20 shadow-2xl self-start">
                {item.category}
              </span>
              <span className="badge bg-mocha/20 backdrop-blur-md text-mocha border-mocha/20 text-[10px] self-start py-0.5">
                {item.subcategory}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-mocha font-black mb-1 opacity-80">Price</span>
                  <div className="text-2xl font-black text-white italic tracking-tighter">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg font-black text-xs lowercase ${
                  item.quantity <= 5 ? 'bg-mocha text-white shadow-[0_0_20px_rgba(166,110,81,0.3)]' : 'bg-ethereal text-moonlight-900'
                }`}>
                  {item.quantity} in stock
                </div>
              </div>
            </div>
            
            {/* Action Quick Bar */}
            <div className="absolute top-5 right-5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
              <button
                onClick={() => onEdit(item)}
                className="w-11 h-11 rounded-2xl bg-ethereal/20 backdrop-blur-xl border border-ethereal/30 flex items-center justify-center text-ethereal hover:bg-ethereal hover:text-moonlight-900 transition-all shadow-2xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={() => item._id && onDelete(item._id)}
                className="w-11 h-11 rounded-2xl bg-mocha/20 backdrop-blur-xl border border-mocha/30 flex items-center justify-center text-mocha hover:bg-mocha hover:text-white transition-all shadow-2xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-xl font-black text-primary-theme mb-3 group-hover:text-ethereal transition-colors leading-tight">
              {item.name}
            </h3>
            <p className="text-secondary-theme text-sm mb-6 line-clamp-2 leading-relaxed h-10 font-medium transition-colors">
              {item.description || "No description provided."}
            </p>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="label-mocha !mb-0">ID</span>
                <span className="text-secondary-theme font-mono text-[11px] tracking-widest transition-colors">{item.sku || "UNASSIGNED"}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-ethereal/20 group-hover:bg-ethereal group-hover:shadow-[0_0_12px_#A7C7E7] transition-all duration-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryList;
