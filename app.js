var express=require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlConverter=require('./modules/url-converter');
process.on('uncaughtException', console.error);
require('dotenv').config({
  silent: true
});;


var app = express();

// Path to our public directory

var pub = __dirname;
app.use(express.static(pub));


// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');


app.use(bodyParser.urlencoded({ extended: true }))

/* GET home page. */
app.get('/',function(req,res,next){

    res.render('index', { title: 'Express' });

});


app.get('/:id', function(req, res, next) {

   var id=req.params.id;
     urlConverter.redirectToShortURL(id,res, next);

});


app.get('/new/*', function(req, res, next) {

  var url = req.url.replace('/new/','');

  urlConverter.shortenURL(url).then(obj=> {return res.json(obj);}).catch(next);

});



app.listen(process.env.PORT || 5000);