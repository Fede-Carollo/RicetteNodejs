const User = require('../models/user');
const Recipe = require('../models/ricetta')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtkey = require('../keys/jwt-key')
const mailer = require('../modules/mailer-module')
const Pending = require('../models/pending');
const fs = require('fs');


exports.login = (req, res, next) => {
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
                cognome: req.body.cognome,
                citazione: req.body.citazione
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

exports.saveProfilePhoto = (req, res, next) => {
    console.log("Qui ci sono arrivato");
    const filepath = req.file.path.replace("backend\\uploads\\", "");
    User.findOne({_id: req.userData.id})
        .then((user) => {
            User.findByIdAndUpdate(req.userData.id, {profilePhoto: filepath})
                .then((specs) => {
                    console.log(specs)
                })
                .catch(err => {
                    console.log(err)
                })
        })
    
}

exports.checkToken = (req, res, next) => {
    User.findById(req.userData.id)
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
        res.status(500).json({message: "Errore nell'autenticazione utente"});
    })
    
}


exports.getUserProfile = (req, res, next) => {
    User.findOne({_id: req.params.id}, {password: 0})
        .then((user) => {
            res.status(200).json({message: "User fetched successfully", user: user});
        })
        .catch((err) => {
            res.status(500).json({message: "Qualcosa è andato storto"});
        })
}

exports.updateName = async function (req, res, next) {
    try 
    {
        await User.updateOne({_id: req.userData.id}, {
            $set: {"nome": req.body.nome, "cognome": req.body.cognome}
        })
        await Recipe.updateMany({creatorId: req.userData.id}, {$set: {creatorName: `${req.body.cognome} ${req.body.nome}`}})
        res.status(201).json({"message": "Updated successfully"});
    } catch (error) {
        res.status(500).json({"message": "Error updating"})
    }
    
}

exports.updateNameFile = async function (req, res, next) {
    try 
    {
        await User.updateOne({_id: req.userData.id}, {
            $set: {
                "nome": req.body.nome, 
                "cognome": req.body.cognome,
                "profilePhoto": req.file.path.replace("backend\\uploads\\", "")
            }
        })
        await Recipe.updateMany({creatorId: req.userData.id}, {$set: {creatorName: `${req.body.cognome} ${req.body.nome}`}})
        res.status(201).json({message: "User updated successfully"});
    }
    catch (error) 
    {
        res.status(500).json({message: "Errore nell'aggiornamento dell'utente"})
    }
}


exports.forgotPassword = async function (req, res, next) {
    const random = Math.floor(Math.random()*(99999 -10000 + 1)) + 10000;
    const pending = new Pending({
        email: req.body.email,
        code: random
    })
    try 
    {
        if(await User.findOne({email: req.body.email}))
        {
            console.log(__dirname)
            let html = fs.readFileSync(`${__dirname}\\..\\template\\forgotpassword.html`, {encoding: "utf8"});
            html = html.replace("${!codice!}", random);
            await pending.save();
            const mail = new mailer();
            res.status(200).json({message: "mail inviata"})
            /*mail.sendEmail(req.body.email, "Ripristino password", html)
                .then((info) => {
                    console.log("Fatto");
                    res.status(200).json({message: "mail inviata"})
                })
                .catch((error) => {
                    console.log("Non fatto");
                    res.status(500).json({message: "Si è verificato un errore"});
                })
                */
        }
        else {
            res.status(404).json({message: "La mail inserita non è registrata"})
        }
        
        
    }
    catch (error)
    {
        res.status(500).json({message: "Qualcosa è andato storto"});
    }
    
}

exports.checkCode = async function (req, res, next) {
    const email = req.body.email;
    const code = req.body.code;
    try
    {
        const pending = await Pending.find({email: email}).sort({_id: -1}).limit(1);
        if(pending[0].code == code)
        {
            res.status(200).json({message: "Code correct"});
            try
            {
                await Pending.deleteMany({email: email});
            }
            catch(error) {} //altrimenti finisce nel catch generale e tenta di inviare un codice 500
        }
        else
        {
            res.status(500).json({message: "Codice non valido"})
        }
    }
    catch (error) {
        res.status(500).json({message: "Qualcosa è andato storto"})
    }
}

exports.updatePassword = async function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    try
    {
        await User.updateOne({email: email}, {$set: {password: password}})
        res.status(201).json({message: "Profile updated successfully"});
    }
    catch (err)
    {
        res.status(500).json({message: "qualcosa è andato storto, riprova più tardi"});
    }
}


function createToken(params, expires = "1h") {
    const token = jwt.sign(params, jwtkey.JWT_KEY, 
    {
        expiresIn: expires
    });
    return token;
}