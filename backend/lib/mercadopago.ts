const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

export default mercadopago;
