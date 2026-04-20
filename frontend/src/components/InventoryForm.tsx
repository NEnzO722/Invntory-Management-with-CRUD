import React, { useState, useEffect, useRef } from 'react';
import { Item, CATEGORY_DATA } from '../types';

interface InventoryFormProps {
  item?: Item;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ item, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    description: '',
    category: 'Electronics',
    subcategory: 'Laptops',
    quantity: 0,
    price: 0,
    sku: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(item?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setFormData(item);
      if (item.imageUrl) {
        // Handle absolute vs relative paths for preview
        const fullImageUrl = item.imageUrl.startsWith('http') 
          ? item.imageUrl 
          : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${item.imageUrl}`;
        setPreviewUrl(fullImageUrl);
      }
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'imageUrl' && key !== '_id') {
        submitData.append(key, value.toString());
      }
    });

    if (selectedFile) {
      submitData.append('image', selectedFile);
    } else if (item?.imageUrl) {
      // Keep existing image if no new one is selected
      submitData.append('imageUrl', item.imageUrl);
    }

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value,
      };

      // Reset subcategory if category changes
      if (name === 'category') {
        const cat = value as keyof typeof CATEGORY_DATA;
        newData.subcategory = CATEGORY_DATA[cat][0];
      }

      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = Object.keys(CATEGORY_DATA) as (keyof typeof CATEGORY_DATA)[];
  const subcategories = CATEGORY_DATA[formData.category as keyof typeof CATEGORY_DATA] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-moonlight-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-10 border-b border-white/5">
          <div>
            <h2 className="text-3xl font-black text-primary-theme tracking-tight transition-colors">
              {item ? 'Edit Item' : 'Add Item'}
            </h2>
            <p className="text-secondary-theme text-xs font-bold uppercase tracking-widest mt-1">Update details</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl text-secondary-theme hover:text-primary-theme hover:bg-mocha-100/10 dark:hover:bg-white/5 flex items-center justify-center transition-all border border-transparent hover:border-mocha-200/20 dark:hover:border-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 max-h-[75vh] overflow-y-auto modal-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="label-mocha">Product Image</label>
              <div 
                className="group relative h-48 rounded-[2rem] border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-mocha/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold bg-mocha px-6 py-2 rounded-full shadow-lg">Change Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-secondary-theme transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-mocha-50/50 dark:bg-white/5 flex items-center justify-center group-hover:bg-mocha/20 group-hover:text-mocha transition-all">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a1 1 0 011.414 0L16 16m-2-2l1.586-1.586a1 1 0 011.414 0L21 21M7 10h.01M9 21h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-bold tracking-wide">Upload Product Image</span>
                    <span className="text-xs opacity-60">PNG, JPG or WEBP (Max 5MB)</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="label-mocha">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Office Chair"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-mocha">Description</label>
              <textarea
                name="description"
                rows={3}
                className="input-field py-5 resize-none h-32"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this product for?"
              />
            </div>

            <div>
              <label className="label-mocha">Category</label>
              <div className="relative">
                <select
                  name="category"
                  className="input-field appearance-none cursor-pointer pr-12"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-moonlight-900">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-secondary-theme">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="label-mocha">Subcategory</label>
              <div className="relative">
                <select
                  name="subcategory"
                  className="input-field appearance-none cursor-pointer pr-12"
                  value={formData.subcategory}
                  onChange={handleChange}
                >
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub} className="bg-moonlight-900">
                      {sub}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-secondary-theme">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="label-mocha">Price ($) *</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                className="input-field"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label-mocha">Stock Level *</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                className="input-field"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-mocha">SKU (Internal ID)</label>
              <input
                type="text"
                name="sku"
                className="input-field font-mono"
                value={formData.sku}
                onChange={handleChange}
                placeholder="REF-000-00"
              />
            </div>
          </div>

          <div className="flex gap-6 mt-12 py-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-[1.5rem] font-bold text-secondary-theme hover:text-primary-theme hover:bg-mocha-100/10 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-[1.5] justify-center text-lg h-16"
            >
              {item ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
