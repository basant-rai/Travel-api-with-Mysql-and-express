const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// hashing algorithm
const bcrypt = require("bcrypt");
const salt = 10;

// app objects instantiated on creation of the express server
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mysql_db",
});

//create access token
const createAccessToken = (user) => {
  // create new JWT access token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return accessToken;
};

//create refresh token
const createRefreshToken = (user) => {
  // create new JWT access token
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1m",
    }
  );
  return refreshToken;
};

// verify if user has a valid token, when user wants to access resources
const authenticateAccessToken = (req, res, next) => {
  //check if user has access token
  const accessToken = req.cookies["access-token"];

  // if access token does not exist
  if (!accessToken) {
    return res.sendStatus(401);
  }

  // check if access token is valid
  // use verify function to check if token is valid
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    return next();
  });
};

app.post("/token", (req, res) => {
  const refreshToken = req.cookies["refresh-token"];
  // check if refresh token exist
  if (!refreshToken) return res.sendStatus(401);

  // verify refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);

    // check for refresh token in database and identify potential user
    sqlFindUser = "SELECT * FROM user_db WHERE refresh_token = ?";
    db.query(sqlFindUser, [refreshToken], (err, user) => {
      // if no user found
      if (user.length === 0) return res.sendStatus(401);

      const accessToken = createAccessToken(user[0]);
      res.cookie("access-token", accessToken, {
        maxAge: 10000*60, //1h
        httpOnly: true, 
      });
      res.send(user[0]);
    });
  });
});

/**
 * Log out functionality which deletes all cookies containing tokens and deletes refresh token from database
 */
app.delete("/logout", (req, res) => {
  const refreshToken = req.cookies["refresh-token"];
  // delete refresh token from database
  const sqlRemoveRefreshToken =
    "UPDATE user_db SET refresh_token = NULL WHERE refresh_token = ?";
  db.query(sqlRemoveRefreshToken, [refreshToken], (err, result) => {
    if (err) return res.sendStatus(401);

    // delete all cookies
    res.clearCookie("access-token");
    res.clearCookie("refresh-token");
    res.end();
  });
});

// handle user sign up
app.post("/sign-up", (req, res) => {
  //request information from frontend
  const { first_name, last_name, email, password } = req.body;

  // hash using bcrypt
  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      res.send({ err: err });
    }

    // insert into backend with hashed password
    const sqlInsert =
      "INSERT INTO user_db (first_name, last_name, email, password) VALUES (?,?,?,?)";
    db.query(sqlInsert, [first_name, last_name, email, hash], (err, result) => {
      res.send(err);
    });
  });
});

/*
 * Handel user login
 */
app.post("/sign-in", (req, res) => {
  const { email, password } = req.body;

  sqlSelectAllUsers = "SELECT * FROM user_db WHERE email = ?";
  db.query(sqlSelectAllUsers, [email], (err, user) => {
    if (err) {
      res.send({ err: err });
    }

    if (user && user.length > 0) {
      // given the email check if the password is correct

      bcrypt.compare(password, user[0].password, (err, compareUser) => {
        if (compareUser) {
          //req.session.email = user;
          // create access token
          const accessToken = createAccessToken(user[0]);
          const refreshToken = createRefreshToken(user[0]);
          // create cookie and store it in users browser
          res.cookie("access-token", accessToken, {
            maxAge: 10000*60, //1h
            httpOnly: true, 
          });
          res.cookie("refresh-token", refreshToken, {
            maxAge: 2.63e9, // approx 1 month
            httpOnly: true,
          });

          // update refresh token in database
          const sqlUpdateToken =
            "UPDATE user_db SET refresh_token = ? WHERE email = ?";
          db.query(
            sqlUpdateToken,
            [refreshToken, user[0].email],
            (err, result) => {
              if (err) {
                res.send(err);
              }
              res.sendStatus(200);
            }
          );
        } else {
          res.send({ message: "Wrong email or password" });
        }
      });
    } else {
      res.send({ message: "Wrong email or password" });
    }
  });
});

app.get("/get-user", (req, res) => {
  const accessToken = req.cookies["acceess-token"];
  const refreshToken = req.cookies["refresh-token"];
  //if (!accessToken && !refreshToken) res.sendStatus(401);

  // get user from database using refresh token
  // check for refresh token in database and identify potential user
  sqlFindUser = "SELECT * FROM user_db WHERE refresh_token = ?";
  db.query(sqlFindUser, [refreshToken], (err, user) => {
    console.log(user);
    return res.json(user);
  });
});

app.listen(4000, () => {
  console.log("running on port 4000");
});
