var c = require('./Const')

const getDatasetId = (dataset_id) => {

    if (dataset_id === 'ALL') return [ c.DS_NAME.DS01, c.DS_NAME.DS02,   c.DS_NAME.DS03, 
                                       c.DS_NAME.DS04, c.DS_NAME.DS05_a, c.DS_NAME.DS05_b ]
    if (dataset_id === 'DS01')  return c.DS_NAME.DS01
    if (dataset_id === 'DS02')  return c.DS_NAME.DS02
    if (dataset_id === 'DS03')  return c.DS_NAME.DS03
    if (dataset_id === 'DS04')  return c.DS_NAME.DS04
    if (dataset_id === 'DS05a') return c.DS_NAME.DS05_a
    if (dataset_id === 'DS05b') return c.DS_NAME.DS05_b

    return dataset_id

}

const DATABASE_RELEASE_VIEDMA = 'GlaciaR_VIEDMA_MONGODB' 
const DATABASE_RELEASE_UPSALA = 'GlaciaR_UPSALA_MONGODB'

module.exports.isViedmaMongoDB = isViedmaMongoDB = () => (process.env.GlaciaR_DATABASE_RELEASE || DATABASE_RELEASE_UPSALA) === DATABASE_RELEASE_VIEDMA
module.exports.isUpsalaMongoDB = isUpsalaMongoDB = () => (process.env.GlaciaR_DATABASE_RELEASE || DATABASE_RELEASE_UPSALA) === DATABASE_RELEASE_UPSALA



const getMongoConfig = () => {

  console.log(`infoConsole() `
            + ` [isUpsalaMongoDB= ${isUpsalaMongoDB()}  `
            + `  isViedmaMongoDB= ${isViedmaMongoDB()}] `)

  if (isViedmaMongoDB()) {

    const user = process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_USER
    const pass = process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_PASS
    
    const mongoConfig = (user && pass)
           ? 'mongodb://'+user+':'+pass+'@'
                +process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_HOST+'/'
                +process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_BASE
           : 'mongodb://'
                +process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_HOST+'/'
                +process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_BASE
  
  
    console.log('getMongoConfig()= ', mongoConfig)
  
    return mongoConfig

  }

  const user = process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_USER
  const pass = process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_PASS
  
  const mongoConfig = (user && pass)
          ? 'mongodb://'+user+':'+pass+'@'
              +process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_HOST+'/'
              +process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_BASE
          : 'mongodb://'
              +process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_HOST+'/'
              +process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_BASE


  console.log('getMongoConfig()= ', mongoConfig)

  return mongoConfig

}


/**
 * @param {*} dataset_id 
 * true: si el dataset existe
 */
const isValidDataset = (dataset_id) =>  getDatasetXParamas(dataset_id).length != 0 
const isValidParam = (dataset_id, param_id) => isValidDataset(dataset_id) && 
                                  (getDatasetXParamas(dataset_id)[0].params.AIRQ.indexOf(param_id) != -1 || 
                                   getDatasetXParamas(dataset_id)[0].params.WATERQ.indexOf(param_id) != -1 )

const getDatestNames = (dataset_id, country, sector) => {
  let ds = getDatasetXParamas(dataset_id, country, sector)[0]

  return (ds.datasets.length > 0) ? ds.datasets : [ ds.dataset_id ]
}

                                   // -- [Format Dates] ----
// Recordar utilizar moment.utc para que no me cambie un día ...
module.exports.ff1_Date = ff1_Date = (date) => moment.utc(date).format('DD-MM-YYYY')
module.exports.ff2_Date = ff2_Date = (date) => moment.utc(date).format('YYYY-MM-DD')
module.exports.ff3_Date = ff3_Date = (date) => moment.utc(date).format('YYYYMMDD')
module.exports.ff4_Date = ff4_Date = (date) => moment.utc(date).format('DD/MM/YYYY')

const isValidZoom = (zz) => zz === c.ZOOM_YYYY || zz === c.ZOOM_MM || zz === c.ZOOM_DD


