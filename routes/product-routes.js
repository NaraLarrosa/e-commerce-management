const express = require('express');
const productControllers = require('../controllers/product-controllers');
const { check } = require('express-validator');

const router = express.Router();

router.get('/', productControllers.getProducts);

router.get('/category/:cid', productControllers.getProductByCategoryId);

router.get('/:pid', productControllers.getProductById);

router.post('/create',
    [
    check('name')
      .not()
      .isEmpty(),
    check('description')
      .not()
      .isEmpty(),
    check('color')
      .not()
      .isEmpty(),
    check('price')
      .not()
      .isEmpty(),
    check('barcode').isLength({ min: 6 })
    ],
    productControllers.createProduct
);

router.patch('/:pid',
    [
    check('name')
      .not()
      .isEmpty(),
    check('description')
      .not()
      .isEmpty(),
    check('color')
        .not()
        .isEmpty(),
    check('price')
      .not()
      .isEmpty()
    ],
    productControllers.updateProduct
);

router.delete('/:pid', productControllers.deleteProduct);

module.exports = router;