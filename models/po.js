const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const poSchema = new Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   color: { type: String, required: true },
//   barcode: { type: String, required: true, unique: true, minlength: 6 },
//   category: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Category' }]
});

poSchema.plugin(uniqueValidator);

module.exports = mongoose.model('PurchaseOrder', poSchema);