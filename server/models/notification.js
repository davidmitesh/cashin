const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');

var notification=new mongoose.Schema({
  email:{
    type: String
  },
  password:{
    type:String
  },
text:{
  type:String
},
notificationTime:{
   type: String
},
seenStatus:{
  type:Boolean,
  default:false
}
});

notification.methods.saveRecord=function(){
  var user=this;
return   user.save().then((doc)=>{
    return doc;
  },(err)=>{
    return err;
  });
};
var notification=mongoose.model('notification',notification);
module.exports={notification};
