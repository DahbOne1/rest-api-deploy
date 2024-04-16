//creamos nuestro servidor con express
const express = require("express");
const crypto = require("node:crypto");
const cors = require("cors");
//importamos nuestros JSON con datos
const movies = require("./movies.json");
const { validateMovie, validatePartialMovie } = require("./schemas/movies.js");

const app = express();
app.use(express.json());
app.disable("x-powered-by");
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:1234",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

//const ACCEPTED_ORIGINS = ["http://localhost:8080", "http://localhost:1234"];

//url's
app.get("/", (req, res) => {
  res.json({ message: "hola mundo" });
});

//Todos los recuersos que sean MOVIES se identifican con /movies
app.get("/movies", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }

  res.json(movies);
});

//Agregar una nueva movie
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body); //validacion
  //const { title, genre, year, director, duration, poster, rate } = req.body;

  if (result.error) {
    //resultado
    res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const newMovie = {
    //creamos el objeto
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie); //lo integramos al json
  res.status(201).json(newMovie);
});

//Actualizar una pelicula
app.patch("/movies/:id", (req, res) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);
  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;
  return res.json(updateMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);
  return res.json({ message: "Movie deleted" });
});

/*
app.options("/movies/:id", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POSST, PATCH, DELETE");
  }
  res.send(200);
});*/

//El recusro que sea /movie por id
//url dinamico-pasamos un id mediante la url
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);
  if (movie) return res.json(movie);

  res.status(404).json("No se encontro el recurso");
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening in port http://localhost:${PORT}`);
});
