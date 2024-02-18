const request = require("supertest");
const crypto = require("node:crypto");
const app = require("../src/app");

    const [movieInDatabase] = result;

    // Etape 1 : Création du test

    describe("PUT /api/movies/:id", () => {
      it("should edit movie", async () => {
        const newMovie = {
          title: "Avatar",
          director: "James Cameron",
          year: "2009",
          color: "1",
          duration: 162,
        };

        // Etape 2 : Récupération de l'id du dernier film ajouté
        const [result] = await database.query(
          "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
          [newMovie.title, newMovie.director, newMovie.year, newMovie.color, newMovie.duration]
        );
    
        const id = result.insertId;

        // Etape 3 : Exécution de la requête en PUT

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

        // Etape 4 : Récupération de la ressource modifiée

        const [movies] = await database.query("SELECT * FROM movies WHERE id=?", id);

        const [movieInDatabase] = movies;
    
        expect(movieInDatabase).toHaveProperty("id");
    
        expect(movieInDatabase).toHaveProperty("title");
        expect(movieInDatabase.title).toStrictEqual(updatedMovie.title);
    
        expect(movieInDatabase).toHaveProperty("director");
        expect(movieInDatabase.director).toStrictEqual(updatedMovie.director);
    
        expect(movieInDatabase).toHaveProperty("year");
        expect(movieInDatabase.year).toStrictEqual(updatedMovie.year);
    
        expect(movieInDatabase).toHaveProperty("color");
        expect(movieInDatabase.color).toStrictEqual(updatedMovie.color);
    
        expect(movieInDatabase).toHaveProperty("duration");
        expect(movieInDatabase.duration).toStrictEqual(updatedMovie.duration);
        
      });

      // Etape 5 : Tester si une erreur est bien renvoyée si on envoie un film incomplet ou mal formaté

      it("should return an error", async () => {
        const movieWithMissingProps = { title: "Harry Potter" };
    
        const response = await request(app)
          .put(`/api/movies/1`)
          .send(movieWithMissingProps);
    
        expect(response.status).toEqual(500);
    });
// Etape 6 : Vérification du code de retour si on cherche à modifier un film qui n'existe pas

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

  


