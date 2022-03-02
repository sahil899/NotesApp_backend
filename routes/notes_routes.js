const express = require("express");
const mongoose = require("mongoose");
const { update } = require("../models/notes_model");
const Note = require("../models/notes_model");
const router = express.Router();

router.get('/',(request,response,next)=>{

    Note.find().select(['_id','title','content','date','new_note']) // what all fields you want
    .exec()
    .then((notes)=>{
        let count = notes.length;
        if(count)
        {
            response.status(200).json({
                'message':"Notes retrieve",
                'count':notes.length,
                'Notes':notes
            });
        } else{
            response.status(400).json({
                'message':"No data",
                'count':count,
            })
        }
        
    })
    .catch((errr)=>{
        response.status(500).json({
            'message':'unable to retrieve notes'
        })
    })

    
});

router.post('/',(request,response,next)=>{
    let title=request.body.title;
    let content = request.body.content;
    let date = request.body.date;

    let noteObj = new Note({
        '_id': new mongoose.Types.ObjectId(),
        'title':title,
        'content':content,
        'date':date
    });
    Note.find({"title":title}).exec().then((note)=>{
        console.log(note)
        if(note.length){
            response.status(400).json({
                'message':"note is already present"
            })
        }
        else{
            noteObj.save()
            .then(
                (note)=>{
        
                    response.status(201).json({
                        'message':"New note created",
                        'notes':note
                    });
                    
                }
            )
        }
    })
   .catch((err)=>{
        response.status(500).json({
            'message':"New note not created"
        })
    });


});

router.patch('/:noteid',(request,response,next)=>{
    let noteid = request.params.noteid;
    let updateObj= {};
    console.log("request body::::::",request.body)
    for(let itr of request.body){
        updateObj[itr.propname]= itr.value;
    }
    updateObj[new_note]=false

    Note.updateOne({_id:noteid},{$set:updateObj}).exec
    .then(()=>{
        response.status(200).json({
            'message':"Note updated"
        });
    })
    .catch((error)=>{
        response.status(500).json({
            'message':"fail to update the notes"
        })
    })
    
})
router.delete('/:noteid',(request,response,next)=>{
    let noteid=request.params.noteid;
    Note.remove({'_id':noteid}).exec()
    .then((res)=>{
        response.status(200).json({
            'message':'Note deleted',
            'note':res,
        });
    })
    .catch((res)=>{
        response.status(500).json({
            'message':"Unable to delete",
        })
    })
    
})


module.exports=router