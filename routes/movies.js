import { Router } from "express";
import { MovieController } from "../controllers/movies.js";
import { readJSON } from "../utils.js";

const movies = readJSON("./movies.json");

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router();
  const movieController = new MovieController({ movieModel });

  //consultar todas las peliculas
  moviesRouter.get("/", movieController.getAll);

  //consultar una pelicula por su id
  moviesRouter.get("/:id", movieController.getById);

  //Crear una nueva pelicula
  moviesRouter.post("/", movieController.create);

  //Eliminar una pelicula
  moviesRouter.delete("/:id", movieController.delete);

  //Actualizar una pelicula
  moviesRouter.patch("/:id", movieController.update);

  return moviesRouter;
};
