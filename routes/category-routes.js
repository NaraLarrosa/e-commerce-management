const express = require('express');
const categoryControllers = require('../controllers/category-controllers');
const { check } = require('express-validator');

const router = express.Router();

router.get('/', categoryControllers.getCategories);

router.get('/:cid', categoryControllers.getCategoryById);

router.post('/create',
    [
    check('title')
      .not()
      .isEmpty(),
    check('code').isLength({ max: 2 })
    ],
    categoryControllers.createCategory
);

router.patch('/:cid',
    [
    check('title')
      .not()
      .isEmpty()
    ],
    categoryControllers.updateCategory
);

router.delete('/:cid', categoryControllers.deleteCategory);

module.exports = router;