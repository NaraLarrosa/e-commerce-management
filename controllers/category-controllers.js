const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Category = require('../models/category');
const { validationResult } = require('express-validator');

const getCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
  } catch (err) {
    const error = new HttpError(
      'The categories could not be recovered. Please try again later.',
      500
    );
    return next(error);
  }
  res.json({ categories: categories.map(category => category.toObject({ getters: true })) });
};

const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.cid;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'An error occurred, the category was not found',
      500
    );
    return next(error);
  };

  if (!category) {
    const error = new HttpError(
      'The category was not located with the provided id.',
      404
    );
    return next(error);
  };

  res.json({ category: category.toObject({ getters: true }) });
};

const createCategory = async(req, res, next ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('The data provided contains errors, please double-check your data.', 422)
      );
    };
  
    const { title, code } = req.body;
  
    const createdCategory = new Category({
      title,
      code
    });
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdCategory.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'The creation of the category was not successful; Please try again.',
        500
      );
      return next(error);
    };
  
    res.status(201).json({ category: createdCategory });
};

const updateCategory = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, please check your data.',
      422)
    );
  };

  const { title } = req.body;
  const categoryId = req.params.cid;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update category.',
      500
    );
    return next(error);
  };

  // if (product.toString() !== req.productData.categoryId) {
  //   const error = new HttpError('You are not allowed to edit this product.', 401);
  //   return next(error);
  // };

  category.title = title;

  try {
    await category.save();
  } catch (err) {
    const error = new HttpError(
      'An error occurred, the category could not be updated.',
      500
    );
    return next(error);
  };

  res.status(200).json({ category: category.toObject({ getters: true }) });
};


const deleteCategory = async(req, res, next) => {
  const categoryId = req.params.cid;

  let category;
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete category.',
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError('Could not find category for this id.',
      404);
    return next(error);
  }

  // if (product.creator.id !== req.userData.userId) {
  //   const error = new HttpError(
  //     'You are not allowed to delete this product.',
  //     401
  //   );
  //   return next(error);
  // }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // await Category.remove({ session: sess });
    await Category.deleteOne({ _id: categoryId}, {sess})
    .then(function(){
      console.log("Category deleted"); // Success
    }).catch(function(error){
      console.log(error); // Failure
    });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'An error occurred, could not delete category.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted category.' });
};

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
