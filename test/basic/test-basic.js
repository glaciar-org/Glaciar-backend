var chai = require('chai')
var assert = require('assert')
var moment = require('moment')
var should = chai.should()
const Json2csvParser = require('json2csv').Parser


describe('Basic String Test', function () {
  it('should return number of charachters in a string', function () {
      assert.equal("Hello".length, 5)
  })
})

describe('Basic Fechas with moment.js Test', function() {

  it('should convert date to format DD/MM/YYYY', function(){

    let f1 = "2014-04-29"

    let f2 = moment(f1, 'YYYY-MM-DD').format('DD/MM/YYYY')
    
    assert.equal(f2 === '29/04/2014', true)
    
    let last_apple     = [ 1538746200000,  224.29 ]
    let date_apple_Z   = "2018-10-05T10:30:00.000Z"
    let date_apple_GMT = "2018-10-05T10:30:00.000-03:00"

    assert.equal( moment( last_apple[0]  ).format('DD/MM/YYYY') == "05/10/2018", true )
    assert.equal( moment( last_apple[0]  ).format('YYYY-MM-DDThh:mm:ss.sss')+'Z'                 == date_apple_Z,    true )
    assert.equal( moment( last_apple[0]  ).format('YYYY-MM-DDThh:mm:ss.sssZ')                    == date_apple_GMT,  true )
    assert.equal( moment( date_apple_Z,           'YYYY-MM-DDTHH:mm:ss.sss').toDate().getTime()  == last_apple[0],   true )
    assert.equal( moment( date_apple_GMT,         'YYYY-MM-DDThh:mm:ss.sssZ').toDate().getTime() == last_apple[0],   true )

    // 1538708400000  --> moment(  "05/10/2018" , 'DD/MM/YYYY').toDate().getTime()
    // 1538708400000  --> new Date("10/05/2018").getTime()
    // 1525921200000  --> new Date("05/10/2018").getTime()

    // 1538746200000  --> es el de apple
    //         apple  --> moment    ( 1538746200000  ).format('YYYY-MM-DDThh:mm:ss.sssZ')    "2018-10-05T10:30:00.000-03:00"
    //         apple  --> moment    ( 1538746200000  ).format('YYYY-MM-DDTHH:mm:ss.sssZ')    "2018-10-05T10:30:00.000-03:00"
    //         apple  --> moment.utc( 1538746200000  ).format('YYYY-MM-DDThh:mm:ss.sssZ')    "2018-10-05T01:30:00.000+00:00"
    //         apple  --> moment.utc( 1538746200000  ).format('YYYY-MM-DDTHH:mm:ss.sssZ')    "2018-10-05T13:30:00.000+00:00"
    //
    // "2018-10-05T10:30:00.000-03:00"
    // ***>>>  moment(     "2018-10-05T10:30:00.000", 'YYYY-MM-DDThh:mm:ss.sssZ').toDate().getTime()  --> 1538746200000
    //         moment.utc( "2018-10-05T10:30:00.000", 'YYYY-MM-DDThh:mm:ss.sssZ').toDate().getTime()  --> 1538735400000

    // assert.equal( moment( 1538746200000  ).format('DD/MM/YYYY') == "05/10/2018", true )

  })

})

describe('Basic json2csv with json2cvs.js Test', function() {

  it('should convert a json to csv (sample data)', function(){

    const fields = ['car', 'price', 'color']
    const myCars = [
      { "car": "Audi", "price": 40000, "color": "blue"   }, 
      { "car": "BMW", "price": 35000, "color": "black"  }, 
      { "car": "Porsche", "price": 60000, "color": "green"  }
    ]

    const json2csvParser = new Json2csvParser({ fields })
    const csv = json2csvParser.parse(myCars)
    
    // console.log(csv)
  })

  it('should convert a json to csv (my data)', function(){

    // Samples from:
    // https://www.npmjs.com/package/json2csv
    
    const fields = ['FECHA_HORA', 'FECHA', 'HORA', 'AIRQ_CO', 'DATASET' ]

    const JSON_DATA = '['  
      + ' {"FECHA_HORA":"2009-10-01T13:00:00.000Z","FECHA":"01/10/2009","HORA":"14","AIRQ_CO":"","DATASET":"MGSET_01_2009_2018_BO"}, ' 
      + ' {"FECHA_HORA":"2009-10-01T14:00:00.000Z","FECHA":"01/10/2009","HORA":"15","AIRQ_CO":"0.16","DATASET":"MGSET_01_2009_2018_BO"}, ' 
      + ' {"FECHA_HORA":"2009-10-01T15:00:00.000Z","FECHA":"01/10/2009","HORA":"16","AIRQ_CO":"0.14","DATASET":"MGSET_01_2009_2018_BO"} ' 
      + ' ]'
 
    let docsJS = JSON.parse(JSON_DATA)

    const json2csvParser = new Json2csvParser({ fields })
    const csv = json2csvParser.parse(docsJS)
    
    console.log(csv)
  
 
  })

})