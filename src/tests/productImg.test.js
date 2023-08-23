const request = require("supertest");
const app = require("../app");
const path = require("path");

const URL_USERS = "/api/v1/users";
const URL_PRODUCTIMAGES = "/api/v1/product_images";

let TOKEN;
let imageId;
beforeAll(async () => {
  const user = {
    email: "sergio@gmail.com",
    password: "sergio1234",
  };

  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  TOKEN = res.body.token;
});

test("POST -> 'URL_PRODUCTIMAGES', should return status code 201 to be defined and res.body.file to be defined", async () => {
  const localImage = path.join(__dirname, "..", "public", "test.jpg");
  const res = await request(app)
    .post(URL_PRODUCTIMAGES)
    .attach("image", localImage)
    .set("Authorization", `Bearer ${TOKEN}`);

  imageId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.url).toBeDefined();
  expect(res.body.filename).toBeDefined();
});

test("GET -> 'URL_PRODUCTIMAGES', should return status code 200 and res.body.toHaveLength === 1", async () => {
  const res = await request(app)
    .get(URL_PRODUCTIMAGES)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("DELETE -> 'URL_PRODUCTIMAGES/:id', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_PRODUCTIMAGES}/${imageId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
