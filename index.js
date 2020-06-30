require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(cors())
app.use(express.json())
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (req) => {
  if (req.method==='POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(result => {
    if (result) {
      res.json(result)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.find({}).then(result => {
    res.send(`<p>Phonebook has info for ${result.length} people</p> <p>${date}</p>`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  //const id = Number(req.params.id)
  //const person = persons.find(person => person.id === id)
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        req.jason(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  //const id = Number(req.params.id)
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
  const body = req.body
  //const id = Math.floor(Math.random()*1000000000000)

  /*if (!body.name) {
    return res.status(400).json(
      {
        error: "Name missing"
      }
    )
  }

  if (!body.number) {
    return res.status(400).json(
      {
        error: "Number missing"
      }
    )
  }
  if (persons.map(person => person.name).includes(body.name)) {
    return res.status(400).json(
      {
        error: "Person already included in phonebook"
      }
    )
  }
  */
  const person = new Person({
    name: body.name,
    number: body.number,
  })


  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
