//creamos nuestro servidor con express
import express, { json } from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { createMovieRouter } from "./routes/movies.js";
//importamos nuestros JSON con datos
//import movies from "./movies.json" with { type: "json" };
/*import fs from "node:fs";
const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));*/
//const movies = readJSON("./movies.json");

export const createApp = ({ movieModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  //app.use(corsMiddleware);
  //const ACCEPTED_ORIGINS = ["http://localhost:8080", "http://localhost:1234"];

  //url's
  app.get("/", (req, res) => {
    res.json({ message: "hola mundo" });
  });

  app.use("/movies", createMovieRouter({ movieModel }));

  //Todos los recuersos que sean MOVIES se identifican con /movies
  //app.use("/movies", moviesRouter);
  //res.header("Access-Control-Allow-Origin", "*");

  //Agregar una nueva movie
  //app.post("/movies", (req, res) => {});

  //Actualizar una pelicula
  //app.patch("/movies/:id", (req, res) => {});

  //app.delete("/movies/:id", (req, res) => {});

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
  //app.get("/movies/:id", (req, res) => {});

  const PORT = process.env.PORT ?? 1234;

  app.listen(PORT, () => {
    console.log(`Server listening in port http://localhost:${PORT}`);
  });
};
