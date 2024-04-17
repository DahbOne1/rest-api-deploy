import { readJSON } from "../utils.js";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";
import { randomUUID } from "node:crypto";

const movies = readJSON("./movies.json");

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }

    return movies;
  };

  static getById = async ({ id }) => {
    const movie = movies.find((movie) => movie.id === id);
    return movie;
  };

  static async create({ input }) {
    const newMovie = {
      //creamos el objeto
      id: randomUUID(),
      ...input,
    };

    movies.push(newMovie); //lo integramos al json
    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;

    movies.splice(movieIndex, 1);
    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    };
    return movies[movieIndex];
  }
}
