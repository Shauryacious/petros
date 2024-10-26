// visioniyam/backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const authController = require("./../controllers/authController");

// User signup and login routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Update the create route to handle multiple images upload
router.post('/create', authController.upload.array('images', 1), authController.createPerson);
router.post('/buy', authController.buy);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.post('/makerequest', authController.makerequest);
router.post('/validation', authController.validation);

module.exports = router;
