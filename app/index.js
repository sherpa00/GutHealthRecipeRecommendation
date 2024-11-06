const express = require("express");
const chatRouter = require("./routes/chat.routes.js");

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
app.use("/api", chatRouter);

module.exports = app;
