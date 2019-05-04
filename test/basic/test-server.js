var chai = require('chai')
var assert = require('assert')
var chaiHttp = require('chai-http')
var server = require('../..')
var should = chai.should()

chai.use(chaiHttp)


describe('Basic Upsala Backend Test', function() {
  
    it('should test service /info GET', function(done) {
        chai.request(server)
            .get('/info')
            .end(function(err, res){
                res.should.have.status(200)
                done()
        })
    })

})

describe('Download Upsala Backend Test', function() {
  
    // https://glaciar-upsala-backend.herokuapp.com/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2018-03-05&to=2018-03-10
    it('should download bulk from /dataset GET', function(done) {
        chai.request(server)
            .get('/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2018-03-05&to=2018-03-07')
            .end(function(err, res){
                res.should.have.status(200)
                done()
        })
    })

})




    // http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO2?from=2015-04-28&to=2018-05-13
       
    // http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO2?from=2014-04-26T00:00:00.000Z&to=2018-02-15T00:00:00.000Z
