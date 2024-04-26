//NEW CODE ON LINE 72
const express = require('express')
const Note = require('../models/note.js')
const User = require('../models/user.js')
const Product = require('../models/product.js')

const router = express.Router()

/*old unused code
router.get('/user',(req,res)=>{
    User.find({}).populate('notes').exec((error,result)=>{
        if(error)
            res.send(error)
        else{
            //res.send(result)

            const userArr  = result.map(u=>{
                return {_id:u._id,name:u.name,email:u.email,noteCount:u.notes.length}
            })
            
            res.send(userArr)
        }
    })
})

router.post('/user',(req,res)=>{
    const u1 = new User(req.body)
    u1.save((error,response)=>{
        if(error)
            res.send(error)
        else
            res.send(response)

    })

})

router.get('/user/:id',(req,res)=>{
    User.findById(req.params.id).populate('notes').exec((error,response)=>{
        if(error)
        res.send(error)
    else
        res.send(response)
    })
})

router.delete('/user/:id',(req,res)=>{
    Note.deleteMany({author:req.params.id},(error,result)=>{
       if(error)
            res.send(error)
        else{
            User.findByIdAndDelete(req.params.id,(error,result)=>{
                if(error)
                    res.send(error)
                else{
                    if(result == null)
                        res.send({message:"User not found.."})
                    else
                        res.send(result)
                }
            })
        }
    })
})
*/






//New Code \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/  \/ 
//HW5
//CS 355 01 W24
//Made by Andrew Trudell

//allows us to encrypt passwords
const bcrypt = require('bcrypt')

//allows us to create a session to save variables across different pages
const session = require('express-session')
const MongoStore = require('connect-mongo')

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

//adds a new user to the database
router.post('/users/register',async (req,res)=>{
    //this is pretty much the same as the /user post
    //the req.body is an object that contains the correct fields to set up the user so it can be put in as the
    //parameter in order to create the new user. if there is no balance given the user schema is set up so the default balance is 100
    const u1 = new User(req.body)
    
    //encrypts the password
    u1.password = await bcrypt.hash(u1.password,8);

    //this object is what will be displayed when this route is called
    const displayFriendlyUser = {Name:u1.name,Username:u1.user_name,Balance:u1.balance}

    const result = u1.save()
    .then(answer => {res.send(displayFriendlyUser)})
    .catch(error => {res.send({Message:"User already exists"})})

})

//logs in a user
router.post('/users/login',async (req,res)=>{
    
    //gets user with the given username
    const u = await User.findOne({user_name:req.body.user_name})

    //if u is null that means there wasn't a user with the given username and thus throws an error
    if(u == null){

        res.send({message: "Error logging in. Incorrect username/password"})

    }
    //checks if the given password is the same as the user's password if not it throws an error
    else if(!(await bcrypt.compare(req.body.password,u.password))){

        res.send({message: "Error logging in. Incorrect username/password"})

    }
    else{

        //saves the user id to be accessed accross the session
        session.user_id = u._id
        res.send({message: "Successfully logged in. Welcome " + u.name})

    }

})

//this displays user information
router.get('/users/me',authenticateUser,async(req,res)=>{

    //gets all the items owned by the user
    const uItems = await Product.find({owner:req.user._id})

    //creates an object to hold the user info and products 
    const u = {

        name:req.user.name,
        user_name:req.user.user_name,
        id:req.user._id,
        balance:req.user.balance,
        items:uItems

    }

    //sends the object to be viewed
    res.send((u))

})

//this allows the user to logout
router.post('/users/logout',authenticateUser,async(req,res)=>{

    //gets the user's name
    const u = await User.findById(session.user_id)
    const uName = u.name
    
    //removes all cookies
    session.user_id = undefined

    //sends the object to be viewed
    res.send({Message:"You are succesfully logged out " + uName})

})

//deletes the user and all products they own
router.delete('/users/me',authenticateUser,async(req,res)=>{

    //deletes all the products that have the user as the owner
    await Product.deleteMany({owner:session.user_id})

    //finds and deletes the user
    const deletedUser = await User.findByIdAndDelete(session.user_id)

    //if the user never existed they are let know
    if(deletedUser == null)
        res.send({message:"User not found.."})
    //otherwise the user is informed they have been deleted and all cookies are deleted
    else{
        session.user_id = undefined
        res.send({Message:"User has been deleted"})
    }
    
})

//displays all the users and their products
router.get('/summary',async(req,res)=>{

    //gets every user from the database and puts them in the users array
    const users = await User.find({})

    //this array will hold all the users with their items
    let uList = []

    //loops through all the users
    for(let u of users){

        //finds every product with owner pointing to the current user in the loop
        const pList = await Product.find({owner:u._id})

        //creates an object that will hold the user data and their products
        const ui = {

            balance:u.balance,
            _id:u._id,
            name:u.name,
            user_name:u.user_name,
            password:u.password,
            __v:u.__v,
            items:pList

        }

        //adds the user to the array
        uList.push(ui)

    }

    //sends list of users with their items
    res.send(uList)

})

//allows the other files to access the routers here
module.exports = router