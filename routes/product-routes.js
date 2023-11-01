// Endpoints: 
// Listar todos los productos
// Listar por categoria
// Listar por id
// Crear producto
// Actualizar producto
// Borrar producto

const express = require('express');
const productControllers = require('../controllers/product-controllers');
const { check } = require('express-validator');

const router = express.Router();

router.get('/', productControllers.getProducts); //ok

router.get('/category/:cid', productControllers.getProductByCategoryId);

router.get('/:pid', productControllers.getProductById); //ok

router.post('/create', //ok
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
    check('barcode').isLength({ min: 6 })
    ],
    productControllers.createProduct
);

router.patch('/:pid', //ok
    [
    check('name')
      .not()
      .isEmpty(),
    check('description')
      .not()
      .isEmpty(),
    check('color')
        .not()
        .isEmpty()
    ],
    productControllers.updateProduct
);

router.delete('/:pid', productControllers.deleteProduct);

module.exports = router;