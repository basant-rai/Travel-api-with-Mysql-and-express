const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

exports.sessionCheckoutSubscription = async (req, res) => {
  const product_id = req.body.product_id
  if (product_id === 1) {
    var priceId = "price_1Mb6DPL8IIp3OxBDHLjZ201G"
  }
  if (product_id === 2) {
    var priceId = "price_1MbRs6L8IIp3OxBDAvz9oZat"
  }
  if (product_id === 3) {
    var priceId = "price_1MbS65L8IIp3OxBDRIPfhBTN"
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity: 1,
    },
    ],

    success_url: `${process.env.CLIENT_URL}/payment-success`,
    cancel_url: `${process.env.CLIENT_URL}/subscription`,
  });
  res.send({ data: session.url  })

}

exports.productCheckout = async(req,res)=>{
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
    },
  });
  const line_items = req.body.cart_items.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product_name,
          images: [item.product_image],
          description: item.product_description,
          metadata: {
            id: item.product_id,
          },
        },
        unit_amount: item.product_price * 100,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/payment-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  // res.redirect(303, session.url);
  res.send({ data: session.url  })
}

