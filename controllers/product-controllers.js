const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Product = require('../models/product');
const Category = require('../models/category');
const { validationResult } = require('express-validator');

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find({}, '-barcode');
  } catch (err) {
    const error = new HttpError(
      'The products could not be recovered. Please try again later.',
      500
    );
    return next(error);
  }
  res.json({ products: products.map(product => product.toObject({ getters: true })) });
};

const getProductByCategoryId = async (req, res, next) => {
  const categoryId = req.params.cid;

  let productsByCategory;
  try {
    productsByCategory = await Product.find({ 'category' : categoryId });  
  } catch (err) {
    const error = new HttpError(
      'Fetching products failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    products: productsByCategory.map(product =>
      product.toObject({ getters: true })
    )
  });
};

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'An error occurred, the product was not found',
      500
    );
    return next(error);
  };

  if (!product) {
    const error = new HttpError(
      'The product was not located with the provided id.',
      404
    );
    return next(error);
  };

  res.json({ product: product.toObject({ getters: true }) });
};

const createProduct = async(req, res, next ) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('The data provided contains errors, please double-check your data.', 422)
    );
  };

  const { name, description, color, barcode, price, category } = req.body;

  const createdProduct = new Product({
    name,
    description,
    color,
    barcode,
    price,
    category
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'The creation of the product was not successful; Please try again.',
      500
    );
    return next(error);
  };

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please check your data.',
      422)
    );
  };

  const { name, description, color, price, category } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  };

  product.name = name;
  product.description = description;
  product.color = color;
  product.price = price;
  product.category = category;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      'An error occurred, the product could not be updated.',
      500
    );
    return next(error);
  };
  
  res.status(200).json({ product: product.toObject({ getters: true }) });
};


const deleteProduct = async(req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId).populate('category');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError('Could not find product for this id.',
      404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Product.deleteOne({ _id: productId}, {sess})
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'An error occurred, could not delete product.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted product.' });
};

exports.getProducts = getProducts;
exports.getProductByCategoryId = getProductByCategoryId;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;