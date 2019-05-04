var chai = require('chai')
var assert = require('assert')
var server = require('../..')
var should = chai.should()
var expect = chai.expect
var c = require('../../common/Const')
var g = require('../../common/Global')
var datasets_params = require('../../controllers/v2/datasets_params')



describe('Test TDD - Core functionality', function() {

  it('should get global dataset', function(){

    let ds03 = g.getDatasetXParamas(c.DS_NAME.DS03)
    expect(ds03.length).equals(1)
    expect(ds03[0].name).equals('Charles River')

  })

  it('should switch internal dataset at runtime', function(){

    let rc = (country, s) => s.replace('{{country}}', country)
    let rs = (sector,  s) => s.replace('{{sector}}',  sector)

    let ds05 = g.getDatasetXParamas(c.DS_NAME.DS05_a)
    expect(ds05.length).equals(1)
    expect(ds05[0].datasets.length).equals(0)

    let country = c.DS_TYPE.PARAM_COUNTRY_Argentina
    ds05 = g.getDatasetXParamas(c.DS_NAME.DS05_a, country, undefined)
    expect(ds05[0].datasets.length).equals(4)
    expect(ds05[0].datasets[0]).equals(rc(country, c.DS_NAME.DS05_SECTOR_Electricity))
    expect(ds05[0].datasets[1]).equals(rc(country, c.DS_NAME.DS05_SECTOR_Transportation))
    expect(ds05[0].datasets[2]).equals(rc(country, c.DS_NAME.DS05_SECTOR_Construction))
    expect(ds05[0].datasets[3]).equals(rc(country, c.DS_NAME.DS05_SECTOR_Other))

    let sector = c.DS_TYPE.PARAM_SECTOR_Construction
    ds05 = g.getDatasetXParamas(c.DS_NAME.DS05_a, undefined, sector)
    expect(ds05[0].datasets.length).equals(5)
    expect(ds05[0].datasets[0]).equals(rs(sector,  c.DS_NAME.DS05_COUNTRY_Argentina))
    expect(ds05[0].datasets[1]).equals(rs(sector,  c.DS_NAME.DS05_COUNTRY_Germany))
    expect(ds05[0].datasets[2]).equals(rs(sector,  c.DS_NAME.DS05_COUNTRY_Chile))
    expect(ds05[0].datasets[3]).equals(rs(sector,  c.DS_NAME.DS05_COUNTRY_Bolivia))
    expect(ds05[0].datasets[4]).equals(rs(sector,  c.DS_NAME.DS05_COUNTRY_Brazil))

    // ds05 = g.getDatasetXParamas(c.DS_NAME.DS05_a, c.DS_TYPE.TODOS, undefined)
    // expect(ds05[0].datasets.length).equals(5)

    // ds05 = g.getDatasetXParamas(c.DS_NAME.DS05_a, undefined, c.DS_TYPE.TODOS)
    // expect(ds05[0].datasets.length).equals(4)

  })


  it('should test DS01 - getSeriesDataMultiple()', (done) => {

    // http://localhost:5000/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2016-01-15&to=2016-02-15&type=json_x_amcharts4_multi_series_v3
    let dataset_id = c.DS_NAME.DS01
    let param_id   = c.WATERQ.Temp
    let req = {
      params: { },
       query: {
        from: '2016-01-15',
          to: '2016-02-15', 
        type: 'json_x_amcharts4_multi_series_v3',
      }
    }

    getSeriesDataMultiple(dataset_id, param_id, req, (rtaSerie) => {
      console.log(`getSeriesDataMultiple() rtaSerie.length=${rtaSerie.length}`)
      expect(rtaSerie.series.length).equal(4)
      done()
    })

  })


  it('should test DS02 - getSeriesDataMultiple()', (done) => {

    // http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type=json_x_amcharts4_multi_series_v3
    let dataset_id = c.DS_NAME.DS02
    let param_id   = c.AIRQ.CO2
    let req = {
      params: { },
       query: {
        from: '2015-01-15',
          to: '2015-02-15', 
        type: 'json_x_amcharts4_multi_series_v3',
      }
    }

    getSeriesDataMultiple(dataset_id, param_id, req, (rtaSerie) => {
      console.log(`getSeriesDataMultiple() rtaSerie.length=${rtaSerie.length}`)
      expect(rtaSerie.series.length).equal(1)
      done()
    })

  })


  it('should test DS03 - getSeriesDataMultiple()', (done) => {

    // http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type=json_x_amcharts4_multi_series_v3
    let dataset_id = c.DS_NAME.DS03
    let param_id   = c.WATERQ.Temp
    let req = {
      params: { },
       query: {
        from: '2016-01-15',
          to: '2016-06-15', 
        type: 'json_x_amcharts4_multi_series_v3',
      }
    }

    getSeriesDataMultiple(dataset_id, param_id, req, (rtaSerie) => {
      console.log(`getSeriesDataMultiple() rtaSerie.length=${rtaSerie.length}`)
      expect(rtaSerie.series.length).equal(1)
      done()
    })

  })


  it('should test DS04 - getSeriesDataMultiple()', (done) => {

    // http://localhost:5000/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Temp?type=json_x_amcharts4_multi_series_v3
    let dataset_id = c.DS_NAME.DS04
    let param_id   = c.WATERQ.Temp
    let req = {
      params: { },
       query: {
        from: undefined,
          to: undefined, 
        type: 'json_x_amcharts4_multi_series_v3',
      }
    }

    getSeriesDataMultiple(dataset_id, param_id, req, (rtaSerie) => {
      console.log(`getSeriesDataMultiple() rtaSerie.length=${rtaSerie.length}`)
      expect(rtaSerie.series.length).equal(3)
      done()
    })

  })


  it('should test DS05 - getSeriesDataMultiple()', (done) => {

    // http://localhost:5000/dataset/ ... WIP ... 
    // http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2?type=json_x_amcharts4_multi_series_v3


// TODOS LOS SECTORES ... 
// TODOS LOS PAISES   ... 
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/TODOS?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/TODOS?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/TODOS/c/TODOS?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/TODOS/s/TODOS?type=json_x_amcharts4_multi_series_v3

// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/TRANSPORTE/p/ARGENTINA?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/TRANSPORTE/p/ALEMANIA?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/TRANSPORTE/p/BRASIL?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/TRANSPORTE/p/MEXICO?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/TRANSPORTE/p/CHILE?type=json_x_amcharts4_multi_series_v3

// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/ALEMANIA/s/TRANSPORTE?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/ALEMANIA/s/CONSTRUCCON?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/ALEMANIA/s/ENERGIA?type=json_x_amcharts4_multi_series_v3
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/ALEMANIA/s/OTHERS?type=json_x_amcharts4_multi_series_v3


// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/TODOS?type=json_x_amcharts4_multi_series_v3

    let dataset_id = c.DS_NAME.DS05_a
    let param_id   = c.AIRQ.CO2

    let req = {
      params: {
        country: c.DS_TYPE.PARAM_COUNTRY_Argentina,
//         sector: c.DS_TYPE.PARAM_SECTOR_Electricity,
      },
       query: {
        from: undefined,
          to: undefined, 
        type: 'json_x_amcharts4_multi_series_v3',
      }
    }

    getSeriesDataMultiple(dataset_id, param_id, req, (rtaSerie) => {
      console.log(`getSeriesDataMultiple() rtaSerie.length=${rtaSerie.length}`)
      // expect(rtaSerie.series.length).equal(3)
      done()
    })

  })




})

