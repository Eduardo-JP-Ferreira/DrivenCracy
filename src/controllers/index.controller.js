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
        const data = new Date()        
        const date = data.toISOString().slice(0, 16).replace("T", " ")

            if(date>verifyPoll.expireAt){
                // console.log("expirou")
                res.status(403).send("Esta enquete já expirou")
            }
            else{
                // console.log("OK")
                const choices= await db.collection("choice").find({pollId}).toArray()
                const verifyTitle = choices.find( choice => choice.title === title );
                if(!verifyTitle){
                    const object = {
                        title,
                        pollId  
                    }
                    await db.collection("choice").insertOne(object);
                    return res.status(201).send("created")
                }
                else{
                    res.status(409).send("Este titulo já existe")
                }
                // res.status(200).send(choices)
                // res.status(200).send(verifyTitle)
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
    const choiceId= req.params.id; 
    try {

        const verifyChoice = await db.collection("choice").findOne({_id: new ObjectId(choiceId)})
        if(!verifyChoice){
            res.status(404).send("Escolha Inexistente")
        }
        else{
            const data = new Date()        
            const date = data.toISOString().slice(0, 16).replace("T", " ")
            
            const verifyPoll = await db.collection("poll").findOne({_id: new ObjectId(verifyChoice.pollId)})

            if(date>verifyPoll.expireAt){

                res.status(403).send("Esta enquete já expirou")
            }
            else{
                const voteObject={
                    choiceId,
                    date
                }
                await db.collection("votes").insertOne(voteObject);
                return res.status(201).send("created")
            }
        }

    } catch (err) {
        res.status(500).send(err.message)
    }
   

}

export async function getResult(req, res) {
    const id= req.params.id; 

    try {
        const verifyPoll = await db.collection("poll").findOne({_id: new ObjectId(id)})
        if(!verifyPoll){
            res.status(404).send("Enquete Inexistente")
        }
        else{

        }

    } catch (err) {
        res.status(500).send(err.message)
    }
}

