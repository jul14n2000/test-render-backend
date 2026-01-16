require('dotenv').config()
const express = require('express');
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./note')
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'));
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('Id params:  ', request.params)
  console.log('---')
  next()
}
app.use(requestLogger)

app.get('/',(request,response)=>{
    response.send('<h1>hellow world</h1>')
})

app.get('/api/notes',(request,response)=>{
    Note.find({}).then(notes=>{
        response.json(notes)
    })
})

app.get('/api/notes/:id',(request,response,next)=>{
    Note.findById(request.params.id).then(note=>{
        if(note){
            response.json(note)
        }else
            response.status(404).end()
        
}).catch(error=>{next(error)
})
})

app.delete('/api/notes/:id',(request,response,next)=>{
    console.log("el id a eliminar es:",request.params.id)
    console.log("dentro del delete")
    Note.findByIdAndDelete(request.params.id).then(result=>{
        response.status(204).end()
    }).catch(error=>{
        console.log(error.message)
        next(error)
    })

})

app.put('/api/notes/:id',(request,response,next)=>{
    const body = request.body
    const note = {
        content:body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id,note,{new:true, runValidators:true,context:'query'}).then(updatedNote=>{
        response.json(updatedNote)
    }).catch(error=>next(error))
})

app.post('/api/notes',(request,response,next)=>{
    const note = request.body

   const noteNew = new Note({
        content: note.content,
        important: note.important || false,
   })
    noteNew.save().then(savedNote=> {
        response.json(savedNote)
    })
    .catch(error=>next(error))
})


const rutaDesconocida = (request,response)=>{
    response.status(404).send({error:"ruta desconocida"})
}
app.use(rutaDesconocida)
/* const generarId = ()=>{
    const maxId = notes.length >0? Math.max(...notes.map(n=>n.id)):0
    return maxId+1
} */
const errorHandler =(error,request,response,next)=>{
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'id malformado'})
    }
    if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)

}
app.use(errorHandler)

const PORT =process.env.PORT
app.listen(PORT,()=>{
    console.log('el servidor esta escuchando en el puerto',PORT)
})

