require("../models");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const URL_PURCHASE = "/api/v1/purchase";
const URL_USERS = "/api/v1/users";

let product;
let productBody;
let userId;
let TOKEN;
let cartBody;
beforeAll(async () => {
  const user = {
    email: "sergio@gmail.com",
    password: "sergio1234",
  };
  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  TOKEN = res.body.token;

  productBody = {
    title: "Samsung 30 6 Cubic Feet Smart Gas Slide-In Range",
    description:
      "This new gas range is fully wi-fi connected and voice-enabled",
    price: "799",
  };

  userId = res.body.user.id;

  product = await Product.create(productBody);

  cartBody = {
    quantity: 1,
    productId: product.id,
    userId,
  };

  await Cart.create(cartBody);
});

test("CREATE -> 'URL_PURCHASE', should return status code 201", async () => {
  const res = await request(app)
    .post(URL_PURCHASE)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(201);
});

test("GET -> 'URL_PURCHASE', should return status code 200 and res.body.toHaveLength === 1", async () => {
  const res = await request(app)
    .get(URL_PURCHASE)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].product).toBeDefined();
  expect(res.body[0].productId).toBe(product.id);

  await product.destroy();
});
