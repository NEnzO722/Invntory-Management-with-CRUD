export interface Item {
  _id?: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  price: number;
  imageUrl: string;
  sku: string;
  createdAt?: string;
  updatedAt?: string;
}

export const CATEGORY_DATA = {
  Furniture: ['Chairs', 'Tables', 'Sofas', 'Beds', 'Office', 'Storage'],
  Electronics: ['Laptops', 'Smartphones', 'Audio', 'Kitchen', 'Cameras', 'Accessories'],
  Clothing: ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'],
  Food: ['Snacks', 'Beverages', 'Fresh', 'Pantry', 'Frozen'],
  'Home & Decor': ['Wall Art', 'Lighting', 'Rugs', 'Mirrors', 'Vases'],
  'Sports & Outdoors': ['Fitness', 'Camping', 'Cycling', 'Team Sports', 'Water Sports'],
  'Books & Media': ['Fiction', 'Non-Fiction', 'Educational', 'Stationery', 'Magazines'],
  'Beauty & Care': ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Wellness'],
  'Toys & Games': ['Board Games', 'Action Figures', 'Puzzles', 'Educational', 'Outdoor'],
  Automotive: ['Parts', 'Accessories', 'Cleaning', 'Tools', 'Tires'],
  'Garden & Patio': ['Plants', 'Tools', 'Furniture', 'Decor', 'Irrigation'],
  'Pet Supplies': ['Food', 'Toys', 'Bedding', 'Grooming', 'Health'],
  'Health & Wellness': ['Supplements', 'Equipment', 'Personal Care', 'First Aid'],
  Industrial: ['Safety', 'Tools', 'Supplies', 'Hardware', 'Components'],
  'Office Supply': ['Stationery', 'Organization', 'Paper', 'Writing', 'Tech'],
  Other: ['Miscellaneous'],
} as const;

export type Category = keyof typeof CATEGORY_DATA | 'all';

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  categories: number;
}
