const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

var generator = require('generate-password');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

//The names we're using below were defined in the last post
MongoClient.connect('mongodb://localhost:27017') // This is the location of where your local database is living.
  .then((client) => {
    const db = client.db('SemaphoreDB'); // The name we gave our DB
    const kycDataCollection = db.collection('usersKycData'); // The name we gave our collection inside the DB
    const enCollection = db.collection('enStore');
    const otpCollection = db.collection('userOTP');
    const userCredentials = db.collection('Creds');

   app.use('/api/kyc', function (req, res, next) {
        console.log('Request Type:', req.method)
        next()
      })
    app.post('/api/uploadkyc', (req, res) => {
        kycDataCollection.insertOne(req.body)
          .then(result => {
            // console.log(result)
          })
          .catch(error => console.error(error))
      })
    app.get('/api/kyc', (req, res) => {
        kycDataCollection.find().toArray().then((docs) => res.json(docs))
    })

    app.get('/api/getKycData', (req, res) => {
      console.log(req.query)
      kycDataCollection.findOne({_id: req.query.id}).then((doc) => {
        console.log(doc)
        res.json(doc)
      })
    })

    app.post('/api/enStore', (req, res) => {
      enCollection.insertOne(req.body)
        .then(result => {
          // console.log(result)
        })
        .catch(error => console.error(error))
    })

    app.get('/api/getEN', (req, res) => {
      console.log(req.params)
      enCollection.findOne({domain: req.query.domain}).then((doc) => {
        // console.log(doc)
        res.send({en: doc.en})
      })
    })

    app.get('/api/getAllEN', (req, res) => {
      enCollection.find().toArray().then((docs) => {
        console.log(docs)
        res.json(docs)
      })
    })

    app.post('/api/genOTP', (req, res) => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      console.log(otp)

      otpCollection.deleteOne({email: req.body.email}).then((doc) => 
        console.log(doc.result.n + " document(s) deleted")
      )

      const otpData = {email: req.body.email, otp: otp, ts_created: Date.now()}

      otpCollection.insertOne(otpData)
          .then(result => {
            // console.log(result)
                  // use Twilio to send otp to email address
          })
          .catch(error => console.error(error))
      })

  app.post('/api/verifyOTP', (req, res) => {
    otpCollection.findOne({email: req.body.email}).then((doc) => {
      // console.log(doc.otp)
      console.log(req.body)
      if(doc.otp == req.body.otp) {
      // if(doc.otp == req.body.otp && req.body.ts - doc.ts_created< 300000) {
        res.send({success: 1})
      }
      else {
        res.send({success: 0})
      }
    })
  })

  app.post('/api/genCredentials', (req, res) => {
    console.log(req.body.user_id)
    var token = generator.generate({
      length: 10,
      numbers: true
    });
    const ts_now = Date.now()
    const credentials = {user_id: req.body.user_id, token: token, ts: ts_now }
    console.log(credentials)
    userCredentials.insertOne(credentials)
    .then(()=> {
      res.send(credentials)
    })
  })

  app.post('/api/login', (req, res) => {
    const ts_now = Date.now()
    console.log(req.body.token)
    userCredentials.findOne({token: req.body.token}).then((doc) => {
      console.log(doc)
      if(ts_now-doc.ts< 1814400000) {
        res.send({success: 1})
      }
      else  {
        res.send({success: 0})
      }
  }).catch(error => console.error(error))

})
  })
  .catch(console.err);
  

app.listen(4000, function () {
  console.log(`Listening on this port: ${this.address().port}`);
});