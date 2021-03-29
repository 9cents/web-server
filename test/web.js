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

describe('Web Interface', function() {

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
                .get('/progressreport?player_id=' + player.player_id)
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Progress returned.");
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

        it('Return worlds', done => {
            chai.request(server)
                .get('/world')
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Rows returned.");
                    done();
                })
        });

        it('Return towers', done => {
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

        it('Return levels', done => {
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

        it('Return questions', done => {
            chai.request(server)
                .get('/world')
                .end((err, res) => {
                    chai.request(server)
                        .get('/tower?world_id=' + res.body.data[0].world_id)
                        .end((err, resp) => {
                            chai.request(server)
                                .get('/level?tower_id=' + resp.body.data[0].tower_id)
                                .end((err, response) => {
                                    chai.request(server)
                                        .get('/question?level_id=' + response.body.data[0].level_id)
                                        .end((err, responses) => {
                                            responses.should.have.status(200);
                                            expect(responses.body.message).to.equal("Rows returned.");
                                            done();
                                        })
                                })
                        })
                })
        });

        it('Return answers', done => {
            chai.request(server)
                .get('/world')
                .end((err, res) => {
                    chai.request(server)
                        .get('/tower?world_id=' + res.body.data[0].world_id)
                        .end((err, resp) => {
                            chai.request(server)
                                .get('/level?tower_id=' + resp.body.data[0].tower_id)
                                .end((err, response) => {
                                    chai.request(server)
                                        .get('/question?level_id=' + response.body.data[0].level_id)
                                        .end((err, responses) => {
                                            chai.request(server)
                                                .get('/answer?question_id=' + responses.body.data[0].question_id)
                                                .end((err, responsess) => {
                                                    responsess.should.have.status(200);
                                                    expect(responsess.body.message).to.equal("Rows returned.");
                                                    done();
                                                })
                                        })
                                })
                        })
                })
        });
    })

    /*
    * Test the /PUT routes
    */
    context('/PUT instructor', () => {
        var instructor = {
            instructor_name: "Test Instructor"
        }

        it('Update dungeon', done => {
            chai.request(server)
                .put('/instructor')
                .set('content-type', 'application/json')
                .send({
                    question_1: 31,
                    question_2: 32,
                    question_3: 33,
                    question_4: 34,
                    question_5: 35,
                    lock: true,
                    conditions:{
                        instructor_name: instructor.instructor_name
                    }
                })
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("1 row(s) updated.");
                    done();
                })
        });

        it('Update answers', done => {
            chai.request(server)
                .get('/world')
                .end((err, res) => {
                    chai.request(server)
                        .get('/tower?world_id=' + res.body.data[0].world_id)
                        .end((err, resp) => {
                            chai.request(server)
                                .get('/level?tower_id=' + resp.body.data[0].tower_id)
                                .end((err, response) => {
                                    chai.request(server)
                                        .get('/question?level_id=' + response.body.data[0].level_id)
                                        .end((err, responses) => {
                                            chai.request(server)
                                                .get('/answer?question_id=' + responses.body.data[0].question_id)
                                                .end((err, responsess) => {
                                                    chai.request(server)
                                                        .put('/answer')
                                                        .set('content-type', 'application/json')
                                                        .send({
                                                            answer_body: responsess.body.data[0].answer_body,
                                                            correct: responsess.body.data[0].correct,
                                                            conditions:{
                                                                answer_id: responsess.body.data[0].answer_id
                                                            }
                                                        })
                                                        .end((err, responsesss) => {
                                                            responsesss.should.have.status(200);
                                                            expect(responsesss.body.message).to.equal("1 row(s) updated.");
                                                            done();
                                                        })
                                                })
                                        })
                                })
                        })
                })
        });
        })

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
})