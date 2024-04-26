const mongoose = require('mongoose')

const UserSchema  = mongoose.Schema({
    name:{type:String, required:true,unique:true},
    user_name:{type:String, required:true},
    password:{type:String,required:true},
    balance:{type:Number,default:100}
})

//Note from homework page: This will allow you to retain virtual fields when you convert a document to a User object.
UserSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User',UserSchema,'users')

module.exports = User
