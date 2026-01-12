const express = require('express');
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'));
app.use(express.static('dist'))

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/',(request,response)=>{
    response.send('<h1>hellow world</h1>')
})

app.get('/api/notes',(request,response)=>{
    response.json(notes)
})

app.get('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    console.log(id)
    const note = notes.find(note=>{
        console.log(note.id, typeof note.id , id , typeof id , note.id===id)
        return note.id ===id

    })
    note? response.json(note): response.status(404).end()
})
app.delete('/api/notes/:id',(request,response)=>{
    console.log("para eliminar")
    const id = Number(request.params.id)
    notes = notes.filter(note=>note.id !==id)
    response.status(204).end()
})

app.post('/api/notes',(request,response)=>{
    const note = request.body
    if(!note.content){
        return response.status(400).json({
            error: "contenido vacio"
        })
    }
    const nuevaNota = {
        content: note.content,
        important: Boolean(note.important) || false,
        id: generarId()
    }
    notes = notes.concat(nuevaNota)
    console.log(notes)
    response.json(nuevaNota)
})
const rutaDesconocida = (request,response)=>{
    response.status(404).send({error:"ruta desconocida"})
}
app.use(rutaDesconocida)
const generarId = ()=>{
    const maxId = notes.length >0? Math.max(...notes.map(n=>n.id)):0
    return maxId+1
}

const PORT =process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log('el servidor esta escuchando en el puerto',PORT)
})