const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
const PORT = 3000
require('dotenv').config()

let db,
    connectionString = process.env.DB_STRING,
    dbName = 'quotes'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to  ${dbName} Database`)
        db = client.db(dbName)
        const quotesCollection = db.collection('quotes')

        app.use(express.static('public'))
        app.set('view engine', 'ejs')
        app.use(bodyParser.json())

        app.use(bodyParser.urlencoded({ extended: true }))

        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })


        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                res.render('index.ejs', { quotes: results })  
            })
            .catch(error => console.error(error)) 
        })

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html')
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => { res.json('success') })
                .catch(error => console.error(error))
        })
        })
    .catch(error => console.error(error))
