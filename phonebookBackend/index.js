const express = require('express')
const morgan = require('morgan')
const app = express()
// const cors = require('cors')

// app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// app.use(morgan('tiny'))
morgan.token('body', (req,res) => {
    if (req.body) {
        const {id, ...ret} = req.body
        return JSON.stringify(ret)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`
    )
    
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {

    const person = request.body

    if (!person.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!person.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.map(person => person.name.toLowerCase()).includes(person.name.toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = Math.floor(Math.random()*10000000)

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
   
    const id = request.params.id
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
