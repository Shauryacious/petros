// visioniyam/backend/configuration/connectDB.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const app = require("./../app");

dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

const connectToDB = async () => {
    const conn = await mongoose.connect(db, {
        useNewUrlParser: true,
    });

    console.log(`server connected successfully to mongoDB - ${conn.connection.host}`);
};

module.exports = connectToDB;