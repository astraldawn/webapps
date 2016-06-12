var request = require('supertest');
var app = require("../app.js");

console.log("Running basic tests");
describe("Basic tests", function () {
    describe("GET /", function () {
        it("returns status code 200", function (done) {
            request(app)
                .get("/")
                .expect(200)
                .end(function(err, res){
                    if(err) return done(err);
                    done();
                })
        });
    });
});

app.closeServer();