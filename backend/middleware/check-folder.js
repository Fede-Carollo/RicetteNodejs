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
        res.status(401).json({message: 'Esiste già una ricetta con questo nome! Prova a cambiarlo'})
    else
    {
        fs.mkdirSync(recipePath);
        next();
    }
    
}