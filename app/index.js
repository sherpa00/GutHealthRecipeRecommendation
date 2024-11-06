const express = require("express");
const router = require("./routes/index.js");

// application instance
const app = express();

// configured express for json and body parser
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// routes usage
app.use("/api", router);

module.exports = app;
