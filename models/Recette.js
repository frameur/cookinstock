const mongoose = require('mongoose')

const recetteSchema = new mongoose.Schema({
    name: String,
    nbpersonne: String,
    description: [{}],
    timing: [{}],
    préparation: String,
    cuisson: String,
    repos: String,
    picture: String,
    types:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }]

});

const Recette = mongoose.model('Recette', recetteSchema);

module.exports = Recette;