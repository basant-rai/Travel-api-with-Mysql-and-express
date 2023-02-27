const express = require('express');
const upload = require('../utils/file_upload');
const { viewProduct, findProductById, addProduct, removeProduct, updateProduct } = require('../Controller/product_controller');
const { verifyToken } = require('../Controller/user');
const { validation, productCheck } = require('../Validation');
const router = express.Router()

router.get('/viewproduct', viewProduct,)
router.get('/viewproductbyid/:id', findProductById)
router.post('/addproduct',upload.single('product_image'), verifyToken, productCheck, validation, addProduct,)
router.delete('/deleteproduct/:id', verifyToken, removeProduct)
router.put('/updateproduct/:id',upload.single('product_image'),verifyToken, productCheck, validation, updateProduct)

module.exports = router;