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
            player_name: "Test Player"
        }

        it('Delete existing test dungeon', done => {
            chai.request(server)
                .delete('/dungeon')
                .set('content-type', 'application/json')
                .send(user)
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Row(s) deleted.");
                    done();
                })
        });

        it('Delete existing test player', done => {
            chai.request(server)
                .delete('/player')
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
    context('/POST player', () => {
        it('Add a new player', done => {
            chai.request(server)
                .post('/register')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    name: "Test Player",
                    password: "test"
                })
                .end((err, res) => {
                    // console.error(res.body);
                    res.should.have.status(200);
                    expect(res.body.message).to.equal("Player added.");
                    done();
                })
        });
    })

    /*
     * Test the /GET routes
     */
    context('/GET player', () => {
        it('Get ALL players', done => {
            chai.request(server)
                .get('/player')
                .end((err, res) => {
                    //console.debug(res.body)
                    res.should.have.status(200);
                    done();
                })
        })
    })
})