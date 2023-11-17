const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Product = require('../models/product');
const PurchaseOrder = require('../models/po');
const { validationResult } = require('express-validator');

const getPurchaseOrder = async (req, res, next) => {
    let purchaseOrder;
    try {
        purchaseOrder = await PurchaseOrder.findById('6556cd9f112e990bb5819130');
    } catch (err) {
      const error = new HttpError(
        'The purchase order could not be recovered. Please try again later.',
        500
      );
      return next(error);
    }
    res.json({ purchaseOrder: purchaseOrder.toObject({ getters: true }) });
  };

const createPurchaseOrder = async (req, res, next) => {
    const createdCart = new PurchaseOrder({
        products: [],
        total: 0
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdCart.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'The creation of the purchase order was not successful; Please try again.',
            500
        );
        return next(error);
    };

    res.status(201).json({ cart : createdCart });
};

const addProduct = async (req, res, next) => {
    const { pid, quantity, poid } = req.body;

    let product;
    try {
        product = await Product.findById(pid);
    } catch (err) {
        const error = new HttpError(
            'An error occurred, the product was not found',
            500
        );
        return next(error);
    };

    let poById;
    try {
        poById = await PurchaseOrder.findById(poid);
    } catch (err) {
        const error = new HttpError(
            'An error occurred, the purchase order was not found',
            500
        );
        return next(error);
    };
    
    const productlist = poById.products;
    
    const productPo = {
        product : {
            id : product.id,
            name : product.name,
            description : product.description,
            color : product.color,
            barcode : product.barcode,
            price : product.price,
            category : product.category
        },
        quantity : quantity
    }

    let ProductExist = false;
    productlist.forEach(element => {
        if(element.product.id === product.id){
            element.quantity+=quantity;
            ProductExist = true;
        }
    });

    if(!ProductExist) productlist.push(productPo);

    poById.products = productlist;
    poById.total = sumTotal(productlist);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await poById.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'The product could not be added to the purchase order, please try again.',
            500
        );
        return next(error);
    };

    res.status(201).json({ cart : poById });

};

const sumTotal = (productlist) => {
    let total = 0;

    productlist.forEach(element => {
        price = element.product.price;
        quantity = element.quantity;
        subtotal = quantity * price;
        total += subtotal;
    });

    return total;
}

const updateProduct = async (req, res, next) => {
    const { pid, quantity, poid } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs, please check your data.',
            422)
        );
    };
    
    let product;
    try {
        product = await Product.findById(pid);
    } catch (err) {
        const error = new HttpError(
            'An error occurred, the product was not found',
            500
        );
        return next(error);
    };

    let poById;
    try {
        poById = await PurchaseOrder.findById(poid);
    } catch (err) {
        const error = new HttpError(
            'An error occurred, the purchase order was not found',
            500
        );
        return next(error);
    };

    const productList = poById.products;

    for(let i=0; i<productList.length; i++){
        if(productList[i].product.id === product.id){
            productList[i].quantity = quantity; 
        }
    }

    poById.products = productList;
    poById.total = sumTotal(productList);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await poById.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'The product could not be deleted to the purchase order, please try again.',
            500
        );
        return next(error);
    };
    
    res.status(200).json({ cart: poById.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
    const poid = req.params.poid;
    const pid = req.params.pid;

    let product;
    try {
        product = await Product.findById(pid);
    } catch (err) {
        const error = new HttpError(
            'An error occurred, the product was not found',
            500
        );
        return next(error);
    };

    let poById;
    try {
        poById = await PurchaseOrder.findById(poid);
    } catch (err) {
        const error = new HttpError(
            'An error occurred, the purchase order was not found',
            500
        );
        return next(error);
    };

    const productList = poById.products;

    for(let i=0; i<productList.length; i++){
        if(productList[i].product.id === product.id){
            productList.splice(i , 1);
        }
    }

    poById.products = productList;
    poById.total = sumTotal(productList);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await poById.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'The product could not be deleted to the purchase order, please try again.',
            500
        );
        return next(error);
    };

    res.status(201).json({ cart : poById });

};

const deletePurchaseOrder = async (req, res, next) => {
    const poId = req.params.poid;

    let cart;
    try {
      cart = await PurchaseOrder.findById(poId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete purchase order.',
        500
      );
      return next(error);
    }
  
    if (!cart) {
      const error = new HttpError('Could not find purchase order for this id.',
        404);
      return next(error);
    }
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await PurchaseOrder.deleteOne({'_id': poId}, {sess})
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'An error occurred, could not delete purchase order.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ message: 'Deleted purchase order.' });

};

exports.getPurchaseOrder = getPurchaseOrder;
exports.createPurchaseOrder = createPurchaseOrder;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.deletePurchaseOrder = deletePurchaseOrder;