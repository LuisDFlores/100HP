const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
const PORT = 3000
require('dotenv').config()

let db,
    connectionString = process.env.DB_STRING,
    dbName = 'quotes',
    quotesCollection
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to  ${dbName} Database`)
        db = client.db(dbName)
        quotesCollection = db.collection('quotes')
    })
        app.use(bodyParser.urlencoded({ extended: true }))
        app.set('view engine', 'ejs')
        app.use(express.static('public'))
        app.use(bodyParser.json())
        app.listen(process.env.PORT || PORT, () => {
        console.log(`Server running on port ${PORT}`)
        })

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    console.log(results)
                res.render('index.ejs', { quotes: results })  
            })
            .catch(error => console.error(error)) 
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
                .catch(console.error)
        })
    

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json(`Deleted `)
                })
                .catch(error => console.error(error))
        })
