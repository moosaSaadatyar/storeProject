const express = require("express");
const mongo = require("mongoose");
const cors = require("cors");
const path = require("path");
const boodyParser = require("body-parser");

const adminRouter = require("./src/routes/admin");
const shopeRouter = require("./src/routes/shope");

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(boodyParser.urlencoded({ extended: false }));

app.use(adminRouter);
app.use(shopeRouter);

mongo
  .connect("mongodb://localhost/shop")
  .then((result) => {
    app.listen(3000, () => {
      console.log("running on port 3000");
    });
  })
  .catch((err) => console.log(err));
