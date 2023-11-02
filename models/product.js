const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  barcode: { type: String, required: true, unique: true, minlength: 6 },
  price: { type: Number, required: true },
  category: { type: String, required: false, ref: 'Category' }
});

productSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Product', productSchema);