import { Router } from 'express';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/itemController';
import { upload } from '../config/multer';

const router = Router();

router.route('/')
  .get(getItems)
  .post(upload.single('image'), createItem);

router.route('/:id')
  .put(upload.single('image'), updateItem)
  .delete(deleteItem);

export default router;