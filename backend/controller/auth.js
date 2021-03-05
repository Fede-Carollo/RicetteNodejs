const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtkey = require('../keys/jwt-key')


exports.login= (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser = null;
    bcrypt.hash(password, 10)
    .then(hashedPassword => {
        User.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.status(401).json({message: "Email o password errati"});
            }
            else
            {
                fetchedUser = user;
                bcrypt.compare(password, hashedPassword)
                .then(valid => {
                    if(!valid)
                    {
                        return res.status(401).json({message: "Email o password errati"});
                    }
                    const token = createToken({userId: fetchedUser._id });
                    res.status(200).json({
                        token: token,
                        expiresIn: 3600,
                        tokenId: fetchedUser._id,
                        message: "user fetched successfully",
                        user: {
                            nome: fetchedUser.nome,
                            cognome: fetchedUser.cognome
                        }
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
    bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {
            const params = {
                email: req.body.email,
                password: hashedPassword,
                nome: req.body.nome,
                cognome: req.body.cognome
            };
            const user = new User(params);
            user.save()
            .then((specs) => {
                const userId = specs.id;
                const token = createToken({userId: userId});
                const user = {
                    nome: req.body.nome,
                    cognome: req.body.cognome
                }
                res.status(201).json({message: "User created successfully", token: token, expiresIn: 3600, tokenId: userId, user: user});
            })
            .catch(err => {
                if(err.message.indexOf("unique") != -1) //violazione vincolo unique su mail
                {
                    res.status(401).json({message: "L'email inserita è già registrata"})
                    return;
                }
                res.status(500).json({message: "Errore nella creazione dell'utente"});
            })
        })
        .catch(err => {
            res.status(500).json({message: "Errore nella creazione dell'utente"});
        })
}

exports.checkToken = (req, res, next) => {
    //TODO: caricare utente
    User.findOne({_id: req.userData.id})
    .then((user) => {
        const token = createToken({userId: req.userData.id});
        res.status(200).json({
            token: token,
            message: "token verificato",
            expiresIn: 3600,
            tokenId: user._id,
            user: {
                nome: user.nome,
                cognome: user.cognome
            }
        });
    })
    .catch(err => {
        console.error(err);
    })
    
}

function createToken(params, expires = "1h") {
    const token = jwt.sign(params, jwtkey.JWT_KEY, 
    {
        expiresIn: expires
    });
    return token;
}