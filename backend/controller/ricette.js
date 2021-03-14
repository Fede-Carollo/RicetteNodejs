const Categoria = require('../models/categorie');
const Ricetta = require('../models/ricetta');
const User = require('../models/user');


exports.GetAllCategorie = (req, res, next) => {
    Categoria.find()
        .then((categories) => {
            const nomi = categories.map((cat) => {
                return cat.nome;
            })
            res.status(200).json({message: "Categories fetched successfully", categorie: nomi});
        } )
}

exports.PostRicetta = (req, res, next) => {
    User.findById(req.userData.id, {cognome: 1, nome: 1, _id: 0})
    .then(user => {
        const creatorName = user.cognome + " " + user.nome;
        const ricetta = {
            creatorId: req.userData.id,
            creatorName: creatorName,
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            difficulty: req.body.difficulty,
            ingredienti: typeof(req.body.ingredienti) == 'object'? [...req.body.ingredienti]: [req.body.ingredienti],
            timeNeeded: req.body.timeNeeded,
            headerPhoto: req.files.headerphoto[0].path.replace("backend\\uploads\\", ""),
            steps: []
        }
    
        for(let i = 0; i < +req.body.stepNumber; i++) {
            const bodyStep = req.body["step" + i];
            const stepFiles = req.files.imgs.filter(file => {
                const step =  parseInt(file.originalname.substr(5)).toString();
                return step == i;
            })
    
            const filePaths =  stepFiles.map(file => {
                return file.path.replace("backend\\uploads\\","");
            })
            const step = {
                title: bodyStep[0],
                description: bodyStep[1],
                imgs: [...filePaths]
            }
            ricetta.steps.push(step);
        }
    
        const document = new Ricetta(ricetta);
    
        document.save()
            .then((specs) => {
                console.log(specs);
                res.status(201).json({message: "recipe created successfully"})
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({message: "Errore nella creazione della ricetta"});
            })
    })
    .catch((err) => {
        res.status(500).json({message: "Errore nella creazione della ricetta"});
    })

    

}

exports.GetAllRecipes = (req, res, next) => {
    Ricetta.find({}).sort({createdAt: -1})
        .then((ricette) => {
            res.status(200).json({message: "recipes fetched successfully", ricette: ricette});
        })
        .catch((err) => {
            res.status(500).json({message: "Impossibile caricare le ricette al momento"});
        })
}

exports.GetRecipe = (req, res, next) => {
    const id = req.params.id;
    Ricetta.findOne({_id: id})
        .then((recipe) => {
            if(recipe)
            {
                res.status(200).json({message: "Recipe fetched successfully", recipe: recipe});
            }
            else
            {
                res.status(404).json({message: "Ricetta non trovata"});
            }
        })
        .catch(err => {
            res.status(404).json({message: "Ricetta non trovata"});
        })
}

exports.GetUserRecipes = (req, res, next) => {
    const id = req.params.id;
    Ricetta.find({creatorId: id}).sort({createdAt: -1})
        .then((recipes) => {
            res.status(200).json({recipes: recipes, message: "Recipes fetched successfully"});
        })
        .catch(err => {
            res.status(500).json({message: "Qualcosa è andato storto"});
        })
}