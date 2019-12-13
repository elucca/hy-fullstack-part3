// mongodb+srv://admin:<password>@hy-fullstack-luktn.mongodb.net/test?retryWrites=true&w=majority

const mongoose = require('mongoose')

const args = process.argv

const password = args[2]
const dbURL = `mongodb+srv://admin:${password}@hy-fullstack-luktn.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(dbURL, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (args.length == 3) {
  Person.find({}).then(people => {
    console.log('Phonebook:')
    people.forEach(person => {
      console.log(person.name, 'number:', person.number)
    })

    mongoose.connection.close()
    process.exit(1)
  })
}

const person = new Person({
  name: args[3],
  number: args[4]
})

person.save().then(response => {
  console.log('Added ', person.name, ', number: ', person.number)
  mongoose.connection.close()
})