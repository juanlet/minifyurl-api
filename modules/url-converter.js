var mongo = require('mongodb');
var assert = require('assert');

require('dotenv').config({
  silent: true
});;


module.exports = {
  validateURL:function(url){
    
    var regex=/^((https?):\/\/)?([w|W]{3}\.)+[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
    return regex.test(url);
    
},
  genRandId:function(){
     var num = Math.floor(100000 + Math.random() * 900000);
     
    return num.toString().substring(0, 4);
  },
    shortenURL: function(url) {
    

  if(this.validateURL(url)){

    var randId=this.genRandId();
    var shortenedUrl="https://urlshortenertool.herokuapp.com/"+randId;
    
      var newUrl ={
        originalUrl: url,
        short_url: shortenedUrl,
        urlNumber:randId
      }
          //insert in mongo and puth the id of mongo after the url of the second parameter
    var responseObject= {original_url: url};
    
    
   return mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/urls')
     
     .then(function(db,err){
       if (err) {
       throw new Error('Database failed to connect!');  //
      } else {
           
        return   db.collection('urls').insertOne(newUrl)
           .then((result,err)=>{
               if (err) {
          
            throw new Error('Insert Failed!');
          }
          console.log('Item inserte with id: '+newUrl._id);
          db.close();
          responseObject.short_url=shortenedUrl;
          return responseObject;
     
           })
           
           ;
        
      }
       
     })
 
      .then(resObj=>{
             return resObj;
      });
    
  }
  
  },
  redirectToShortURL:function(id,res){

   // check mongo database for the id, get the url  related to that id and redirect the user to that url   
      mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/urls',function(err,db){
        assert.equal(null,err);
        db.collection('urls').findOne({ urlNumber : id }, (err, document)=> {
           console.log("Redirecting user to:"+ document.originalUrl);
           res.redirect(document.originalUrl);
        });
    
      }); 
  }
};