//Endpoints a generar:
// Listar categorias
// Listar por id
// Crear categoria
// Actualizar categoria
// Borrar categoria

const express = require('express');
const categoryControllers = require('../controllers/category-controllers');
const { check } = require('express-validator');

const router = express.Router();

router.get('/', categoryControllers.getCategories); //ok

router.get('/:cid', categoryControllers.getCategoryById); //ok

router.post('/create', //ok
    [
    check('title')
      .not()
      .isEmpty(),
    check('code').isLength({ max: 2 })
    ],
    categoryControllers.createCategory
);

router.patch('/:cid', //ok
    [
    check('title')
      .not()
      .isEmpty()
    ],
    categoryControllers.updateCategory
);

router.delete('/:cid', categoryControllers.deleteCategory);

module.exports = router;