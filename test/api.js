let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/app');

let assert = chai.assert;
let expect = chai.expect;
let should = chai.should();

const {
    sequelize,
    dataTypes,
    checkModelName,
    checkUniqueIndex,
    checkPropertyExists
} = require('sequelize-test-helpers')

chai.use(chaiHttp);

describe('Custom API', function() {
    /*
    * Clean existing test data
    */
    context('Clean Test Data', () => {
        var user = {
            instructor_name: "Test Instructor"
        }

        it('Delete existing test instructor', done => {
            chai.request(server)
                .delete('/instructor')
                .set('content-type', 'application/json')
                .send(user)
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Row(s) deleted.");
                    done();
                })
        });
    })

    /*
    * Test the /POST routes
    */
    context('/POST instructor', () => {
        it('Register an instructor', done => {
            chai.request(server)
                .post('/registerweb')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    name: "Test Instructor",
                    password: "test"
                })
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Instructor added.");
                    done();
                })
        });
        
        it('Login to web interface', done => {
            chai.request(server)
                .post('/loginweb')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    name: "Test Instructor",
                    password: "test"
                })
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Passwords match");
                    done();
                })
        });
    })

    /*
    * Test the /GET routes
    */
    context('/GET information', () => {
        var player = {
            player_id: 2
        }

        it('Return progress', done => {
            chai.request(server)
                .get('/progress?player_id=' + player.player_id)
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Rows returned.");
                    done();
                })
        });
        
        it('Return accuracy', done => {
            chai.request(server)
                .get('/accuracy?player_id=' + player.player_id)
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Accuracy returned.");
                    done();
                })
        });

        it('Return responses', done => {
            chai.request(server)
                .get('/responsedata?player_id=' + player.player_id)
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Responses returned.");
                    done();
                })
        });
    })

    context('/GET game information', () => {
        var player = {
            id: 1
        }

        it('Return world', done => {
            chai.request(server)
                .get('/world')
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Rows returned.");
                    done();
                })
        });

        it('Return tower', done => {
            chai.request(server)
                .get('/world')
                .end((err, res) => {
                    chai.request(server)
                        .get('/tower?world_id=' + res.body.data[0].world_id)
                        .end((err, resp) => {
                            // console.error(res.body);
                            resp.should.have.status(200);
                            expect(resp.body.message).to.equal("Rows returned.");
                            done();
                        })
                })
        });

        it('Return level', done => {
            chai.request(server)
                .get('/world')
                .end((err, res) => {
                    chai.request(server)
                        .get('/tower?world_id=' + res.body.data[0].world_id)
                        .end((err, resp) => {
                            chai.request(server)
                                .get('/level?tower_id=' + resp.body.data[0].tower_id)
                                .end((err, response) => {
                                    // console.error(res.body);
                                    response.should.have.status(200);
                                    expect(response.body.message).to.equal("Rows returned.");
                                    done();
                                })
                        })
                })
        });
    })
})