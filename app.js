const express = require('express')
const fs= require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Note = require('./models/note.js')
const User = require('./models/user.js')
//allows us to use env variables
const env = require('dotenv').config()

//HW5
//CS 355 01 W24
//Made by Andrew Trudell
//these get the paths to the js files to perform the code in them
const userRouter = require('./routers/user.js')
const noteRouter = require('./routers/note.js')
const productRouter = require('./routers/product.js')


const app = express()

app.listen(process.env.PORT)

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
//alows use of the other routes
app.use(userRouter)
app.use(noteRouter)
app.use(productRouter)

const url = process.env.URL
mongoose.connect(url,(err)=>{
    if(err)
        console.log(err)
    else
        console.log("Successfully connected to DB..")
})

app.get('/resetUsers',(req,res)=>{
    const users = [
        {name:"John",email:"john@john.com"},
        {name:"Peter",email:"peter@gmail.com"},
        {name:"Jane",email:"jane@yahoo.com"},
        
    ]

    User.create(users,(error,result)=>{
        res.send(result)
    })
})

app.get('/resetNotes',(req,res)=>{

    User.find({},(error,result)=>{
        const notes = [
            {title:"note1",description:"Mow the lawn",author:result[0]._id},
            {title:"note2",description:"Do the dishes",author:result[1]._id},
            {title:"note3",description:"Finish Homework",author:result[2]._id},
            
        ]
        Note.create(notes,(error,result)=>{
            res.send(result)
        })
    })

    
})

// app.get('/',(req,res)=>{
    
//     notes_test = [
//         {title:"note1",description:"Mow the lawn"},
//         {title:"note2",description:"Do the dishes"},
//         {title:"note3",description:"Watch the game."}
        
//     ]
//     Note.create(notes_test,(error,response)=>{
//         if(error)
//             res.send(error)
//         else
//             res.send(response)
//     })

//    //res.render("index")
    
// })


// app.get('/notes',(req,res)=>{
//     Note.find({},(error,response)=>{
//         if(error)
//             res.send(error)
//         else{
//             /*
//             const summary =[]
//             for(let r of response){
//                 summary.push({_id:r._id,title:r.title})
//             }
//             */
//            const summary = response.map(r=>{return {_id:r._id,title:r.title} } )
//             res.send(summary)
//         }
//     })


// })
// app.get('/notes/search',(req,res)=>{
//     const searchTerm =req.query.q
//     console.log(searchTerm)
//     Note.find({
//         $or:[
//         {description:{$regex:  searchTerm, $options:"i"}},
//         {title:{$regex:  searchTerm, $options:"i"}}
//         ]
    
//     },(error,response)=>{
//         if(error)
//             res.send(error)
//         else
//             res.send(response)
//     })    
// })

// app.get('/notes/:id',(req,res)=>{
//     Note.findById(req.params.id,(error,response)=>{
//         if(error)
//             res.send(error)
//         else{
//             if(response!=null)
//                 res.send(response)
//             else
//                 res.send({error:"Note not found.."})
//         }
//     })
// })



// app.patch('/notes',(req,res)=>{
//     const title = req.body.title
//     const newDescription = req.body.description
//     Note.updateOne({title:title},{description:newDescription},(error,response)=>{
//         if(error)
//         res.send(error)
//     else
//         res.send(response)
//     })
// })


// app.delete('/notes',(req,res)=>{
//     const title = req.body.title
    
//     Note.deleteOne({title:title},(error,response)=>{
//         if(error)
//         res.send(error)
//     else
//         res.send(response)
//     })
// })
    