const Stripe = require('stripe');
require('dotenv').config(); // make sure env loads

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
