import { db } from "../database/connection.js"
import { ObjectId } from "mongodb"

export async function postPoll(req, res) {
    const {title, expireAt} = req.body
  try{
    
    if(expireAt){
               const object = {
            title,
            expireAt   
        }
        await db.collection("poll").insertOne(object);
        return res.status(201).send("created")
    }
    else{
        const data = new Date()
        data.setDate(data.getDate()+30)
        const date = data.toISOString().slice(0, 16).replace("T", " ")
        // expireAt = date
        const object = {
            title,
            expireAt: date  
        }
        await db.collection("poll").insertOne(object);
        return res.sendStatus(201)
    }   
}catch (err){
    res.status(500).send(err.message)
    }
}
export async function getPoll(req, res) {
    const list = await db.collection("poll").find().toArray()
        .then((list) => res.status(200).send(list))
        .catch((err) => res.status(500).send(err.message))
}

export async function postChoice(req, res) {
    const {title, pollId} = req.body

    try{      
        const verifyPoll = await db.collection("poll").findOne({_id: new ObjectId(pollId)})
        if(!verifyPoll){
            res.status(404).send("Enquete Inexistente")
        }
        else{
            const verifyTitle= await db.collection("choice").findOne({title})
            if(!verifyTitle){
                const object = {
                    title,
                    pollId  
                }
                await db.collection("choice").insertOne(object);
                return res.status(201).send("created")
            }
            else{
                res.send(409)
            }
        }        
    }catch (err){
        res.status(500).send(err.message)
    }
}
export async function getChoice(req, res) {
    const id= req.params.id; 

    try {
        const verifyPoll = await db.collection("poll").findOne({_id: new ObjectId(id)})
        if(!verifyPoll){
            res.status(404).send("Enquete Inexistente")
        }

        const list = await db.collection("choice").find({pollId: id}).toArray()
        .then((list) => res.status(200).send(list))
        .catch((err) => res.status(404).send(err.message))
    } catch (err) {
        res.status(500).send(err.message)
    }   
}

export async function postVote(req, res) {
  
}
export async function getResult(req, res) {
  
}

