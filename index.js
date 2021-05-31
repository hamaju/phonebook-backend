const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
  {
    id: 5,
    name: 'Dick McBalls',
    number: '42-69-6091337',
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>');
});

app.get('/info', (req, res) => {
  res.send(
    `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>
    `
  );
});

app.get('/api/persons', (req, res) => {
  res.send(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((note) => note.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const generateId = () => {
  return getRandomInt(1000000, 9999999);
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }

  const personExists = persons.some((person) => person.name === body.name);

  if (personExists) {
    return res.status(409).json({ error: 'name must be unique' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

// heroku dynamically assigns a port; use port 3001 locally
const PORT = 3001;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
