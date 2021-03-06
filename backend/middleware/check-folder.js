const fs = require('fs');
const path = require('path');
const ROOT = "./backend/uploads";

module.exports = (req,res, next) => {
    const userpath = path.join(ROOT,req.userData.id);
    if(!fs.existsSync(userpath)) 
      fs.mkdirSync(userpath)
    const recipe = req.headers.recipename;
    const recipePath = path.join(userpath,recipe);
    if(fs.existsSync(recipePath))
        res.status(401).json({message: 'recipe already exists'})
    else
    {
        fs.mkdirSync(recipePath);
        next();
    }
    
}