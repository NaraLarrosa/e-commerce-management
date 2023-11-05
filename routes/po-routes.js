const express = require('express');
const poControllers = require('../controllers/po-controllers');
const { check } = require('express-validator');

const router = express.Router();

router.post('/create', poControllers.createPurchaseOrder);

router.put('/add', 
    [
    check('pid')
        .not()
        .isEmpty(),
    check('quantity')
        .not()
        .isEmpty(),
    check('poid')
        .not()
        .isEmpty()
    ],
    poControllers.addProduct
);

router.patch('/update',
    [
    check('pid')
        .not()
        .isEmpty(),
    check('quantity')
        .not()
        .isEmpty(),
    check('poid')
        .not()
        .isEmpty()
    ],
    poControllers.updateProduct
);

router.delete('/delete/:poid/:pid', poControllers.deleteProduct);

router.delete('/:poid', poControllers.deletePurchaseOrder);

module.exports = router;