const request = require("supertest");
const crypto = require("node:crypto");
const app = require("../src/app");

const [userInDatabase] = result;

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Egle",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Berlin",
      language: "Dutch",
    };
  
// Etape 2 : Récupération de l'id du dernier user ajouté
const [result] = await database.query(
  "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
  [newUser.firstname, newUser.lastname, newUser.email, newUser.city, newUser.language]
);

const id = result.insertId;

// Etape 3 : Exécution de la requête en PUT

const updateUser = {
  firstname: "Jimmy",
  lastname: "Martin",
  email: `${crypto.randomUUID()}@wild.co`,
  city: "Paris",
  language: "French",
};

const response = await request(app)
  .put(`/api/users/${id}`)
  .send(updateUser);

expect(response.status).toEqual(204);

 // Etape 4 : Récupération de la ressource modifiée

 const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

 const [userInDatabase] = users;

 expect(userInDatabase).toHaveProperty("id");

 expect(userInDatabase).toHaveProperty("firstname");
 expect(userInDatabase.firstname).toStrictEqual(updateUser.firstname);

 expect(userInDatabase).toHaveProperty("lastname");
 expect(userInDatabase.lastname).toStrictEqual(updateUser.lastname);

 expect(userInDatabase).toHaveProperty("email");
 expect(userInDatabase.email).toStrictEqual(updateUser.email);

 expect(userInDatabase).toHaveProperty("city");
 expect(userInDatabase.city).toStrictEqual(updateUser.city);

 expect(userInDatabase).toHaveProperty("language");
 expect(userInDatabase.language).toStrictEqual(updateUser.language);
 
});

 // Etape 5 : Tester si une erreur est bien renvoyée si on envoie un film incomplet ou mal formaté

 it("should return an error", async () => {
  const userWithMissingProps = { firstname: "Harry Potter" };

  const response = await request(app)
    .put(`/api/users/1`)
    .send(userWithMissingProps);

  expect(response.status).toEqual(500);

 });
// Etape 6 : Vérification du code de retour si on cherche à modifier un film qui n'existe pas

it("should return no user", async () => {
  const newUser = {
    firstname: "Egle",
    lastname: "Martin",
    email: `${crypto.randomUUID()}@wild.co`,
    city: "Berlin",
    language: "Dutch",
  };

  const response = await request(app).put("/api/users/0").send(newUser);

  expect(response.status).toEqual(404);
    });
  });