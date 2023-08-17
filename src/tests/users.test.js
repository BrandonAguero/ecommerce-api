const request = require("supertest");
const app = require("../app");

const URL_USERS = "/api/v1/users";

let TOKEN;
let userId;

beforeAll(async () => {
  const user = {
    email: "sergio@gmail.com",
    password: "sergio1234",
  };
  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  TOKEN = res.body.token;
});

test("GET -> 'URL_USERS', should return status code 200, res.body.toHaveLength === 1", async () => {
  const res = await request(app)
    .get(URL_USERS)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);
});

test("POST -> 'URL_USERS', should return status code 201, res.body.firstName === user.firstName", async () => {
  const user = {
    firstName: "brandon",
    lastName: "aguero",
    email: "brandon@gmail.com",
    password: "sergio1234",
    phone: "987654321",
  };

  const res = await request(app).post(URL_USERS).send(user);
  userId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test("PUT -> 'URL_USERS/:id', should return status code 200, res.body.firstName === userUpdated.firstName", async () => {
  const userUpdated = {
    firstName: "Brandon",
  };

  const res = await request(app)
    .put(`${URL_USERS}/${userId}`)
    .send(userUpdated)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.firstName).toBe(userUpdated.firstName);
});

test("POST -> 'URL_USERS/login', should return status code 200, res.body.email === user.email and res.body.token to be defined", async () => {
  const user = {
    email: "brandon@gmail.com",
    password: "sergio1234",
  };

  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.user.email).toBe(user.email);
  expect(res.body.token).toBeDefined();
});

test("POST -> 'URL_USERS/login', should return status code 401", async () => {
  const user = {
    email: "brandon@gmail.com",
    password: "invalid password",
  };
  const res = await request(app).post(`${URL_USERS}/login`).send(user);

  expect(res.status).toBe(401);
});

test("DELETE -> 'URL_USERS/:id', should return status code 204", async () => {
  const res = await request(app)
    .delete(`${URL_USERS}/${userId}`)
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(204);
});
