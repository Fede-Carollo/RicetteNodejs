const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtkey = require('../keys/jwt-key')


exports.login= (req, res, next) => {
    console.log("Welaaaaa");
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser = null;
    bcrypt.hash(password, 10)
    .then(hashedPassword => {
        User.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.status(401).json({message: "Autenticazione fallita"});
            }
            else
            {
                fetchedUser = user;
                bcrypt.compare(password, hashedPassword)
                .then(valid => {
                    if(!valid)
                    {
                        return res.status(401).json({message: "Autenticazione fallita"});
                    }
                    const token = jwt.sign({userId: fetchedUser._id }, jwtkey.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    });
        
                    res.status(200).json({
                        token: token,
                        expiresIn: 3600,
                        tokenId: fetchedUser._id
                    })
                })
            }
            
        })
        
    })
    .catch(err => {
        res.status(500).json({message: "Errore nella creazione dell'utente"});
    })
    
}

exports.signup = (req, res, next) => {

}