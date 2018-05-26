const express=require('express');
const _=require('lodash');
var bodyParser=require('body-parser');


var {mongoose}=require('./db/mongoose.js');
var {newUser}=require('./models/users.js');


var app=express();
app.use(bodyParser.json());

app.post('/newuser',(req,res)=>{
  var body=_.pick(req.body,['email','password','pledge']);
  body.credits=0;
  body.pledgeNumber=0;
  var user=new newUser(body);

  user.saveRecord().then((result)=>{
    res.send(result);
  });
});
app.post('/currentupdate',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  console.log(body);

  newUser.findOneAndUpdate({'pledge':true},{$set:{'pledge':false},$inc:{'pledgeNumber':1,'credits':70}},function(err,result){
if (result){
  newUser.update({'email':body.email,'password':body.password},{$set:{'pledge':true},$inc:{'credits':-50}},function(){
    res.send("completed");
  });
}

  });



  });

app.listen(3000,()=>{
  console.log("server is up");
});
