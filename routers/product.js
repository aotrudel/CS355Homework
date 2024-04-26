//HW5
//CS 355 01 W24
//Made by Andrew Trudell

const express = require('express')
const Note = require('../models/note.js')
const User = require('../models/user.js')
const Product = require('../models/product.js')

//alows us to create a seesion and store cookies
const session = require('express-session')

const router = express.Router()

//middlware function that makes sure the user is logged in
async function authenticateUser(req,res,next){
    //if user_id is undefined that means the user never logged in so a warning is sent
    if(!session.user_id){
        return res.send({Message:"User not authorized. You must be logged in to view this page."})
    }
    //if there is a user_id that means the user is logged in so the program can continue
    //the user object is attached to req for easy access for later
    const user = await User.findById(session.user_id)
    req.user = user
    next()
}

//creates a new product
router.post('/products',authenticateUser,async(req,res)=>{
    const seller = await User.findById(session.user_id)

    //creates a new product object with the info from the req.body and the id from the seller
    const item = new Product({name:req.body.name,price:req.body.price,owner:seller._id})

    //saves the product to the database
    const result = await item.save()

    //if there was an error the user is let know
    if(result == undefined){

        res.send({Message:"Couldn't save product"})

    }
    //otherwise the user is sent the response
    else{

        res.send(result)

    }
    
})

//displays all the products
router.get('/products',async(req,res)=>{
    
    //gets an array of all the products
    const allItems = await Product.find({})

    //sends an array of all the products
    res.send(allItems)
})

//allows the user to buy an item
router.post('/products/buy',authenticateUser,async(req,res)=>{

    //we get the objects for the buyer seller and the product
    const buyer = await User.findById(session.user_id)
    const item = await Product.findById(req.body.productID)
    const seller = await User.findById(item.owner)

    //if the buyer owns the item they cannot buy it
    if(buyer._id+"" == item.owner+""){

        res.send({Message: buyer.name + " already owns that item"})

    }
    //if they buyer doesn't have enough money for the item they cannot buy it
    else if(buyer.balance < item.price){

        res.send({Message: buyer.name + " does not have enough funds to purchase the item"})

    }
    else{

        //takes funds from buyer and gives them to seller and gives the item to the buyer
        buyer.balance = buyer.balance - item.price
        seller.balance = seller.balance + item.price
        item.owner = buyer._id

        //updates the database
        await buyer.save()
        await seller.save()
        await item.save()

        //sends the item as the result
        res.send({Message: "Transaction successful!"})

    }
    
})

//deletes the user with the id in the url
router.delete('/products/:id',authenticateUser,async(req,res)=>{

    //gets the item that we want to delete
    const result = await Product.findById(req.params.id)

    //sends an error if item is not found
    if(result == null){

        res.send({Message:"Item not found"})

    }
    else{
        //makes sure that the person trying to delete the object is the owner
        if(!(result.owner+"" == session.user_id)){

            res.send({Message:"You may only delete items you own"})
            
        }
        else{

            //if there was an error the user is let know
            if(result == undefined){

                res.send({Message:"Couldn't delete product"})

            }
            //otherwise the user is sent the response and the item is deleted
            else{

                //deletes the item
                await Product.findByIdAndDelete(req.params.id)
                res.send(result)

            }

        }
    }
})

//allows the other files to access the routers here
module.exports = router