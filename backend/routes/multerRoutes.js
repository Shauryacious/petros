const express = require("express");
const multerController = require("./../controllers/multerController");
const multer = require("multer");

const router = express.Router();

const upload = multer({
    dest: 'uploads/'
});

router.post('/create', upload.single('image'), multerController.detectObjects);

module.exports = router;
