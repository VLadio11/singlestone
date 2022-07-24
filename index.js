const express = require('express')
const addContacts = require('./src/contacts-manager')
var loki = require('lokijs'), db = new loki('test.json');
var users = db.addCollection('users');
const bodyParser = require('body-parser');
const validateInput = require('./helpers/validation');
const app = express()
const port = 3000
app.use(bodyParser.json()); // for parsing application/json


app.post('/contacts', (req, res) => {
    const schemaValidationResult  = validateInput('body', req.body);
    if(schemaValidationResult.error) {
        res.status(422).json({error: schemaValidationResult.error.details});
    } else {
        const result = addContacts(req.body, users);
        db.saveDatabase();
        res.status(201).json(result);
    }
})

app.get('/contacts', (req, res) => {
  res.send(users.data);
})

app.get('/contacts/:id', (req,res) => {
    if(req.params.id) {
        const schemaValidationResult  = validateInput('param', req.params.id);
        if(schemaValidationResult.error) {
            res.status(422).json({error: schemaValidationResult.error.details});
        } else {
            let user = users.findOne({id: Number(req.params.id)});
            res.status(200).json(user || {});
        }

    }
});

app.delete('/contacts/:id', (req,res) => {
    if(req.params.id) {
     users.findAndRemove({id: Number(req.params.id)});
     db.saveDatabase();
     res.status(200).end();
    }
});

app.put('/contacts/:id', (req,res) => {
    if(req.params.id) {
        const schemaValidationResult  = validateInput('param', req.params.id);
        if(schemaValidationResult.error) {
            res.status(422).json({error: schemaValidationResult.error.details});
        }
        let doc = req.body;
        let updatedDoc = users.findObject({id: Number(req.params.id)});
        if (updatedDoc) {
            doc['$loki'] = updatedDoc['$loki'];
            doc['meta'] = updatedDoc['meta'];
            users.update(updatedDoc);
          }

        db.saveDatabase();

        res.status(200).json(updatedDoc || {});
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})