require('dotenv').config()
const mongoose = require('mongoose');
const URL = process.env.MONGODB_URI 
console.log("variable de entorno:",process.env.MONGODB_URI)
console.log("variable entonro",process.env.PORT)

console.log("conectando a la url",URL)

mongoose.set('strictQuery',false)

mongoose.connect(URL)
    .then(result=>{
        console.log('conectado a la base de datos')
    }).catch((error)=>{
        console.log('error al conectar a la base de datos:', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.id
    }
})
const Note = mongoose.model('Note',noteSchema)
module.exports = Note