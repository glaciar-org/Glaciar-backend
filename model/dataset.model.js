var mongoose = require('mongoose').set('debug', true)

var DatasetSchema = mongoose.Schema({

  FECHA_HORA: {type: Date},
  FECHA: {type: String},
  HORA: {type: String},

  AIRQ_CO: {type: String},
  AIRQ_CO2: {type: String},
  AIRQ_NO: {type: String},
  AIRQ_NO2: {type: String},

  WATERQ_Temp: {type: String},
  WATERQ_pH: {type: String},
  WATERQ_OD: {type: String},
  WATERQ_OD_pc: {type: String},
  WATERQ_Cond: {type: String},

  date: {type: Date, required: true, default: Date.now}

}, 

// { collection: 'MGSET_01_2009_2017' }

);




// const DS01   = 'MGSET_01_2009_2018'
// const DS02   = 'MGSET_02_2010_2015'
// const DS03   = 'MGSET_03_2015_2017'
// const DS04   = 'MGSET_04_2010_2015-PRN'
// const DS05_a = 'MGSET_05_WRI_CAIT_EESS_CO2'
// const DS05_b = 'MGSET_05_WRI_CAIT_ETOT_CO2'



var getDataset = function(DATASET_ID) {

  console.log(`getDataset(${DATASET_ID}).`)

  var Dataset = {}

  Dataset[DATASET_ID] = mongoose.model('Dataset', DatasetSchema, DATASET_ID );

  // https://github.com/cklanac/bellyful-api
  // let Dataset = mongoose.models.Dataset || mongoose.model('Dataset', DatasetSchema, DATASET_ID );

  return Dataset[DATASET_ID];

};



module.exports = getDataset;


// http://localhost:5000/dataset/MGSET_01_2009_2018/p/AIRQ_CO
// http://localhost:5000/dataset/MGSET_01_2009_2018/p/AIRQ_NO2

// http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_CO
// http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO
// http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO2

// http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_Temp
// http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_pH
// http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_OD
// http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_OD_pc

// http://localhost:5000/dataset/MGSET_04_2010_2015-PRN/p/WATER_OD

// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2
// http://localhost:5000/dataset/MGSET_05_WRI_CAIT_ETOT_CO2/p/AIRQ_CO2




//---------------


// http://localhost:5000/dataset/MGSET_01_2009_2018/p/AIRQ_CO

// db.getCollection('MGSET_01_2009_2018').find({},{ "_id" : 0 })

// /* 1 */
// {
//   "FECHA" : "01/10/2009",
//   "HORA" : 14,
//   "AIRQ_CO" : "",
//   "AIRQ_NO2" : "",
//   "DATASET" : "MGSET_01_2009_2018_BO"
// }

// /* 2 */
// {
//   "FECHA" : "01/10/2009",
//   "HORA" : 18,
//   "AIRQ_CO" : 0.11,
//   "AIRQ_NO2" : 25,
//   "DATASET" : "MGSET_01_2009_2018_BO"
// }

// ... 

// etc 
// ...

// [{"data":["0.16","0.11","","0.14","0.15","0.14","0.16","0.16","0.16","0.16","0.12","0.19","0.21","0.23","0.25","0.26","0.27","0.33","0.45","0.64","0.81","0.82","0.07","0.06","0.1","0.78","0.08","0.09","0.11","0.11","0.13","0.16","0.18","0.18","0.18","0.17","0.16","0.15","0.13","0.1","0.08","0.08","0.1","0.14","0.18","0.2","0.21","","",""],"labels":["01/10/2009T15","01/10/2009T18","01/10/2009T14","01/10/2009T16","01/10/2009T20","01/10/2009T19","01/10/2009T21","01/10/2009T22","01/10/2009T23","01/10/2009T24","01/10/2009T17","02/10/2009T1","02/10/2009T2","02/10/2009T3","02/10/2009T4","02/10/2009T5","02/10/2009T6","02/10/2009T7","02/10/2009T8","02/10/2009T9","02/10/2009T11","02/10/2009T12","04/10/2009T14","04/10/2009T13","04/10/2009T17","02/10/2009T10","04/10/2009T15","04/10/2009T16","04/10/2009T18","04/10/2009T19","04/10/2009T20","04/10/2009T21","04/10/2009T22","04/10/2009T23","04/10/2009T24","05/10/2009T1","05/10/2009T2","05/10/2009T3","05/10/2009T4","05/10/2009T5","05/10/2009T6","05/10/2009T7","05/10/2009T8","05/10/2009T9","05/10/2009T10","05/10/2009T11","05/10/2009T12","05/10/2009T13","05/10/2009T14","05/10/2009T15"],"label":"Serie AIRQ_CO"}]

// [
// {"data":["0.16","0.11","","0.14","0.15","0.14","0.16","0.16","0.16","0.16","0.12","0.19","0.21","0.23","0.25","0.26","0.27","0.33","0.45","0.64","0.81","0.82","0.07","0.06","0.1","0.78","0.08","0.09","0.11","0.11","0.13","0.16","0.18","0.18","0.18","0.17","0.16","0.15","0.13","0.1","0.08","0.08","0.1","0.14","0.18","0.2","0.21","","",""],
// "labels":["01/10/2009T15","01/10/2009T18","01/10/2009T14","01/10/2009T16","01/10/2009T20","01/10/2009T19","01/10/2009T21","01/10/2009T22","01/10/2009T23","01/10/2009T24","01/10/2009T17","02/10/2009T1","02/10/2009T2","02/10/2009T3","02/10/2009T4","02/10/2009T5","02/10/2009T6","02/10/2009T7","02/10/2009T8","02/10/2009T9","02/10/2009T11","02/10/2009T12","04/10/2009T14","04/10/2009T13","04/10/2009T17","02/10/2009T10","04/10/2009T15","04/10/2009T16","04/10/2009T18","04/10/2009T19","04/10/2009T20","04/10/2009T21","04/10/2009T22","04/10/2009T23","04/10/2009T24","05/10/2009T1","05/10/2009T2","05/10/2009T3","05/10/2009T4","05/10/2009T5","05/10/2009T6","05/10/2009T7","05/10/2009T8","05/10/2009T9","05/10/2009T10","05/10/2009T11","05/10/2009T12","05/10/2009T13","05/10/2009T14","05/10/2009T15"],
// "label":"Serie AIRQ_CO"
// }
// ]