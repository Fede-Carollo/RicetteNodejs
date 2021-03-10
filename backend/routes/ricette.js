const express = require('express');
const router = express.Router();
const RicetteController = require('../controller/ricette');
const checkAuth = require('../middleware/check-auth');
const checkFolder = require('../middleware/check-folder-ricette');
const saveFiles = require('../middleware/save-files');

//router.get("/:id", AuthController.confirmMail)

router.get("/categorie", RicetteController.GetAllCategorie);

router.post("", 
        checkAuth,
        checkFolder,
        saveFiles,
        RicetteController.PostRicetta)

router.get("", RicetteController.GetAllRecipes)

router.get("/:id", RicetteController.GetRecipe)
module.exports = router
