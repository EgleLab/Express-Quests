const request = require("supertest");
const crypto = require("node:crypto");
const app = require("../src/app");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

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
    // Check if the movie was created successfully
    expect(response.status).toEqual(201);
     // Check if the response includes the user ID
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

     // This step requires that you have access to a `database` module in your tests
     const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

     // Verify that the user in the database has all the expected properties with correct types
     expect(userInDatabase).toHaveProperty("id");
     expect(typeof userInDatabase.id).toBe("number");
 
     expect(userInDatabase).toHaveProperty("firstname");
     expect(typeof userInDatabase.firstname).toBe("string");

     expect(userInDatabase).toHaveProperty("lastname");
     expect(typeof userInDatabase.lastname).toBe("string");

     expect(userInDatabase).toHaveProperty("email");
     expect(typeof userInDatabase.email).toBe("string");

     expect(userInDatabase).toHaveProperty("city");
     expect(typeof userInDatabase.city).toBe("string");

     expect(userInDatabase).toHaveProperty("language");
     expect(typeof userInDatabase.language).toBe("string");
     
     it("should return an error when required properties are missing", async () => {
      const userWithMissingProps = { firstname: "Harry Potter" };
  
     const response = await request(app)
         .post("/api/users")
         .send(userWithMissingProps);
  
      expect(response.status).toEqual(500);
   
    });
  
  });
  
    
});
