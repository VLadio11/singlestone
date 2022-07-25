const loki = require('lokijs'), db = new loki('test.json');
const users = db.addCollection('users');
const validateInput = require('../helpers/validation')
let idCounter = 0;

const createUser =  function (req, res) {
    const schemaValidationResult  = validateInput('body', req.body);
    if(schemaValidationResult.error) {
        res.status(422).json({error: schemaValidationResult.error.details});
    } else {
        const result =  users.insert({id:++idCounter, ...req.body})
        db.saveDatabase();
        res.status(200).json(result);
    }
}

const getUsers = function (req, res) {
  res.send(users.data);
}

const getOneUser = function(req,res) {
    if(req.params.id) {
        const schemaValidationResult  = validateInput('param', req.params.id);
        if(schemaValidationResult.error) {
            res.status(422).json({error: schemaValidationResult.error.details});
        } else {
            let user = users.findOne({id: Number(req.params.id)});
            res.status(200).json(user || {});
        }
    }
}

const deleteUser = function(req,res) {
    if(req.params.id) {
     users.findAndRemove({id: Number(req.params.id)});
     db.saveDatabase();
     res.sendStatus(200);
    }
}

const updateUser =  function(req,res) {
    if(req.params.id) {
        const schemaValidationResult  = validateInput('param', req.params.id);
        if(schemaValidationResult.error) {
            res.status(422).json({error: schemaValidationResult.error.details});
        }
        let updatedDoc = req.body;
        let doc = users.findObject({id: Number(req.params.id)});
        if (doc) {
            updatedDoc['$loki'] = doc['$loki'];
            updatedDoc['meta'] = doc['meta'];
            updatedDoc['id'] = doc['id'];
            users.update(updatedDoc);
          }

        db.saveDatabase();
        res.status(200).json(updatedDoc || {});
    }
}

const getCallList = function(req, res) {
    let searchResults = []
    users.where((obj) => {
        let phoneNumbers =  obj.phone.find((phone) => {
            if(phone.type === 'home') {
                return true
            }
        });
        if(phoneNumbers) {
            searchResults.push({name: obj.name, phone: phoneNumbers.number});
        }
    });
    const sortedUsers = searchResults.sort((a, b) => {
        const result = a.name.last.localeCompare(b.name.last);

        return result !== 0 ? result :  a.name.first.localeCompare(b.name.first);
      })
    res.json(sortedUsers);
}

module.exports = {getUsers, createUser, deleteUser, getOneUser, updateUser, getCallList};