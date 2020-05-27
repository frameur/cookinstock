const express = require('express')
    , mongoose = require('mongoose')
    , nunjucks = require('nunjucks')
    , multer = require('multer')
    , path = require('path')
    , app = express()
    , port = 2000

//Mongodb
const db = require('./config/keys.js').MongoURI
mongoose
   .connect(db,{useNewUrlParser: true,useUnifiedTopology: true})
   .then (() => console.log('connections  mongodb cloud')) 
   .catch (err => console.log(err))




//middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))


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
      file.mimetype === "image/gif"  ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else
      cb(new Error("Le fichier doit être au format png, jpg, jpeg ou gif."));
  },
});

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

app.listen(port,process.env.PORT,process.env.IP, () => {
  console.log(
    `Ecoute le port ${port}, lancé à : ${new Date().toLocaleString()}`
  );
});