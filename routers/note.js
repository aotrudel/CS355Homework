//unused Code
const express = require('express')
const Note = require('../models/note.js')
const User = require('../models/user.js')


const router = express.Router()

router.get('/note',(req,res)=>{
    Note.find({},(error,result)=>{
        if(error)
            res.send(error)
        else
            res.send(result)
    })
})

router.get('/note/:id',(req,res)=>{
    Note.findById(req.params.id,(error,result)=>{
        if(error)
            res.send(error)
        else
            res.send(result)
    })
})





router.post('/note',(req,res)=>{
    const newNote = new Note(req.body)
    newNote.save((error,response)=>{
        if(error)
        res.send(error)
    else
        res.send(response)
    })

})

router.delete('/note',(req,res)=>{
    const titleToDelete = req.body.title

    Note.findOneAndDelete({title:titleToDelete},(error,result)=>{
        if(error)
            res.send(error)
        else{
            if(result == null)
                res.send({message:"Note not found.."})
            else
                res.send(result)
        }
    })
   
})

module.exports = router