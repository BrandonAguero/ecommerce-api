require("../models");
const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

const URL_CART = "/api/v1/cart";
const URL_USERS = "/api/v1/users";

let productBody;
let product;
let userId;
let TOKEN;
let cartId;
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
});

test("POST -> 'URL_CART', should return status code 201 and res.body.quantity === cart.quantity", async () => {
  const cart = {
    quantity: 1,
    productId: product.id,
  };
  const res = await request(app)
    .post(URL_CART)
    .send(cart)
    .set("Authorization", `Bearer ${TOKEN}`);

  cartId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(cart.quantity);
});

test("GET -> 'URL_CART', should return status code 200 and res.body.toHaveLength === 1", async () => {
  const res = await request(app)
    .get(URL_CART)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].userId).toBe(userId);
  expect(res.body[0].product).toBeDefined();
  expect(res.body[0].product.id).toBe(product.id);
  expect(res.body[0].productId).toBe(product.id);
  expect(res.body[0].product.productImgs).toBeDefined();
  expect(res.body[0].product.productImgs).toHaveLength(0);
});

test("PUT -> 'URL_CART/:id', should return status code 200 and res.body.quantity === cartUpdated.quantity", async () => {
  const cartUpdated = {
    quantity: 4,
  };
  const res = await request(app)
    .put(`${URL_CART}/${cartId}`)
    .send(cartUpdated)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.quantity).toBe(cartUpdated.quantity);
});

test("DELETE -> 'URL_CART/:id', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_CART}/${cartId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await product.destroy();
});
