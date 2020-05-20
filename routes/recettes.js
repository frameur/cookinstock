const router = require('express').Router()
    , Recette = require('./../models/Recette')
    , Type = require('./../models/Type')

//Page accueil 
router.get('/', (req, res) => {
    Recette.find({}).populate('types').then(recettes => {
        res.render('recettes/index.html', {recettes: recettes});
    });
});
//ajouter une recette
router.get('/new', (req, res) => {
    Type.find({}).then(types =>{
    let recette = new Recette();
    res.render('recettes/add.html', {recette:recette, types:types, endpoint: '/'});
})
});
router.get('/list/:id', (req, res) => {
    Type.findOne({}).then(description =>{
    Recette.findById(req.params.id).then(recette => {
        res.render('recettes/listecourse.html', {recette:recette, description:description});
        });
    
    })
    
});

//Editer une recette
router.get('/add/:id', (req, res) => {
    Type.find({}).then(types =>{
    Recette.findById(req.params.id).then(recette => {
        res.render('recettes/add.html', {recette:recette, types:types, endpoint: '/' + recette._id.toString()});
        });
    
    })
    
});

//Retirer une recettes
router.get('/delete/:id',(req, res) =>{
    Recette.findByIdAndRemove({_id: req.params.id}).then(() =>{
        res.redirect('/');
    })
});

//Afficher fiche recette
router.get('/:id', (req, res) => {
    Recette.findById(req.params.id).populate('types').then(recette => {
            res.render('recettes/detail.html', {
                recette: recette
            });
        },
        err => res.status(500).send(err));

});

// Ajouter recettes et image
router.post('/:id?', (req, res) =>{
    new Promise((resolve, reject) =>{
        if(req.params.id) {
            Recette.findById(req.params.id).then(resolve, reject);
        }
        else{
            resolve (new Recette());
        }
               
    })
    
    .then(recette =>{
       
        recette.name = req.body.name;
        recette.description = req.body.description;
        recette.timing = req.body.timing;
        recette.nbpersonne = req.body.nbpersonne;
        recette.préparation = req.body.préparation;
        recette.cuisson = req.body.cuisson;
        recette.repos = req.body.repos;
        recette.types = req.body.types;
        if(req.file) 
        recette.picture = req.file.filename;
        
        return recette.save();
        
        
        
    }).then(() =>{
        res.redirect('/');   
        
    })
});



module.exports = router;