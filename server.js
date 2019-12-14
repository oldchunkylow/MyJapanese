// Dependencies
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const japaneseController = require("./controllers/japanese.js");
const dictionaryController = require("./controllers/dictionary.js");
const usersController = require("./controllers/users.js");
const sessionsController = require("./controllers/sessions.js");
const savedWordsController = require("./controllers/savedwords.js");
const jishoApi = require("unofficial-jisho-api");
const jisho = new jishoApi();

// Environment Variables (getting ready for Heroku)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Let's get things done on port", PORT);
});

// Middleware
app.use(express.json()); //use .json(), not .urlencoded()
app.use(express.static(`public`));
app.use("/japanese", japaneseController);
app.use("/dictionary", dictionaryController);
app.use("/users", usersController);
app.use("/savedwords", savedWordsController);
app.use("/sessions", sessionsController);
app.use(express.static(path.join(__dirname, "build")));

const db = mongoose.connection;

// Environment Variables
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/project";

// Connect to Mongo
mongoose.connect(
  mongoURI, {
    useNewUrlParser: true
  },
  () => console.log("MongoDB connection established:", mongoURI)
);

// Error / Disconnection
db.on("error", err => console.log(err.message + " is Mongod not running?"));
db.on("disconnected", () => console.log("mongo disconnected"));