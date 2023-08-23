require("../models");
const request = require("supertest");
const app = require("../app");

const Category = require("../models/Category.js");
const ProductImg = require("../models/ProductImg.js");

const URL_PRODUCTS = "/api/v1/products";
const URL_USERS = "/api/v1/users";

let TOKEN;
let product;
let category;
let productId;
let image;
beforeAll(async () => {
  category = await Category.create({ name: "smartphones" });

  const user = {
    email: "sergio@gmail.com",
    password: "sergio1234",
  };
  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  TOKEN = res.body.token;

  product = {
    title: "Samsung 30 6 Cubic Feet Smart Gas Slide-In Range",
    description:
      "This new gas range is fully wi-fi connected and voice-enabled",
    price: "799",
    categoryId: category.id,
  };
});

test("POST -> 'URL_PRODUCTS', should return status code 201 and res.body.title === product.title", async () => {
  const res = await request(app)
    .post(URL_PRODUCTS)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);
  productId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("GET -> 'URL_PRODUCTS/:id', should return status code 200 and res.body.title === product.title", async () => {
  const res = await request(app).get(`${URL_PRODUCTS}/${productId}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
  expect(res.body.category).toBeDefined();
  expect(res.body.category.id).toBe(product.categoryId);
  expect(res.body.productImgs).toBeDefined();
  expect(res.body.productImgs).toHaveLength(0);
});

test("PUT -> 'URL_PRODUCTS/:id', should return status code 200 and res.body.title === productUpdated.title", async () => {
  const productUpdated = {
    title: "Samsung Chicken Modern",
  };
  const res = await request(app)
    .put(`${URL_PRODUCTS}/${productId}`)
    .send(productUpdated)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(productUpdated.title);
});

test("GET -> 'URL_PRODUCTS', should return status code 200 and res.body.toHaveLength === 1", async () => {
  const res = await request(app).get(URL_PRODUCTS);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
  expect(res.body[0].productImgs).toBeDefined();
  expect(res.body[0].productImgs).toHaveLength(0);
});

test("GET -> 'URL_PRODUCTS?category=id', should return status code 200, res.body.toHaveLength === 1 and res.body[0].category to be defined and res.body[0]", async () => {
  const res = await request(app).get(`${URL_PRODUCTS}?category=${category.id}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
});

test("POST -> 'URL_PRODUCTS/:id/images', should return status code 200 res.body.toHaveLength === 1", async () => {
  const bodyImage = {
    url: "https://unsplash.com/algo.jpg",
    filename: "algo",
  };
  image = await ProductImg.create(bodyImage);

  const res = await request(app)
    .post(`${URL_PRODUCTS}/${productId}/images`)
    .send([image.id])
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'URL_PRODUCTS', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_PRODUCTS}/${productId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);

  await category.destroy();
  await image.destroy();
});
