import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "holamundo",
  database: "moviesdb",
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      const [genres] = await connection.query(
        "SELECT id, name FROM genre WHERE LOWER(name) = ?;",
        [lowerCaseGenre]
      );

      if (genres.length === 0) return [];
      const [{ id }] = genres;

      const [movies] = await connection.query(
        `SELECT m.title, m.year, m.director, m.duration, m.poster, m.rate, BIN_TO_UUID(m.id) as id,
         g.name as genero FROM movie AS m 
        INNER JOIN movie_genre AS mg 
          ON m.id = mg.movie_id
        INNER JOIN genre AS g
          ON mg.genre_id = g.id  
        WHERE mg.genre_id = ?;`,
        [id]
      );
      return movies;
    }

    const [movies] = await connection.query(
      "SELECT title, year, director,duration, poster, rate, BIN_TO_UUID(id) id FROM movie;"
    );

    return movies;
  };

  static getById = async ({ id }) => {
    const [movies] = await connection.query(
      "SELECT title, year, director,duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);",
      [id]
    );

    if (movies.length === 0) return null;

    return movies[0];
  };

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      const result = await connection.query(
        `INSERT INTO movie(id, title,year,director, duration,poster,rate)
        VALUES(UUID_TO_BIN("${uuid}"),?,?,?,?,?,?);`,
        [title, year, director, duration, poster, rate]
      );
    } catch (error) {
      throw new Error("Error creating movie");
    }

    const [movies] = await connection.query(
      "SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);",
      [uuid]
    );

    const genreInputs = genreInput.map(async (genre) => {
      const [genres] = await connection.query(
        "SELECT id, name FROM genre WHERE name = ?;",
        [genre]
      );

      const [{ id }] = genres;

      try {
        const [movie_genre] = await connection.query(
          `INSERT INTO movie_genre(movie_id, genre_id)
        VALUES(UUID_TO_BIN("${uuid}"),?);`,
          [id]
        );
      } catch (error) {
        throw new Error(error);
      }
    });

    return movies;
  }

  static async delete({ id }) {
    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) id FROM movie
        WHERE id = ?;`,
      [id]
    );

    if (movies.length === 0) return [];

    const result = await connection.query(
      `DELETE movie, movie_genre 
        FROM movie
          INNER JOIN movie_genre
          ON movie.id = movie_genre.movie_id
        WHERE
        movie.id = UUID_TO_BIN(?);`,
      [id]
    );

    return movies;
  }

  static async update({ id, input }) {
    return "sds";
  }
}
