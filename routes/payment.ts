import { Router } from "express";
const paypal = require("@paypal/checkout-server-sdk");
const clientId =
  "AWM3oXkuKBMhbcQSbv_xLHNnW2A87k1cpq1olxcZyQYL7RzC0W9ACuXoNNEYw2AB6VZx0lywS_bfBo2b";
const clientSecret =
  "ED5DQ4-hMFbN1igpo_yqNpE4D59sK86C5CuAP3fmU88nO47xbPVQyEQ1wYp-h4763rbXla8Fez8QkGBL";
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);


const app = Router();

app.get("/", (req, res) => {
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    description:"how are you?",
    shipping:{
        county_code:"UK"
    },
    return_url:"yandex.ru",
    purchase_units: [
      {
        amount: {
          currency_code: "RUB",
          value: "100.00",
        },
      },
    ],
  });

  // Call API with your client and get a response for your call
  let createOrder = async function () {
    let response = await client.execute(request);
    console.log(`Order: ${JSON.stringify(response.result)}`);
    res.send('')
  };
  createOrder();
});

export default app;
