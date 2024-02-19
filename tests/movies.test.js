const request = require("supertest");
const crypto = require("node:crypto");
const app = require("../src/app");
const database = require("../database");
afterAll(() => database.end());


describe("GET /api/movies", () => {
  it("should return all movies", async () => {
    const response = await request(app).get("/api/movies");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/movies/:id", () => {
  it("should return one movie", async () => {
    const response = await request(app).get("/api/movies/1");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });

  it("should return no movie", async () => {
    const response = await request(app).get("/api/movies/0");
    expect(response.status).toEqual(404);
  });
});

describe("POST /api/movies", () => {
  it("should return created movie", async () => {
   const newMovie = {
      title: "Star Wars",
      director: "George Lucas",
      year: "1977",
      color: "1",
      duration: 120,
    };

    const response = await request(app).post("/api/movies").send(newMovie);
    // Check if the movie was created successfully
    expect(response.status).toEqual(201);
     // Check if the response includes the movie ID
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

  // This step requires that you have access to a `database` module in your tests
    const [result] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      response.body.id
    );

    const [movieInDatabase] = result;

    Object.keys(newMovie).forEach((key) => {
      expect(movieInDatabase).toHaveProperty(key);
      expect(movieInDatabase[key]).toEqual(newMovie[key]);
    });
  });

    it("should return an error when required properties are missing", async () => {
      const movieWithMissingProps = { title: "Harry Potter" };
  
     const response = await request(app)
         .post("/api/movies")
         .send(movieWithMissingProps);
     expect(response.status).toEqual(500);
   
     });
  
    });



describe("PUT /api/movies/:id", () => {
  it("should edit movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };

    const [result] = await database.query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [
        newMovie.title,
        newMovie.director,
        newMovie.year,
        newMovie.color,
        newMovie.duration,
      ]
    );

    const id = result.insertId;

    const updatedMovie = {
      title: "Wild is life",
      director: "Alan Smithee",
      year: "2023",
      color: "0",
      duration: 120,
    };

    const response = await request(app)
      .put(`/api/movies/${id}`)
      .send(updatedMovie);

    expect(response.status).toEqual(204);

    const [movies] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      id
    );

    const [movieInDatabase] = movies;

    expect(movieInDatabase).toHaveProperty("id");

    for (const key in updatedMovie) {
      if (key !== "id") {
        expect(movieInDatabase).toHaveProperty(key);
        expect(movieInDatabase[key]).toStrictEqual(updatedMovie[key]);
      }
    }
  });

  it("should return an error", async () => {
    const updatedMovie = { title: "Harry Potter" };

    const response = await request(app).put(`/api/movies/1`).send(updatedMovie);

    expect(response.status).toEqual(500);
  });

  it("should return no movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: "1",
      duration: 162,
    };

    const response = await request(app).put("/api/movies/0").send(newMovie);
    expect(response.status).toEqual(404);
  });
});


