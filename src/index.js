const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

//morgan.token('type', function (req, res) { return req.headers['content-type'] })


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Edsger Dijkstra",
        "number": "01234",
        "id": 5
    },
    {
        "name": "pööp-ameeba",
        "number": "040 238 212",
        "id": 6
    },
    {
        "name": "delete this",
        "number": "00123",
        "id": 7
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
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

    const potentialDuplicate = persons.find(p => p.name === body.name)
    if (potentialDuplicate) {
        return res.status(400).json({
            error: 'Name must be unique.'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000) // real bad
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people. <br> ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
