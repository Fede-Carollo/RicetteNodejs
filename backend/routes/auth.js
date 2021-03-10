const express = require('express');
const router = express.Router();
//const VerifyGoogleToken = require('../middleware/check-google-token');
const AuthController = require('../controller/auth');
const checkAuth = require('../middleware/check-auth');
const saveProfilePhoto = require('../middleware/save-profile-photo');

//router.get("/:id", AuthController.confirmMail)

router.post("/login", AuthController.login)

router.post('/signup', 
        AuthController.signup,);

router.post("/checkToken", 
        checkAuth,
        AuthController.checkToken);

router.post("/saveProfilePhoto",
            checkAuth, 
            saveProfilePhoto,
            AuthController.saveProfilePhoto)

        
/*router.post("/googleAccess",
  VerifyGoogleToken,
  AuthController.googleAccess)*/

/*router.post("/checkLogged",
  checkAuth,
  AuthController.checkLogged)
*/

module.exports = router
