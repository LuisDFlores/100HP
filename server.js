const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

MongoClient.connect('mongodb+srv://floreslui242:zooman12@100hourproject.oqwole6.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('100HourProject')
        const quotesCollection = db.collection('quotes')

        app.set('view engine', 'ejs')
        res.render(view, locals)

        app.use(bodyParser.urlencoded({ extended: true }))

        app.listen(3000, function () {
            console.log('listening on 3000')
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
    })

    .catch(error => console.error(error))
