require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Note = require('./models/note')

app.use(cors())
app.use(bodyParser.json())

// Run the app by serving the static files
// in the build directory
app.use(express.static(__dirname + '/build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()))
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note.toJSON())
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  const note = new Note ({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })


  note.save().then(savedNote => {
    response.json(savedNote.toJSON())
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