const getDatasetXParamas = (dataset_id, country, sector) => {

  console.debug(`getDatasetXParamas(${dataset_id}, ${country}, ${sector})`)

  const rta =
  [
    {
      id: '1', code: 'DS01', dataset_id: c.DS_NAME.DS01, name: 'Buenos Aires',  desc: 'Buenos Aires Data',
      location: { latitude: -34.599722, longitude: -58.381944 },
      params: {   AIRQ: [c.AIRQ.CO, c.AIRQ.NO2],
                WATERQ: [ ] },
      dates: { minDate: new Date('2009-10-01T13:00:00.000Z'),
               maxDate: new Date('2018-03-31T23:00:00.000Z') },
      datasets: [ c.DS_NAME.DS01_BO, c.DS_NAME.DS01_PA, c.DS_NAME.DS01_CO, c.DS_NAME.DS01_CE ]
    },
    {
      id: '2', code: 'DS02', dataset_id: c.DS_NAME.DS02, name: 'Bahía Blanca',  desc: 'Gobierno Abierto Bahía Blanca',
      location: { latitude: -38.7167, longitude: -62.2833 },
      params: {   AIRQ: [c.AIRQ.CO, c.AIRQ.NO, c.AIRQ.NO2],
                WATERQ: [ ] },
      dates: { minDate: new Date('2010-01-01T00:00:00.000Z'),
               maxDate: new Date('2015-12-31T23:00:00.000Z') },
      datasets: []
    },
    {
      id: '3', code: 'DS03', dataset_id: c.DS_NAME.DS03, name: 'Charles River', desc: 'Water Quality Data for the Lower Charles River',
      location: { latitude: 42.367893, longitude: -71.071129 },
      params: {   AIRQ: [ ],
                WATERQ: [c.WATERQ.Temp, c.WATERQ.pH, c.WATERQ.OD] },
      dates: { minDate: new Date('2015-05-13T12:00:00.000Z'),
               maxDate: new Date('2018-08-14T22:15:00.000Z') },
      datasets: []
    },
    {
      id: '4', code: 'DS04', dataset_id: c.DS_NAME.DS04, name: 'BDHN',  desc: 'Base de Datos Hidrológica Integrada',
      location: { latitude: -31.8016111, longitude: -59.126 },
      params: {   AIRQ: [c.AIRQ.NO, c.AIRQ.NO2],
                WATERQ: [c.WATERQ.Temp, c.WATERQ.pH, c.WATERQ.OD, c.WATERQ.Cond] },
      dates: { minDate: new Date('2011-02-22T01:01:00.000Z'),
               maxDate: new Date('2017-03-03T09:41:00.000Z') },
      datasets: [ c.DS_NAME.DS04_PRN, c.DS_NAME.DS04_GGY, c.DS_NAME.DS04_PGY ]
    },
    {
      id: '5', code: 'DS05', dataset_id: c.DS_NAME.DS05_a, name: 'WRI',  desc: 'World Resources Institute',
      location: { latitude: 4, longitude: -72.0000000 },
      params: {   AIRQ: [c.AIRQ.CO, c.AIRQ.CO2, c.AIRQ.NO],
                WATERQ: [c.WATERQ.Temp, c.WATERQ.pH, c.WATERQ.OD] },
      dates: { minDate: new Date('1850-01-01T00:00:00.000Z'),
               maxDate: new Date('2012-01-01T00:00:00.000Z') },
      datasets: [],
    }
  ]

  const fin = (dataset_id === undefined) ?  rta : rta.filter(e => e.dataset_id === dataset_id)
  
  let isDS05 = (dataset_id === c.DS_NAME.DS05_a || dataset_id === c.DS_NAME.DS05_b)
  if (isDS05) {
      if (country !== undefined) { fin[0].datasets = getDatasets_x_sector(country)  }
      if (sector  !== undefined) { fin[0].datasets = datasets_x_country(sector)     }
  }

  return fin
}

let rc = (country, s) => s.replace('{{country}}', country)
let rs = (sector,  s) => s.replace('{{sector}}',  sector)

const getDatasets_x_sector = (country) => [ 
  rc(country, c.DS_NAME.DS05_SECTOR_Electricity),
  rc(country, c.DS_NAME.DS05_SECTOR_Transportation),
  rc(country, c.DS_NAME.DS05_SECTOR_Construction),
  rc(country, c.DS_NAME.DS05_SECTOR_Other),
]

const datasets_x_country = (sector) => [ 
  rs(sector, c.DS_NAME.DS05_COUNTRY_Argentina),
  rs(sector, c.DS_NAME.DS05_COUNTRY_Germany),
  rs(sector, c.DS_NAME.DS05_COUNTRY_Chile),
  rs(sector, c.DS_NAME.DS05_COUNTRY_Bolivia),
  rs(sector, c.DS_NAME.DS05_COUNTRY_Brazil),
]

module.exports.getDatasetId = getDatasetId
module.exports.isValidParam = isValidParam
module.exports.isValidDataset = isValidDataset
module.exports.getDatasetXParamas = getDatasetXParamas
module.exports.getDatestNames = getDatestNames
module.exports.getMongoConfig = getMongoConfig
module.exports.isValidZoom = isValidZoom


