import { Router } from "express";
import { readJSON } from "../utils.js";
import { MovieController } from "../controllers/movies.js";

const movies = readJSON("./movies.json");
export const moviesRouter = Router();

//consultar todas las peliculas
moviesRouter.get("/", MovieController.getAll);

//consultar una pelicula por su id
moviesRouter.get("/:id", MovieController.getById);

//Crear una nueva pelicula
moviesRouter.post("/", MovieController.create);

//Eliminar una pelicula
moviesRouter.delete("/:id", MovieController.delete);

//Actualizar una pelicula
moviesRouter.patch("/:id", MovieController.update);
