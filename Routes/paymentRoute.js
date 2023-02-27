const express = require('express');
const { sessionCheckoutSubscription, productCheckout } = require('../Controller/PaymentController');
const router = express.Router();

router.post('/subscription-checkout',sessionCheckoutSubscription)
router.post('/product-checkout',productCheckout)

module.exports = router;