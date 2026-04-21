import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import itemRoutes from './routes/itemRoutes';
import { seedIfEmpty } from './controllers/itemController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

import path from 'path';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/items', itemRoutes);

// Health check and root route
app.get('/', (req, res) => {
  res.json({ message: 'Inventory API is running', status: 'healthy' });
});

// Export for Vercel
export default app;

// Persistent connection for serverless
connectDB().then(async () => {
  await seedIfEmpty();
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}).catch(err => {
  console.error('Failed to start server:', err);
});