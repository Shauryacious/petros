const express = require('express');

const router = express.Router();
//! CONTROLLERS
const viewsController = require('./../controllers/viewController');

router.get("/signup", viewsController.getSignupForm);

module.exports = router;