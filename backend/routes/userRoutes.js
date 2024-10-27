// visioniyam/backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const authController = require("./../controllers/authController");

// User signup and login routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Update the create route to handle multiple images
router.post('/create', authController.upload.single('images'), authController.createPerson);
router.post('/create2', authController.upload.single('images'), authController.createPerson2);

router.post('/buy', authController.buy);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/makerequest', authController.makerequest);
router.post('/validation', authController.validation);

module.exports = router;
