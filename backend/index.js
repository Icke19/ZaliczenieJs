const mariadb = require("mariadb");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;
require("./polyfills");

app.use(bodyParser.json());
app.use(cors());

const connection = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "mypass",
  database: "test",
  connectionLimit: 5,
});
//Pobierz wszystkich uzytkownikow

app.get("/users", (req, res) => {
  connection
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM Users")
        .then((rows) => {
          res.statusCode = 200;
          res.json(rows);
          conn.end();
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

//Inkrementuj liczbe wygranych

app.post("/users/:id", (req, res) => {
  const id = req.params.id;

  connection
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `UPDATE Users SET AmountOfWonGames = AmountOfWonGames + 1 WHERE ID = ${id}`
        )
        .then(() => {
          conn
            .query(`select * from Users where ID = ${id}`)
            .then((rows) => {
              res.statusCode = 200;
              res.json(rows[0]);
              conn.end();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/games", (req, res) => {
  connection
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `INSERT INTO Games (Winner, Points)
          VALUES (null, null)`
        )
        .then((response) => {
          res.statusCode = 200;
          res.json({
            id: parseInt(response.insertId),
            winner: null,
            points: null,
          });
          conn.end();
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.put("/games", (req, res) => {
  const id = req.body.id;
  const winner = req.body.winner;
  const points = req.body.points;
  connection
    .getConnection()
    .then((conn) => {
      conn
        .query(
          `UPDATE Games
          SET Winner = ${winner}, Points= ${points}
          WHERE ID = ${id};`
        )

        .then((response) => {
          res.statusCode = 200;
          res.send();
          conn.end();
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
