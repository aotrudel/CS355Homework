const { ObjectId } = require('mongoose')
const mongoose = require('mongoose')

const ProductSchema  = mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number,required:true},
    owner:{type:ObjectId, required:true}
})

const User = mongoose.model('Product',ProductSchema,'products')

module.exports = User
