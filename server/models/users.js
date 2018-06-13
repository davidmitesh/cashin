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
        type:Number,
        default: 0
      },
      pledge:{
        type: Boolean,
        default: false
      },
      count:{
        type: Number
      }
});


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
