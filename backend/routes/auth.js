const express = require('express');
const router = express.Router();
const AuthController = require('../controller/auth');
const checkAuth = require('../middleware/check-auth');
const refreshToken = require('../middleware/refreshToken');
const saveProfilePhoto = require('../middleware/save-profile-photo');


router.post("/login", AuthController.login)

router.post('/signup', 
        AuthController.signup,);

router.post("/checkToken", 
        checkAuth,
        refreshToken,
        AuthController.checkToken);

router.post("/saveProfilePhoto",
            checkAuth, 
            refreshToken,
            saveProfilePhoto,
            AuthController.saveProfilePhoto)

router.get("/user/:id", 
                AuthController.getUserProfile)

router.post("/updateName", 
                checkAuth,
                refreshToken,
                AuthController.updateName)

router.post("/updateNameFile", 
                checkAuth,
                refreshToken,
                saveProfilePhoto,
                AuthController.updateNameFile)
module.exports = router
