var moment = require('moment')
var c = require('../../common/Const')
var g = require('../../common/Global')

const Json2csvParser = require('json2csv').Parser

var mongoose = require('mongoose').set('debug', true)
mongoose.connect(g.getMongoConfig())

/**------
 * Observar que este controller SI depende de la base de datos
 */

var db = mongoose.connection
mongoose.Promise = global.Promise



const FECHA_HORA = 'FECHA_HORA'
const FECHA = 'FECHA'
const HORA = 'HORA'
const DATASET = 'DATASET'

getSeriesID = (dataset_id, callback) => {

    console.log('getSeriesID(' + dataset_id + ') Inicio ... ')

    var Dataset = require('../../model/dataset.model')(g.getDatasetId(dataset_id))

    Dataset.find().distinct('DATASET', (err, seriesID) => {

        if(err) {
            console.error(err)
            return 
        }

        callback(seriesID)
    })
}

module.exports.getDataset_SERIES = (req, res) => {

    let dataset_id = req.params.dataset_id

    getSeriesID(dataset_id, (seriesID) => {
        console.log('Despues del callback de getSeriesID con ' + JSON.stringify(seriesID))

        res.send(JSON.stringify(seriesID))
    })
}



getSeriesData = (dataset_id, param_id, queryString, callback) => {

    console.log(`getSeriesData('${dataset_id}', '${param_id}', ${JSON.stringify(queryString)})`)

    var from = queryString.from 
    var to   = queryString.to  
    var type = queryString.type  

    const LIMIT = Number.parseInt(process.env.GlaciaR_DATABASE_LIMIT) || 0
    const SORT  = { FECHA_HORA: 1 } 
    const SKIP  = 0

    // let aggrega    = { skip: SKIP, limit: LIMIT, sort: SORT }
    let aggrega = {} 
    
    aggrega['skip'] = SKIP
    aggrega['sort'] = SORT

    if (LIMIT>0) {
        aggrega['limit'] = LIMIT
    }


    let projection = { _id:0, FECHA_HORA:1, FECHA:1, HORA:1, DATASET:1 }
    
    projection[param_id] = 1

    let query = {}
    
    if (from!=undefined && to!=undefined) {

        let dateFrom = new Date(from)
        let dateTo   = new Date(to)

        console.log("dateFrom="+dateFrom)
        console.log("dateTo="+dateTo)

        query = {
            "FECHA_HORA": {
                "$gt" : dateFrom,
                "$lt" : dateTo
            }
        }

        console.log(`db.getCollection('${dataset_id}')
                         .find({ FECHA_HORA:
                            { '$gt': ISODate('${ moment(dateFrom).format('YYYY-MM-DDTHH:mm:ssZ') }'),
                              '$lt': ISODate('${ moment(dateTo)  .format('YYYY-MM-DDTHH:mm:ssZ') }') } 
                            },
                            ${JSON.stringify(projection)})
                         .limit(${LIMIT})
                         .sort(${JSON.stringify(SORT)})
                         .skip(${SKIP})`)

    } else {
        console.log(`db.getCollection('${dataset_id}').find( ${query} )`)
    }


    var Dataset = require('../../model/dataset.model')(g.getDatasetId(dataset_id))

    Dataset.find(query, projection, aggrega, (err, docs) => {
        if(err) {
            console.error(err)
            return 
        }

        let docsJS = JSON.parse(JSON.stringify(docs))

        if (type === c.TYPE_CSV) {

            callback(docsJS)

        } else if (type === c.TYPE_JSON_for_HIGHSTOCK) {

            let data = []

            docsJS.forEach(e => {

                let dd        = moment(e.FECHA_HORA, 'YYYY-MM-DD HH:mm:ss')
                let ddf1      = moment(e.FECHA_HORA, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
                let timestamp = moment(e.FECHA_HORA, 'YYYY-MM-DDTHH:mm:ss.sssZ').toDate().getTime()

                console.log("FECHA_HORA: [" + e.FECHA_HORA + ", dd=" + dd + ", ddf1=" + ddf1 + ", timestamp=" + timestamp + "]")

                let dateAndValue = []

                // dateAndValue.push(dd)                            // date
                // dateAndValue.push(e.FECHA_HORA)                  // date
                dateAndValue.push(timestamp)                        // timestamp
                dateAndValue.push(Number.parseFloat(e[param_id]))   // value
                
                data.push(dateAndValue)

            })

            let rtaSerie = {
                    gtype : c.TYPE_JSON_for_HIGHSTOCK,
                    label : 'Serie ' + param_id,
                    data  : data
            }

            console.log('json_x_highstock: ' + JSON.stringify(rtaSerie))

            // res.json(rtaSerie)
            callback(rtaSerie)


                            /*
                                json_x_highstock: 
                                    {"gtype":"json_x_highstock",
                                    "label":"Serie AIRQ_CO",
                                    "data":[
                                        [1520211600000, 0.55],
                                        [1520269200000, 0.38],
                                        [1520290800000, 0.32]
                                    ]}
                            */

        } else {

            let data   = []
            let labels = []
    
            docsJS.forEach(e => {

                let value = e[param_id] // Number.parseFloat(e[param_id])

                data.push(value)

                let ff = moment(e.FECHA_HORA, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')

                console.log(`FECHA_HORA: [${e.FECHA_HORA}, ${ff}, ${value} ]`)

                labels.push(ff+'T'+e.HORA)
            })

            let rtaChartJS_simple = [
                {
                    gtype   : c.TYPE_JSON,
                    label   : 'Serie ' + param_id,
                    data    : data,
                    labels  : labels,
                }
            ]

            let rtaChartJS_multiple = {
                gtype   : c.TYPE_JSON_for_CHARTJS_M,
                labels  : labels,
                datasets: [{
                    data    : data,
                    label   : 'Serie 0 ' + param_id
                }]
            }

            // let rtaNg2Charts_multiple = {
            //     gtype : c.TYPE_JSON_for_NG2_CHARTS_M,

            // }

            // TYPE_JSON_for_NG2_CHARTS_M
            // public lineChartData:Array<any> = [
            //     {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
            //     {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
            //     {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
            //   ]
            //   public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
            
            // TYPE_JSON_for_CHARTJS_M
            // var data = {
            //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            //     datasets: [{
            //         label: "Stock A",
            //         fill: false,
            //         lineTension: 0.1,
            //         data: [65, 59, 80, 81, 56, 55, 40, ,60,55,30,78]
            //       }, {
            //         label: "Stock B",
            //         fill: true,
            //         data: [10, 20, 60, 95, 64, 78, 90,,70,40,70,89]
            //       }  ]
            //   }


            let rtaSerie = (type === c.TYPE_JSON_for_CHARTJS_M) ? rtaChartJS_multiple : rtaChartJS_simple

            // res.json(rtaSerie)
            callback(rtaSerie)
        }

    })
}

/**
 * @param {*} req 
 * @param {*} res 
 * 
 * /dataset/:dataset_id/p/:param_id
 * 
 * Example:
 * /dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2018-03-05&to=2018-03-10&type=csv
 * /dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2018-03-05&to=2018-03-10&type=json
 * /dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2018-03-05&to=2018-03-10&type=json_x_highstock
 * 
 * from = date 
 * to   = date
 * type = (csv, json, json_x_highstock)
 */
module.exports.getDataset_x_id_Params_x_id = (req, res) => {

    let dataset_id = req.params.dataset_id
    let param_id   = req.params.param_id

    var from = req.query.from 
    var to   = req.query.to  
    var type = req.query.type  

    if (!g.isValidDataset(dataset_id)) {
        res.status(404).send({ error: `dataset ${dataset_id} not found ` })
        return
    }

    if (!g.isValidParam(dataset_id, param_id)) {
        res.status(404).send({ error: `param ${param_id} for dataset ${dataset_id} not found ` })
        return
    }

    console.log('>dataset_id    : ' + dataset_id)
    console.log('>param_id      : ' + param_id)
    console.log('>date[from-to] : [' + from + ', ' + to + ']')
    console.log('>type          :  ' + type)

    getSeriesData(dataset_id, param_id, req.query, (rtaSerie) => {

        console.log('Despues del callback de getSeriesData con ' + JSON.stringify(rtaSerie))

        if (type === c.TYPE_CSV) {

            // Samples from:
            // https://www.npmjs.com/package/json2csv
            const fields = [ FECHA_HORA, FECHA, HORA, param_id, DATASET ]

            const json2csvParser = new Json2csvParser({ fields })
            const csv = json2csvParser.parse(rtaSerie)

            res.setHeader('Content-Type', 'text/csv')
            res.status(200).send(csv)

        } else {

            res.json(rtaSerie)
        }
    }) 


}


// Chart JS ver opciones de ejemplo:
// https://codepen.io/k3no/pen/pbYGVa

