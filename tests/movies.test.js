const request = require("supertest");

const app = require("../src/app");


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

     // Verify that the movie in the database has all the expected properties with correct types
    expect(movieInDatabase).toHaveProperty("id");
    expect(typeof movieInDatabase.id).toBe("number");

    expect(movieInDatabase).toHaveProperty("title");
    expect(typeof movieInDatabase.title).toBe("string");
    expect(movieInDatabase.title).toStrictEqual(newMovie.title);

    expect(movieInDatabase).toHaveProperty("director");
    expect(typeof movieInDatabase.director).toBe("string");

    expect(movieInDatabase).toHaveProperty("year");
    expect(typeof movieInDatabase.year).toBe("string");

    expect(movieInDatabase).toHaveProperty("color");
    expect(typeof movieInDatabase.color).toBe("string");

    expect(movieInDatabase).toHaveProperty("duration");
    expect(typeof movieInDatabase.duration).toBe("number");
  

    it("should return an error when required properties are missing", async () => {
      const movieWithMissingProps = { title: "Harry Potter" };
  
     const response = await request(app)
         .post("/api/movies")
         .send(movieWithMissingProps);
  
      expect(response.status).toEqual(500);
   
     });
  
    });

  });
