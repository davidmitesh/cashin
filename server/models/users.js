const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');

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

var newUser=mongoose.model('newUser',userSchema);

module.exports={newUser}
