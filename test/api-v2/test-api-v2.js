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




describe('Test TDD DS01 - MGSET_01_2009_2018 (json_x_chartjs_multi_series)', function() {

  it("should test GET /v2/  with ?type=json_x_chartjs_multi_series", function(done) {
    chai.request(server)
        .get("/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type="+c.TYPE_JSON_for_CHARTJS_MULTI_SERIES)
        .end(function(err, res){
            res.should.have.status(200)

            res.body[0].should.have.property('gtype')
            res.body[0].should.have.property('gtype').equals(c.TYPE_JSON_for_CHARTJS_MULTI_SERIES)
            res.body[0].should.have.property('label').equals('Serie AIRQ_CO')
            res.body[0].should.have.property('data')
            
            let firstTimestamp  = res.body[0].labels[0]  // should be:  2015-01-15T01:00:00.000Z
            let firstValue      = res.body[0].data[0]   // should be:  '0.22'

            expect(firstTimestamp).to.equal('2015-01-15T01:00:00.000Z')
            expect(firstValue).to.equal('0.22')

            done()
    })
  })

})



describe('Test TDD DS02 - MGSET_03_2015_2017 (json_x_highstock)', function() {
  /**
     {'gtype':'json_x_highstock',
      'label':'Serie WATERQ_pH',
        'data':[
          [1462194900000,7.42],
           ...
          [1462464000000,7.39]
      ]}
   */
  it("should test GET /v2/ with ?type=json_x_highstock", function(done) {
    chai.request(server)
        .get("/v2/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type="+c.TYPE_JSON_for_HIGHSTOCK)
        .end(function(err, res){
            res.should.have.status(200)

            res.body.should.have.property('gtype')
            res.body.should.have.property('gtype').equals(c.TYPE_JSON_for_HIGHSTOCK)
            res.body.should.have.property('label').include('WATERQ_pH')
            res.body.should.have.property('data')
            
            let firstTimestamp  = res.body.data[0][0]  // should be:  1462194900000
            let firstValue      = res.body.data[0][1]   // should be:  '7.42'

            expect(firstTimestamp).to.equal(1462194900000)
            expect(firstValue).to.equal(7.42)

            done()
    })
  })

})
