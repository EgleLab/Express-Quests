const express = require("express");

const app = express();
app.use(express.json()); // add this line



const movieControllers = require("./controllers/movieControllers");
const userControllers = require("./controllers/userControllers");

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

app.get("/api/users", userControllers.getUsers);
app.get("/api/users/:id", userControllers.getUserById); // We declared our route like this; Then in the HANDLER (fonction) we retrieved the id from the URL through req.params.id.

app.post("/api/movies", movieControllers.postMovie);
app.post("/api/users", userControllers.postUser);

app.put("/api/movies/:id", movieControllers.updateMovie);
app.put("/api/users/:id", userControllers.updateUser); // it's designed to capture the user ID, so you can update a specific user.


module.exports = app;
