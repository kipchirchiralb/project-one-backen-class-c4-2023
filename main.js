const express = require("express");
const app = express();
// app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // to decode the request and get the body/data out of the request.data could be in all formats(image,video e.t.c)
app.use(express.static("publicFolder"));

const mysql = require("mysql");
const myconn = mysql.createConnection({
  host: "localhost",
  database: "people_db",
  user: "root",
  password: "",
});
// test myconn
myconn.connect((err) => {
  if (!err) {
    console.log("Database connection successful");
  } else {
    console.log("Error connecting db");
  }
});
// myconn.query("SELECT * FROM users", (err, data) => {
//   console.log(data);
// });
app.get("/", (req, res) => {
  // home/index/root route
  res.render("index.ejs");
});

// query parameters and query strings ---
// dynamic pages

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
app.get("/users/:id", (req, res) => {
  const userid = Number(req.params.id);
  // fetch a user of id userid from db
  myconn.query(
    `SELECT * FROM users WHERE id =${userid}`,
    (error, queryResult) => {
      if (error) {
        res.send(`A databse Error occured: ${error.message}`);
      } else {
        res.render("details.ejs", { user: queryResult[0] });
      }
    }
  );
});

app.get("/newuser", (req, res) => {
  res.render("new.ejs");
});

app.post("/addnewuser", (req, res) => {
  const userData = req.body;
  console.log(userData);
  myconn.query(
    `INSERT INTO users(names, age, gender) 
    VALUES('${userData.fname}', ${Number(userData.age)}, '${userData.gender}')`,
    (err) => {
      if (err) {
        res
          .status(500)
          .send(`Server Error. Contact Admin if this persists: ${err}`);
      } else {
        res.redirect("/users");
      }
    }
  );
});

app.post("/delete/:userid", (req, res) => {
  const userid = Number(req.params.userid);
  myconn.query(`DELETE FROM users WHERE id=${userid}`, (err) => {
    if (err) {
      res.status(500).send("Error while deleting the user.");
    } else {
      res.redirect("/users");
    }
  });
});

app.get("/edituser", (req, res) => {
  console.log(req.query.userid);
  myconn.query(
    `SELECT * FROM users WHERE id = ${Number(req.query.userid)}`,
    (err, data) => {
      if (err) {
        res.status(500).send("Error while fetching this page");
      } else {
        res.render("edit.ejs", { user: data[0] });
      }
    }
  );
});
app.post("/updateuser", (req, res) => {
  console.log(req.body);
  // update statement
  myconn.query(
    `UPDATE users SET names='${req.body.fname}',age=${Number(
      req.body.age
    )}, gender='${req.body.gender}' WHERE id=${Number(req.body.userid)}`,
    (err) => {
      if (err) {
        res.status(500).send("Error While update user");
      } else {
        res.redirect(`/users/${Number(req.body.userid)}`);
      }
    }
  );
});

app.listen(3003, () => console.log("App running on port 3003"));
