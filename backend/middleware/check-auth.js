const jwt = require('jsonwebtoken');
const jwtkey = require('../keys/jwt-key');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY || jwtkey.JWT_KEY);
    req.userData = {id: decodedToken.userId}
    next();
  } catch (error) {
    res.status(401).json({message: "You're not authenticated"})
  }
}
