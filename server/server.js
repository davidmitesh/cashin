const express=require('express');
const _=require('lodash');
var bodyParser=require('body-parser');
const moment=require('moment');



var {notification}=require('./models/notification.js');
var {mongoose}=require('./db/mongoose.js');
var {newUser}=require('./models/users.js');
var {authenticate}=require('./middleware/authenticate');

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

  user.save().then((user)=>{});
//   return user.genAuthToken();
// }).then((token)=>{
//   res.header('x-auth',token).send(user);
// }).catch((e)=>{
//     res.status(400).send("user cannot be saved",e);
//   });
res.send();
});

app.get('/user/me',authenticate,(req,res)=>{
res.send(req.user);
});

app.post('/user/login',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  newUser.findByCredentials(body.email,body.password).then((user)=>{
    user.genAuthToken().then((token)=>{
      res.header('x-auth',token).send();
    })
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.delete('/user/tokendelete',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  },()=>{
    res.status(400).send();
  });
});
app.post('/currentupdate',(req,res)=>{//pledge request
  var body=_.pick(req.body,['email','password']);
  console.log(body);
   var d=new Date();
  newUser.findOneAndUpdate({'email':body.email},{$push:{'times':d.getTime()}},(err,result)=>
 {newUser.updateMany({'pledge':true,'count':{$lt:3}},{$inc:{'count':1}},(err,result)=>{
if (result){


  newUser.findOneAndUpdate({'email':body.email},{$set:{'pledge':true},$inc:{'owncount':1}},(err,result)=>{
    if (result){
        newUser.find({'count':3,'pledge':true},(err,result)=>{
        if(result.length!=0){
        console.log("objects with count 3 and pledge true are",result);

        var great=_.minBy(result, function(o) { return o.times[0] });
        // var great=_.maxBy(result, function(o) { return o.owncount });
       console.log("gretest object is",great);
       console.log("value of time",great.times[0]);
        newUser.findOneAndUpdate({email:great.email},{$inc:{'owncount':-1,'credits':70,'pledgeNumber':1},$pull:{'times':great.times[0]}},(err,result)=>{

        console.log("pledge completed object",result);
          if (result){
            newUser.findOneAndUpdate({'count':3,'owncount':0,'pledge':true},{$set:{'pledge':false,'count':0}},(err,result)=>{
             res.send();
            });
          }
          });
        }else {
          console.log("count 3 object not found");
          res.send();
        }
        });
      }
    });
  }
});});
});
//   newUser.findOneAndUpdate({'count':3,'pledge':true},{$set:{'pledge':false,'count':0},$inc:{'pledgeNumber':1,'credits':70}},(err,result)=>{
//     if (result){
//       notification.findOneAndUpdate({'email':result.email,'password':result.password},{$set:{'text':"your pledge is completed."}},(err,result)=>{
//         notification.findOneAndUpdate({'email':body.email,'password':body.password},{$set:{text:"Your pledge request is set on",notificationTime:moment().format('MMMM Do YYYY, h:mm:ss a')}},(err,result)=>{
//         console.log(result);
//           newUser.update({'email':body.email,'password':body.password},{$set:{'pledge':true}},function(err,result){
//             res.send("completed");
//         });
//       });
//     });
//   }else{
//     notification.findOneAndUpdate({'email':body.email,'password':body.password},{$set:{text:"Your pledge request is set on",notificationTime:moment().format('MMMM Do YYYY, h:mm:ss a')}},(err,result)=>{
//     console.log(result);
//       newUser.update({'email':body.email,'password':body.password},{$set:{'pledge':true}},function(err,result){
//         res.send("completed");
//     });
//   });
//   }
//   });
// }
// });
//   });

app.listen(3000,()=>{
  console.log("server is up");
});
