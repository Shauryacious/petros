// visioniyam/backend/server.js
const dotenv = require("dotenv");
const path = require('path');

const app = require("./app");
const connectDB = require('./configuration/connectDB');

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    console.log(`App is running on port ${port} in '${process.env.NODE_ENV}' mode`);
});
connectDB();

app.get("/", (req, res) => {
    res.send("Radhe Radhe!");
});