const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const purchaseOrderSchema = new Schema({
   products: [{ 
      product: {
         id: { type: String, required:true },
         name: { type: String, required: true },
         description: { type: String, required: true },
         color: { type: String, required: true },
         barcode: { type: String, required: true, unique: true, minlength: 6 },
         price: { type: Number, required: true },
         category: { type: String, required: false, ref: 'Category' }
      }, 
      quantity: { type: Number, required: true } 
   }],
   total: { type: Number, required: true }
});

purchaseOrderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);