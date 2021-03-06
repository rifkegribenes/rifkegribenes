const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const middleware = [
  helmet(),
  morgan("tiny"),
  cors(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
];

module.exports = middleware;
