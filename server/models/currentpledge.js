const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');

var {newUser}=require('./users.js');

var userSchema=new mongoose.Schema({
  email:{
    type: String,
      trim: true,
    required: true,
    unique: true,
      minlength:1,
      validate:{
        validator:validator.isEmail,
        message:'{VALUE}is not an email'
      }},
      password:{
        type:String,

        required:true,
        minlength:6
      },
      credits:{
        type: Number
      },
      pledgeNumber:{
        type:Number
      }
      // tokens:[{
      //   access:{
      //     type:String,
      //     required: true
      //   },
      //   token:{
      //     type:String,
      //     required:true
      //   }
      // }]
});

// userSchema.methods.generateAuthToken=function(){
//   var access="auth";
//   var currUser=this;
//   var token=jwt.sign({_id:currUser._id.toHexString(),access},'abc1').toString();
//
//    currUser.tokens.push({access,token});
//    return currUser.save().then(()=>{
//      return token;
//    });
// };
userSchema.methods.saveRecord=function(){
  var user=this;
return   user.save().then((doc)=>{
    return doc;
  },(err)=>{
    return err;
  });
};

userSchema.methods.updateRecord=function(){
  var curUser=this;
return   currUser.findOne({email:curUser.email,password:curUser.password},function(err,docs){
    if (docs){
      console.log(docs);
       return docs.update({$inc:{credits:100,pledgeNumber:1}},()=>{

       });
      //    ,()=>{
      //
      //     // currUser.find({email:docs.email,password:docs.password},function(err,res){
      //     //   return new Promise(function(resolve,reject){
      //     //    console.log(res);
      //     //     resolve(res);
      //     //   });
      //     // });
      //
      //
      //
      // });
    };
  });
};
  // console.log(docs);



var currUser=mongoose.model('currUser',userSchema);

module.exports={currUser}
