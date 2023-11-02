const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const purchaseOrderSchema = new Schema({

   product: [{ type: String, required: true, ref: 'product' }],
   quantity: { type: Number, required: true },
   total: { type: Number, required: true }
   
});

poSchema.plugin(uniqueValidator);

module.exports = mongoose.model('PO', purchaseOrderSchema);