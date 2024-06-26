const request = require("supertest");
const crypto = require("node:crypto");
const app = require("../src/app");
const database = require("../database");
afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
});


describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/3");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");
    expect(response.status).toEqual(404);
  });
});


describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [usersDatabase] = result;
    const [userInDatabase] = result;

    Object.keys(newUser).forEach((key) => {
      expect(usersDatabase).toHaveProperty(key);
      expect(usersDatabase[key]).toEqual(newUser[key]);
      expect(userInDatabase).toHaveProperty(key);
      expect(userInDatabase[key]).toEqual(newUser[key]);
    });
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Marie" };
    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);
    expect(response.status).toEqual(422);
  });
});


describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Jean",
      lastname: "Bon",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Lille",
      language: "Caribou",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

 expect(response.status).toEqual(204);

 const [users] = await database.query("SELECT * FROM users WHERE id=?", id);
 const [userInDatabase] = users;

expect(userInDatabase).toHaveProperty("id");

    for (const key in updatedUser) {
      if (key !== "id") {
        expect(userInDatabase).toHaveProperty(key);
        expect(userInDatabase[key]).toStrictEqual(updatedUser[key]);
      }
    }
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Jean" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

  const response = await request(app).put("/api/users/0").send(newUser);
  expect(response.status).toEqual(404);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user", async () => {
      const response = await request(app).delete("/api/users/3");
  
      expect(response.status).toEqual(204);
    });
  
    it("should return 404 if user does not exist", async () => {
      const response = await request(app).delete("/api/users/2000");
  
      expect(response.status).toEqual(404);
    });
  });
