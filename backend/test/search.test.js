let chai = require("chai");
let expect = chai.expect;
let assert = chai.assert;
let chaiHttp = require("chai-http");
let server = require("../app");
var should = chai.should();

chai.use(chaiHttp);

describe("Upstox - Search Engine", () => {

    it("GET /search?q=ter - Gets All Names Matching", (done) => {
        chai.request(server)
            .get("/search?q=ter")
            .set("content-type", "text/plain")
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.equal(false);
                done();
            });
    });

    it("GET /search?q=te     - Query String Less Then 3 Characters", (done) => {
        chai.request(server)
            .get("/search?q=te")
            .set("content-type", "text/plain")
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.equal('Query String Missing !!');
                done();
            });
    });

    it("GET /search - No Query String", (done) => {
        chai.request(server)
            .get("/search")
            .set("content-type", "text/plain")
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.equal('Query String Missing !!');
                done();
            });
    });
});