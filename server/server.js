const express=require('express');
const _=require('lodash');
var bodyParser=require('body-parser');


var {mongoose}=require('./db/mongoose.js');
var {currUser}=require('./models/currentpledge.js');
var {newUser}=require('./models/users.js');


var app=express();
app.use(bodyParser.json());

app.post('/newuser',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  body.credits=0;
  body.pledgeNumber=0;
  var user=new newUser(body);
  var curr=new currUser(body);

  curr.saveRecord().then(()=>{

  });
  user.saveRecord().then((result)=>{
    res.send(result);

  });

});
// app.post('/currentsave',(req,res)=>{
//   var body=_.pick(req.body,['email','password','credits']);
//   body.pledgeNumber=1;
//   var newPledge=new currUser(body);
//   newPledge.saveRecord().then((result)=>{
//     res.send(result);
//   });
// });
app.post('/currentupdate',(req,res)=>{
  var body=_.pick(req.body,['email','password'])
  var newPledge=new currUser(body);
  newPledge.updateRecord().then(()=>{
    currUser.find({email:body.email,password:body.password},(err,docs)=>{
      console.log("from server.js 1st",docs);
      if (docs){
        newUser.findOneAndUpdate({email:docs[0].email,password:docs[0].password},{credits:docs[0].credits,pledgeNumber:docs[0].pledgeNumber},function(err,doc){
          if (doc){
            currUser.findOneAndDelete(docs,()=>{
              console.log("deleted");
            });
          }
      });


      };
    });

    // currUser.findOneAndRemove({email:docs.email},function(err,result){
    //   // console.log(result);
    // });
  });
  res.send("succesfully completed");
});


app.listen(3000,()=>{
  console.log("server is up");
});
