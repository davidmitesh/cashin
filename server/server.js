const express=require('express');
const _=require('lodash');
var bodyParser=require('body-parser');
const moment=require('moment');

var {notification}=require('./models/notification.js');
var {mongoose}=require('./db/mongoose.js');
var {newUser}=require('./models/users.js');


var app=express();
app.use(bodyParser.json());// use of middleware
app.use(function(req,res,next){  // use of middleware
  next();
});
app.post('/newuser',(req,res)=>{  //new user request
  var body=_.pick(req.body,['email','password','pledge']);
  body.credits=0;
  body.pledgeNumber=0;
  body.count=0;
  var user=new newUser(body);

  user.saveRecord().then((result)=>{
    res.send(result);
  });
});
app.post('/currentupdate',(req,res)=>{//pledge request
  var body=_.pick(req.body,['email','password']);
  console.log(body);
  // var noti=new notification({text:"Your pledge request set on",notificationTime:moment().format('MMMM Do YYYY, h:mm:ss a'),email:body.email,password:body.password});
  // noti.saveRecord().then((result)=>{
  // });
newUser.updateMany({'pledge':true},{$inc:{'count':1}},(err,result)=>{
if (result){
  newUser.findOneAndUpdate({'count':3,'pledge':true},{$set:{'pledge':false,'count':0},$inc:{'pledgeNumber':1,'credits':70}},(err,result)=>{
    // console.log(result);
    if (result){
      notification.findOneAndUpdate({'email':result.email,'password':result.password},{$set:{'text':"your pledge is completed."}},(err,result)=>{
        notification.findOneAndUpdate({'email':body.email,'password':body.password},{$set:{text:"Your pledge request is set on",notificationTime:moment().format('MMMM Do YYYY, h:mm:ss a')}},(err,result)=>{
        console.log(result);
          newUser.update({'email':body.email,'password':body.password},{$set:{'pledge':true}},function(err,result){
            res.send("completed");
        });
      });

    });
  }else{
    notification.findOneAndUpdate({'email':body.email,'password':body.password},{$set:{text:"Your pledge request is set on",notificationTime:moment().format('MMMM Do YYYY, h:mm:ss a')}},(err,result)=>{
    console.log(result);
      newUser.update({'email':body.email,'password':body.password},{$set:{'pledge':true}},function(err,result){
        res.send("completed");
    });
  });

  }
  });
}
});
  });

app.listen(3000,()=>{
  console.log("server is up");
});
