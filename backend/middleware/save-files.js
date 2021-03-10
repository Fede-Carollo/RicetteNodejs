const multer = require("multer");
const path = require("path");
const ROOT = "./backend/uploads/recipes/";
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userpath = path.join(ROOT,req.userData.id);
    const recipe = req.headers.recipename;
    const recipePath = path.join(userpath,recipe);
    const step = "step" + parseInt(file.originalname.substr(5)).toString();
    const final = path.join(recipePath, step);
    if(!fs.existsSync(final))
      fs.mkdirSync(final);
    console.log(final);
      cb(null, final);
      
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.parse(file.originalname).name
    .toLowerCase()
    .split(" ")
    .join("-")
    cb(null, name + "-" + Date.now() + ext);
  }
})
module.exports = multer({storage: storage}).array("imgs");
