const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');

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
      owncount:{
        type:Number,
        default:1
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
userSchema.pre('save',function(next){  //this middleware runs prior to every save function of userSchema instance.
  if (this.isModified('password')){//only hashes the password if the password is modified ,for other operation
    //no hashing is done to avoid multiple hashing of passwords
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(this.password,salt,(err,hash)=>{
        this.password=hash;
        next();
      });
    });
  }else{
    next();
  }
});

userSchema.methods.toJSON=function(){   //changing the functionality or overriding the functionality of inbuilt
  //toJSON method that gets called when res.send is called.
var userObject=this.toObject();
return _.pick(userObject,['_id','email']);
}

userSchema.statics.findByCredentials=function(email,password){

  return this.findOne({email}).then((user)=>{
    if (!user){
      return Promise.reject();
    }
    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,result)=>{
        if (result){
          resolve(user);
        }else{
          reject();
        }
      });
    });
  });
}
userSchema.methods.genAuthToken=function(){
  var access='auth';
  var token=jwt.sign({_id:this._id.toHexString(),access},'abc123').toString();
  this.tokens.push({access,token});// using ES6 syntax as opposed to access:access and token:token
  return this.save().then(()=>{
    return token
  });
};

userSchema.methods.removeToken=function(token){
  return this.update({
    $pull:{
      tokens:{token}
    }
  });
};
userSchema.statics.findByToken=function(token){
  var decoded;
  try{
    decoded=jwt.verify(token,'abc123');
  }catch(e){
     return Promise.reject();
  }
  return this.findOne({
    _id:decoded._id,
    'tokens.token':token,//if there is dot in between, you need to wrap in quotes
    'tokens.access':'auth'
  });
};
var newUser=mongoose.model('newUser',userSchema);

module.exports={newUser}
