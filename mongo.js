const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
console.log(process.argv)

const url = `mongodb+srv://fullstack:${password}@cluster0-j1rcu.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length===3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length===5) {
  const person = new Person({
    name: name,
    number: number
  })
  person.save().then(result => {
    console.log(`added ${name} ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  mongoose.connection.close()
}

