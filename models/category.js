const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: { type: String, required: true },
  code: { type: Number, required: true, maxlength: 2, unique: true }
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', categorySchema);