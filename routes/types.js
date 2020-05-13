const router = require('express').Router();
const Type = require('./../models/Type');


//Affichage catégories
router.get('/:type',(req, res) =>{
    Type.findOne({name: req.params.type}).populate('recettes').then(type =>{
        if(!type) return res.status(404).send('Catégories introuvable')
        res.render('categories/vutype.html',{
            type: type,
        recettes: type.recettes
        });
        
    });
});




module.exports = router;
