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
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/items', itemRoutes);

// Export for Vercel
export default app;

if (process.env.NODE_ENV !== 'production') {
  connectDB().then(async () => {
    await seedIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}