const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://juhani:${password}@cluster0.kjojx.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length === 3) {
  console.log('Phonebook:');
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (name && number) {
  person.save().then((result) => {
    console.log(`added ${name} number: ${number}`);
    mongoose.connection.close();
  });
} else {
  console.log('usage: node mongo.js <password> <name> <number>');
  process.exit(1);
}
