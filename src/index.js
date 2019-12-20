require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'Name missing.'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'Number missing.'
        })
    }

    // Not refactored to use MongoDB yet
    /*
    const potentialDuplicate = persons.find(p => p.name === body.name)
    if (potentialDuplicate) {
        return res.status(400).json({
            error: 'Name must be unique.'
        })
    }
    */

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people. <br> ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
