
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../index');
const server = 'http://localhost:3000/v1'
const should = chai.should();
const expect = chai.expect;
const async = require('async');

describe('Singleston CRUD api', () => {
  afterEach((done) => {
    delete require.cache[require.resolve('../index')]
    done();
  })
  describe('GET /contacts', () => {
    it('should return a 200 and an empty array when no entires in the db', done => {
      chai
        .request(server)
        .get('/contacts')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal([]);
          done();
        });
    });
    it('should return a 200 with an array of data when entires exist', done => {
      async.waterfall([
        (cb) => {chai.request(server).post('/contacts').set('content-type', 'application/json').send(sampleData).end(cb);},
        (cb) => {chai.request(server).get('/contacts').end((err, res) => {
          res.should.have.status(200);
          expect(res.body.length).to.deep.equal(1);
          chai.request(server).delete('/contacts/1').end();
          done();
        })},
      ])
    });
  });

  describe('POST /contacts', () => {
    it('should respond with a 200 and the inserted object', done => {
      chai.request(server).post('/contacts').set('content-type', 'application/json').send(sampleData)
      .end((req,res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.include(sampleData);
        chai.request(server).delete('/contacts/2').end();

        done();
      })
    });

    it('should respond with a 422 when the inputted data is malformed', done => {
      sampleData["email"] = 123;
      chai.request(server).post('/contacts').set('content-type', 'application/json').send(sampleData)
      .end((req,res) => {
        res.should.have.status(422);
        sampleData["email"] = 'vladimirbogza@gmail.com'
        done();
      })
    });
  });

  describe('GET /contacts/{:id}}', () => {
    it('should return a 200 and an empty object when no entry found in the db', done => {
      chai
        .request(server)
        .get('/contacts/2')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal({});
          done();
        });
    });
    it('should return a 200 and an object', done => {
      async.waterfall([
        (cb) => {chai.request(server).post('/contacts').set('content-type', 'application/json').send(sampleData).end(cb);},
        (cb) => {chai.request(server).get('/contacts/3').end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.include(sampleData)
          chai.request(server).delete('/contacts/3').end();
          done();
        })},
      ])
    });
    it('should return a 422 when malformed data is passed', done => {
      chai
        .request(server)
        .get('/contacts/vvw')
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });
  });

    describe('DELETE /contacts/{:id}}', () => {
      it('should return a 422 when malformed data is passed', done => {
        chai
          .request(server)
          .get('/contacts/vvw')
          .end((err, res) => {
            res.should.have.status(422);
            done();
          });
      });
      it('should return a 200 when completed succcesfully', done => {
        async.waterfall([
          (cb) => {chai.request(server).post('/contacts').set('content-type', 'application/json').send(sampleData).end(cb);},
          (cb) => {chai.request(server).delete('/contacts/4').end((err, res) => {
            res.should.have.status(200);
            done();
          })}
        ])
      });
    });

    describe('PUT /contacts/{:id}}', () => {
      it('should return a 422 wehn malformed data is passed', done => {
        sampleData["email"] = 123;
        async.waterfall([
          (cb) => {chai.request(server).post('/contacts').set('content-type', 'application/json').send(sampleData).end(cb);},
          (cb) => {chai.request(server).put('/contacts/5').send(sampleData).end((err, res) => {
            res.should.have.status(200);
            sampleData["email"] = 'vladimirbogza@gmail.com';
            chai.request(server).delete('/contacts/5').end();
            done();
          })}
        ])
      });
      it('should return a 200 when completed succcesfully and return the new updated object', done => {
        const updatedObject = Object.assign(sampleData);
        updatedObject.email = 'george@singelstone.com'
        async.waterfall([
          (cb) => {chai.request(server).post('/contacts').set('content-type', 'application/json').send(sampleData).end(cb);},
          (cb) => {chai.request(server).put('/contacts/6').send(sampleData).end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.deep.include(updatedObject);
            chai.request(server).delete('/contacts/6').end();
            done();
          })}
        ])
      });
    });

    describe('GET /contacts/call-list', () => {
      it('returns an empty array when none are found', done => {
        chai
        .request(server)
        .get('/contacts/call-list')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal([]);
          done();
        });
      });
      it('should return a 200 with an array of all the home phone numbers sorted by last name then first name', done => {
        async.waterfall([
          async (cb) => {await chai.request(server).post('/contacts').set('content-type', 'application/json').send(arrayOfDifferentSampleData[0],cb);},
          async (cb) => {await chai.request(server).post('/contacts').set('content-type', 'application/json').send(arrayOfDifferentSampleData[1],cb);},
          async (cb) => {await chai.request(server).post('/contacts').set('content-type', 'application/json').send(arrayOfDifferentSampleData[2],cb);},
          async (cb) => {await chai.request(server).post('/contacts').set('content-type', 'application/json').send(arrayOfDifferentSampleData[3],cb);}
        ], (err, res) => {
          chai.request(server).get('/contacts/call-list').end((err, res) => {
            res.should.have.status(200);
            expect(res.body.length).to.equal(4);
            expect(res.body[0]).to.deep.equal({name: arrayOfDifferentSampleData[0].name, phone: arrayOfDifferentSampleData[0].phone[0].number});
            expect(res.body[1]).to.deep.equal({name: arrayOfDifferentSampleData[1].name, phone: arrayOfDifferentSampleData[1].phone[0].number});
            expect(res.body[2]).to.deep.equal({name: arrayOfDifferentSampleData[3].name, phone: arrayOfDifferentSampleData[3].phone[0].number});
            expect(res.body[3]).to.deep.equal({name: arrayOfDifferentSampleData[2].name, phone: arrayOfDifferentSampleData[2].phone[0].number});

            done();
          })
        });
      });
      });
  });
  const sampleData = {
    "name": {
      "first": "Vad",
      "middle": "V",
      "last": "Bogza"
    },
    "address": {
      "street": "1111 Aslbany",
      "city": "Portland",
      "state": "OR",
      "zip": "97206"
    },
    "phone": [
      {
        "number": "171-344-2289",
        "type": "work"
      }
    ],
    "email": "vlad@singlestone.com"
  }

  const arrayOfDifferentSampleData = [
    {
      "name": {
        "first": "Vlad",
        "middle": "V",
        "last": "Bogza"
      },
      "address": {
        "street": "1111 Albany",
        "city": "Portland",
        "state": "OR",
        "zip": "97206"
      },
      "phone": [
        {
          "number": "171-244-2289",
          "type": "home"
        }
      ],
      "email": "vlad@singlestone.com"
    },
    {
      "name": {
        "first": "Vlad",
        "middle": "V",
        "last": "Logza"
      },
      "address": {
        "street": "1111 Albany",
        "city": "Portland",
        "state": "OR",
        "zip": "97206"
      },
      "phone": [
        {
          "number": "171-344-2289",
          "type": "home"
        }
      ],
      "email": "vlad@singlestone.com"
    },
    {
      "name": {
        "first": "Vlad",
        "middle": "V",
        "last": "Zogza"
      },
      "address": {
        "street": "1111 Albany",
        "city": "Portland",
        "state": "OR",
        "zip": "97206"
      },
      "phone": [
        {
          "number": "171-344-2289",
          "type": "home"
        }
      ],
      "email": "vlad@singlestone.com"
    },
    {
      "name": {
        "first": "Chad",
        "middle": "V",
        "last": "Zogza"
      },
      "address": {
        "street": "1111 Albany",
        "city": "Portland",
        "state": "OR",
        "zip": "97206"
      },
      "phone": [
        {
          "number": "171-344-2289",
          "type": "home"
        }
      ],
      "email": "vlad@singlestone.com"
    }
  ]