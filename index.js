// server.js

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Add this line to parse request body as JSON

// MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g4e8qzr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const booksCollection = client.db('BooksDb').collection('IslamicBooks');

    app.get('/books', async (req, res) => {
      const books = await booksCollection.find({}).toArray();
      res.send(books);
    });

    app.get('/books/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const book = await booksCollection.findOne(query);
        if (book) {
          res.send(book);
        } else {
          res.status(404).send('Book not found');
        }
      } catch (error) {
        console.error('Error retrieving book:', error);
        res.status(500).send('Error retrieving book');
      }
    });

    app.post('/books', async (req, res) => {
      try {
        const addBookData = req.body;
        console.log(addBookData);
        const addBook = await booksCollection.insertOne(addBookData);
        console.log('Book added successfully:', addBook);
        res.send(addBook);
      } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).send('Error adding book');
      }
    });

    app.delete('/books/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await booksCollection.deleteOne(query);
        console.log('Book deleted:', result);
        res.send(result);
      } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('Error deleting book');
      }
    });

    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Book server running ........!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
