const express = require('express')
const mongoose = require('mongoose')
const nunjucks = require('nunjucks')
// const bodyparser = require('body-parser')
const multer = require('multer')
const path = require('path')

const port = 2000;

const app = express();

// Upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const date = Date.now();
    cb(null, date + "-" + file.originalname);
    
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8 * 2048 * 2048,
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else
      cb(new Error("Le fichier doit être au format png, jpg, jpeg ou gif."));
  },
});


//Mongodb
mongoose.connect('mongodb://localhost:27017/cooking',{useNewUrlParser: true,
useUnifiedTopology: true});

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// fichier statique
app.use(upload.single('file'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static("public"));
app.use(express.static('files'));

//Routes models
require('./models/Recette');
require('./models/Type');

//Routes 
app.use('/', require('./routes/recettes'));
app.use('/types', require('./routes/types'));

//TEMPLATE

nunjucks.configure('views', { 
    autoescape: true, 
    express: app,

 })

 app.set("view engine", "html")

// Localhost

app.listen(port, () => {
  console.log(
    `Ecoute le port ${port}, lancé à : ${new Date().toLocaleString()}`
  );
});