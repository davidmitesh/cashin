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
      },
      tokens:[{
        access:{
          type:String,
          required:true
        },
        token:{
          type:String,
          required:true
        }
      }]
});


userSchema.methods.toJSON=function(){   //changing the functionality or overriding the functionality of inbuilt
  //toJSON method that gets called when res.send is called.
var userObject=this.toObject();
return _.pick(userObject,['_id','email']);
}

userSchema.methods.genAuthToken=function(){
  var access='auth';
  var token=jwt.sign({_id:this._id.toHexString(),access},'abc123').toString();
  this.tokens.push({access,token});// using ES6 syntax as opposed to access:access and token:token
  return this.save().then(()=>{
    return token
  });
};

var newUser=mongoose.model('newUser',userSchema);

module.exports={newUser}
