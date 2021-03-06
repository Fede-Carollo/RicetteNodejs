const express = require('express');
const router = express.Router();
const RicetteController = require('../controller/ricette');
const checkAuth = require('../middleware/check-auth');

//router.get("/:id", AuthController.confirmMail)

router.get("/categorie", RicetteController.GetAllCategorie);

module.exports = router
