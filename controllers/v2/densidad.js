var moment = require('moment')
var c = require('../../common/Const')
var g = require('../../common/Global')



getDensidadFromMongo = (dataset_id, zoom, callback) => {

   console.log(`densidad::getDensidadFromMongo(${dataset_id}, ${zoom}) `)

   let yyyy = {       $year: "$FECHA_HORA" }
   let   mm = {      $month: "$FECHA_HORA" }
   let   dd = { $dayOfMonth: "$FECHA_HORA" } 

   let groupId = (zoom === c.ZOOM_YYYY) ? { year: yyyy }
               : (zoom === c.ZOOM_MM)   ? { year: yyyy, month: mm }
               : (zoom === c.ZOOM_DD)   ? { year: yyyy, month: mm, day: dd }
               : {}
   


   var Dataset = require('../../model/dataset.model')(g.getDatasetId(dataset_id))

   Dataset.aggregate([
      { $group  : {
                   _id :   groupId,
                 count : { $sum: 1 },
            FECHA_HORA : { $first: '$FECHA_HORA' }
       }},
       { $sort  : { FECHA_HORA: 1 }}

   ], (err, docs) => {

      if(err) {
          console.error(err)
          return 
      }

      callback(docs)
      return
      
  })
}



/**
 * @param {*} req 
 * @param {*} res 
 * 
 * 
 * Router    /v2/densidad/:dataset_id/p/:zoom
 * GET       /v2/densidad/MGSET_02_2010_2015/p/YYYY
 */

module.exports.getDensidad = (req, res) => {

  let dataset_id = req.params.dataset_id
  let zoom       = req.params.zoom

  console.log(`densidad::getDensidad(${dataset_id}, ${zoom}) `)

  if (!g.isValidDataset(dataset_id)) {
      res.status(404).send({ error: `dataset ${dataset_id} not found ` })
      return
  }

  if (!g.isValidZoom(zoom)) {
      res.status(404).send({ error: `zoom ${zoom} invalid ` })
      return
  }
  
  getDensidadFromMongo(dataset_id, zoom, (docs) => {
        
      console.log('getDensidadFromMongo callback con [' + docs.length + ' registros] => ' + JSON.stringify(docs))

      res.json(docs)
      // return

  })


//   let rta = {
//      algo: 'algo salio mal'
//   }


//   res.json(rta)
}



