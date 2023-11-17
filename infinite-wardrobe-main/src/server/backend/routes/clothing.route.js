import { Router } from 'express';

import * as ClothingController from '../controllers/clothing.controller.js';

const router = Router();

router.get('/', ClothingController.getWardrobe);
router.get('/:id', ClothingController.getItem);

router.post('/', ClothingController.createItem);

router.put('/:id', ClothingController.updateItem);

router.delete('/:id', ClothingController.deleteItem);

export default router;
