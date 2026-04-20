import { Request, Response } from 'express';
import Item from '../models/item';

// Seed data
const initialItems = [
  {
    name: 'Artisan Coffee Maker',
    description: 'Professional grade espresso machine with Mocha finish.',
    category: 'Electronics',
    subcategory: 'Kitchen',
    quantity: 5,
    price: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2670&auto=format&fit=crop',
    sku: 'ECM-001-MCH'
  },
  {
    name: 'Ethereal Cloud Sofa',
    description: 'Velvet soft sofa in Ethereal Blue with Moonlight Gray legs.',
    category: 'Furniture',
    subcategory: 'Sofas',
    quantity: 2,
    price: 2499.00,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2670&auto=format&fit=crop',
    sku: 'SOF-BL-01'
  },
  {
    name: 'Zen Garden Lamp',
    description: 'Minimalist lighting with a brushed Mocha base.',
    category: 'Home & Decor',
    subcategory: 'Lighting',
    quantity: 12,
    price: 145.00,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed657f9971?q=80&w=2673&auto=format&fit=crop',
    sku: 'LMP-MCH-05'
  },
  {
    name: 'Carbon Fiber Road Bike',
    description: 'Ultra-lightweight frame in Ethereal Blue matte finish.',
    category: 'Sports & Outdoors',
    subcategory: 'Cycling',
    quantity: 3,
    price: 3200.00,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2670&auto=format&fit=crop',
    sku: 'CBK-ETH-12'
  },
  {
    name: 'Vintage Camera Lens',
    description: 'Classic 50mm f/1.8 lens for enthusiast photographers.',
    category: 'Electronics',
    subcategory: 'Cameras',
    quantity: 8,
    price: 299.00,
    imageUrl: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=2671&auto=format&fit=crop',
    sku: 'LNS-OLD-01'
  },
  {
    name: 'Leather Bound Journal',
    description: 'Handmade journal with Moonlight Gray leather cover.',
    category: 'Office Supply',
    subcategory: 'Stationery',
    quantity: 50,
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1519682570081-4e62420d9120?q=80&w=2670&auto=format&fit=crop',
    sku: 'JNL-GRY-88'
  }
];

export const seedIfEmpty = async () => {
  try {
    const count = await Item.countDocuments();
    if (count === 0) {
      console.log('Seeding initial inventory items...');
      await Item.insertMany(initialItems);
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

// GET /api/items?search=&category=
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category } = req.query;
    const filter: any = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { sku: { $regex: search as string, $options: 'i' } }
      ];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// POST /api/items
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = { ...req.body };
    
    // If a file was uploaded, use its path as the imageUrl
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const item = new Item(data);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// PUT /api/items/:id
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = { ...req.body };
    
    // If a new file was uploaded, update the imageUrl
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// DELETE /api/items/:id
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
