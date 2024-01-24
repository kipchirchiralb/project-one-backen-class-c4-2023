const express = require("express");
const app = express();
// app.set("view engine", "ejs");

const mysql = require("mysql");
const myconn = mysql.createConnection({
  host: "localhost",
  database: "newpeople",
  user: "root",
  password: "",
});
// test myconn
myconn.connect((err) => {
  if (!err) {
    console.log("Database connection successful");
  } else {
    console.log(err);
  }
});

app.get("/", (req, res) => {
  res.send("Home Route/page");
});
app.get("/users", (req, res) => {
  // fetch all users from db
  myconn.query("SELECT * FROM users", (error, queryResult) => {
    if (error) {
      res.send(`A databse Error occured: ${error.message}`);
    } else {
      //   res.send(`A list of all users: ${JSON.stringify(queryResult)} `);
      //   res.json(queryResult);
      res.render("user.ejs", { queryResult });
    }
  });
});
app.get("/newuser", (req, res) => {
  res.render("new.ejs");
});
app.post("/newuser", (req, res) => {
  // save new user in db
  res.redirect("/users");
});

app.listen(3003, () => console.log("App running on port 3003"));
