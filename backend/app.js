// visiniyam/backend/app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan"); // Import morgan

const userRouter = require("./routes/userRoutes");
const viewRouter = require("./routes/viewRoutes");
const multerRouter = require("./routes/multerRoutes");

const app = express();

const corsOption = {
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true
};

app.use(cors(corsOption));
app.use(express.json());
app.use(morgan('dev')); // Use morgan to log requests

app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/multer", multerRouter);

module.exports = app;
