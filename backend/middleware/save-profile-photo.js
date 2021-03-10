const multer = require("multer");
const path = require("path");
const ROOT = "./backend/uploads/users/";
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userpath = path.join(ROOT,req.userData.id);
    if(!fs.existsSync(userpath))
      fs.mkdirSync(userpath);
    console.log(userpath);
      cb(null, userpath);
      
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
module.exports = multer({storage: storage}).single("profilephoto");
