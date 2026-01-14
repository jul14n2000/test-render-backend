const mongoose = require('mongoose');

if(process.argv.length<3){
    console.log('envia la password como argumento')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://julianAdmin123:${password}@cluster0.udugpxl.mongodb.net/noteApp?appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})
const Note = mongoose.model('Note',noteSchema)
const note = new Note({content: 'esta es una segunda nota', important:false})
//note.save().then(result=>{
  //  console.log('nota guardada')
   // mongoose.connection.close()
//})
Note.find({}).then(result=>{
    result.forEach(note=>{
        console.log(note)
    })
    mongoose.connection.close()
}).then(()=>{
    mongoose.connection.close()
})
console.log("-->",process.argv[0])
console.log("-->",process.argv[1])
console.log("-->",process.argv[2]) 
