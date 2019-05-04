var chai = require('chai')
var assert = require('assert')
var chaiHttp = require('chai-http')
var server = require('../..')
var should = chai.should()
var expect = chai.expect
var c = require('../../common/Const')

chai.use(chaiHttp)


// https://www.chaijs.com/api/bdd/

itShouldBe200 = (text, path) => {
  it(text, function(done) {
    chai.request(server)
        .get(path)
        .end(function(err, res){
            res.should.have.status(200)
            done()
    })
  })
}

itShouldHave = (text, path, pattern) => {
  it(text, function(done) {
    chai.request(server)
        .get(path)
        .end(function(err, res){
            res.should.have.status(200)
            JSON.stringify(res).should.include(pattern)
            done()
    })
  })
}



describe('Test API (default)', function() {

  itShouldHave('should test GET /info', '/info', 'API Version 1.0')
  // itShouldBe200('should test GET /dataset',                   '/dataset')
  // itShouldBe200('should test GET /dataset/:dataset_id',       '/dataset/MGSET_02_2010_2015')
  // itShouldBe200('should test GET /dataset/:dataset_id/p/:id', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO')
  itShouldBe200('should test GET /data... ?from=   &to=   ',  '/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2009-10-01&to=2009-10-03')

})

describe('Test API V1', function() {

  itShouldHave('should test GET /v1/info', '/v1/info', 'API Version 1.0')
  // itShouldBe200('should test GET /v1/dataset',                   '/v1/dataset')
  // itShouldBe200('should test GET /v1/dataset/:dataset_id',       '/v1/dataset/MGSET_02_2010_2015')
  // itShouldBe200('should test GET /v1/dataset/:dataset_id/p/:id', '/v1/dataset/MGSET_02_2010_2015/p/AIRQ_CO')
  itShouldBe200('should test GET /v1/data... ?from=   &to=   ',  '/v1/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2009-10-01&to=2009-10-03')
  
})

describe('Test API V2', function() {

  itShouldHave('should test GET /v2/info',                          '/v2/info', 'API Version 2.0')
  // itShouldBe200('should test GET /v2/dataset',                   '/v2/dataset')
  // itShouldBe200('should test GET /v2/dataset/:dataset_id',       '/v2/dataset/MGSET_02_2010_2015')
  // itShouldBe200('should test GET /v2/dataset/:dataset_id/p/:id', '/v2/dataset/MGSET_02_2010_2015/p/AIRQ_CO')
  itShouldBe200('should test GET /v2/data... ?from=   &to=   ',  '/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2009-10-01&to=2009-10-03')

})

describe('Test TDD DS01 - MGSET_01_2009_2018 (json_x_chartjs_s)', function() {

  it("should test GET /v1/  with ?type=json_x_chartjs_s", function(done) {
    chai.request(server)
        .get("/v1/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type="+c.TYPE_JSON_for_CHARTJS_S)
        .end(function(err, res){
            res.should.have.status(200)

            res.body[0].should.have.property('gtype')
            res.body[0].should.have.property('gtype').equals(c.TYPE_JSON)
            res.body[0].should.have.property('label').equals('Serie AIRQ_CO')
            res.body[0].should.have.property('data')
            
            let firstTimestamp  = res.body[0].labels[0]  // should be:  15/01/2015T2
            let firstValue      = res.body[0].data[0]   // should be:  '0.22'

            expect(firstTimestamp).to.equal('15/01/2015T2')
            expect(firstValue).to.equal('0.22')

            done()
    })
  })

  it("should test GET /v2/  with ?type=json_x_chartjs_s", function(done) {
    chai.request(server)
        .get("/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type="+c.TYPE_JSON_for_CHARTJS_S)
        .end(function(err, res){
            res.should.have.status(200)

            res.body[0].should.have.property('gtype')
            res.body[0].should.have.property('gtype').equals(c.TYPE_JSON)
            res.body[0].should.have.property('label').equals('Serie AIRQ_CO')
            res.body[0].should.have.property('data')
            
            let firstTimestamp  = res.body[0].labels[0]  // should be:  15/01/2015T2
            let firstValue      = res.body[0].data[0]   // should be:  '0.22'

            expect(firstTimestamp).to.equal('15/01/2015T2')
            expect(firstValue).to.equal('0.22')

            done()
    })
  })

})

describe('Test TDD DS01 - MGSET_01_2009_2018 (json_x_highstock)', function() {

  it("should test GET /v1/  with ?type=json_x_highstock", function(done) {
    chai.request(server)
        .get("/v1/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2018-03-05&to=2018-03-07&type="+c.TYPE_JSON_for_HIGHSTOCK)
        .end(function(err, res){
            res.should.have.status(200)

            res.body.should.have.property('gtype')
            res.body.should.have.property('gtype').equals(c.TYPE_JSON_for_HIGHSTOCK)
            res.body.should.have.property('label').equals('Serie AIRQ_CO')
            res.body.should.have.property('data')
            
            let firstTimestamp  = res.body.data[0][0]  // should be:  1520211600000
            let firstValue      = res.body.data[0][1]  // should be:  0.55

            expect(firstTimestamp).to.equal(1520211600000)
            expect(firstValue).to.equal(0.55)

            done()
    })
  })

  it("should test GET /v2/ with ?type=json_x_highstock", function(done) {
    chai.request(server)
        .get("/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2018-03-05&to=2018-03-07&type="+c.TYPE_JSON_for_HIGHSTOCK)
        .end(function(err, res){
            res.should.have.status(200)

            res.body.should.have.property('gtype')
            res.body.should.have.property('gtype').equals(c.TYPE_JSON_for_HIGHSTOCK)
            res.body.should.have.property('label').equals('Serie AIRQ_CO')
            res.body.should.have.property('data')
            
            let firstTimestamp  = res.body.data[0][0]  // should be:  1520211600000
            let firstValue      = res.body.data[0][1]  // should be:  0.55

            expect(firstTimestamp).to.equal(1520211600000)
            expect(firstValue).to.equal(0.55)

            done()
    })
  })



})

