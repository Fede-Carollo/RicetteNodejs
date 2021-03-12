const jwt = require('jsonwebtoken');
const jwtkey = require('../keys/jwt-key');

function createToken(params, expires = "1h") {
    const token = jwt.sign(params, jwtkey.JWT_KEY, 
    {
        expiresIn: expires
    });
    return token;
}

module.exports = (req, res, next) => {
    if(req.userData)
    {
        const token = createToken({userId: req.userData.id});
        res.set('token-expires-in', 3600);
        res.set('token',`Bearer ${token}`);
    }
    next();
}