const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/product-routes');
const categoryRoutes = require('./routes/category-routes');
//const purchaseOrderRoutes = require('./routes/po-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

//     next();
// });

//Rutas de la api
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
//app.use('/api/po', purchaseOrderRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find the given path.', 404);
    throw error;
});

//Conexion DB
const mongoose = require('mongoose');

mongoose.connect(
    `mongodb+srv://nara:hola1234@cluster0.xkfnw3f.mongodb.net/e-commerce?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });