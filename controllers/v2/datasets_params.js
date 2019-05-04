var moment = require('moment')
var c = require('../../common/Const')
var g = require('../../common/Global')

const Json2csvParser = require('json2csv').Parser

var mongoose = require('mongoose').set('debug', true)
mongoose.connect(g.getMongoConfig())

var datasetsWithParamsV1 = require('../v1/datasets_params')

module.exports.getDataset_SERIES = (req, res) => {

    datasetsWithParamsV1.getDataset_SERIES(req, res)

}

getSeriesDataMultiple = (dataset_id, param_id, req, callback) => {

    var country    = req.params.country
    var sector     = req.params.sector

    var queryString = req.query

    console.log(`getSeriesDataMultiple('${dataset_id}', '${param_id}', c/'${country}', s/'${sector}', ${JSON.stringify(queryString)})`)

    var isDS04 = (dataset_id === c.DS_NAME.DS04)
    var isDS05 = (dataset_id === c.DS_NAME.DS05_a || dataset_id === c.DS_NAME.DS05_b)

    var from = queryString.from 
    var to   = queryString.to  
    var type = queryString.type  

    const LIMIT = Number.parseInt(process.env.GlaciaR_DATABASE_LIMIT) || 0
    const SKIP  = 0

    let projection = { _id:0, FECHA_HORA:1, FECHA:1, HORA:1, DATASET:1 }
    let limite = (LIMIT == 0) ? { $skip : 0 } : { $limit : LIMIT }  // $skip:0  "truco" para el agregate
    let SORT  = { FECHA_HORA: 1 } 
    let group = {}
    
    if (type === c.TYPE_JSON_for_CHARTJS_MULTI_SERIES) {

        SORT  = { FECHA_HORA: 1 } 

        group = { $group  :
                   {
                          _id : { DATASET: "$DATASET", PARAM: param_id },
                        gtype : { $first : c.TYPE_JSON_for_CHARTJS_MULTI_SERIES },
                         data : { $push  : '$'+param_id  },
                        label : { $first : 'Serie ' + param_id },
                       labels : { $push  : '$FECHA_HORA'  },
                   } 
               }
    }

    if (type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V1 ||
        type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2 ||
        type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3 ) {

        SORT  = { FECHA_HORA: -1 } 
        
        let labelData = (isDS04) ? '$LABEL' : '$'+param_id  
        group = { $group  :
                    {
                         _id : { FECHA: "$FECHA", HORA: "$HORA", PARAM: param_id },
                       gtype : { $first : type },
                        data : { $push  : labelData  },
                     dataset : { $push  : "$DATASET" },
                       label : { $first : 'Serie ' + param_id },
                      labels : { $push  : '$FECHA_HORA'  },
                  FECHA_HORA : { $first : '$FECHA_HORA'  },
                    } 
                } 
    } 

    if (isDS04) {
        projection['LABEL'] = 1
    } else {
        projection[param_id] = 1
    }

    let query = {}
    
    if (from!=undefined && to!=undefined) {

        let dateFrom = new Date(from)
        let dateTo   = new Date(to)

        console.log(`dateFrom: ${dateFrom}`)
        console.log(`dateTo  : ${dateTo}`)

        /**
         * @param: c.WATERQ
         * puede venir (según el log)
         *    inPatternDS04('WATERQ_Temp')  i.e.: WATERQ.Temp
         *    inPatternDS04('WATERQ_pH')    i.e.: WATERQ.pH  
         *    inPatternDS04('WATERQ_OD')    i.e.: WATERQ.OD   
         *    inPatternDS04('WATERQ_Cond')  i.e.: WATERQ.Cond
         * Nota:
         *     { DATASET: {$in: [ RegExp('WATERQ_Temp$')]} } 
         */
        inPatternDS04 = (param) => {
            console.debug(`inPatternDS04('${param}')`)
            return  (param === c.WATERQ.Temp)  ? [ /WATERQ_Temp$/  ]
                 :  (param === c.WATERQ.pH)    ? [ /WATERQ_pH$/    ]
                 :  (param === c.WATERQ.Redox) ? [ /WATERQ_Redox$/ ]
                 :  (param === c.WATERQ.OD)    ? [ /WATERQ_OD$/    ]
                 :  (param === c.WATERQ.Cond)  ? [ /WATERQ_Cond$/  ]
                 :  [ ]
        }

        query = (isDS04) ? 
            {
                "DATASET": { "$in": inPatternDS04(param_id)  }
            }
            :
            {
                "FECHA_HORA": { "$gt" : dateFrom, "$lt" : dateTo }
            }

        match = (isDS04) ? 
            ` ${JSON.stringify(query)}`
            :
            `{ 
                '$gt': ISODate('${ moment(dateFrom).format('YYYY-MM-DDTHH:mm:ssZ') }'),
                '$lt': ISODate('${ moment(dateTo)  .format('YYYY-MM-DDTHH:mm:ssZ') }')  
             }`

        console.log(`// MongoDB Query
                    db.getCollection('${dataset_id}')
                        .aggregate([
                        { $match   : { ${match} } },
                        ${JSON.stringify(limite)},
                        { $project : ${JSON.stringify(projection)} },
                        ${JSON.stringify(group)},
                        { $sort    : ${JSON.stringify(SORT)} },
                        { $skip    : ${SKIP} }
                        ])
                    `)

    } else {
        console.log(`db.getCollection('${dataset_id}').find( ${JSON.stringify(query)} )`)
    }


    var Dataset = require('../../model/dataset.model')(g.getDatasetId(dataset_id))

    Dataset.aggregate([

        { $match: query },
        limite,
        { $project : projection },
        group,
        { $sort   :  SORT  },
        { $skip   :  SKIP  }

    ], (err, docs) => {
        if(err) {
            console.error(err)
            return 
        }

        if (true) {
            let data   = []
            let labels = []

            let docsJS = JSON.parse(JSON.stringify(docs))

            if (type === c.TYPE_JSON_for_CHARTJS_MULTI_SERIES || 
                type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V1)  {

                console.log('TODO: Procesar: docsJS.length=' + docsJS.length + ' registros')
                
                callback(docsJS)
                return

            } else if (type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2  || 
                       type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3 ) {

                console.log('TODO: Procesar: docsJS.length=' + docsJS.length + ' registros')

                let dsNames = g.getDatestNames(dataset_id, country, sector)

                const dataProvider = []
                
                const mapeos = []
                    
                for (let i = 0; i < dsNames.length; i++) {

                    const m = {
                        "dataset" : dsNames[i],
                        "serie"   : `value${i}`
                    }
                    mapeos.push(m)
                }

                for (let k = docsJS.length-1; k >= 0; k--) {
                    let e = docsJS[k]

                    const obj = {
                        "date" : e.labels[0]
                    }

                    for (let i = 0; i < dsNames.length; i++) {
                    
                        const datasetId = (isDS04) ? dsNames[i].replace('{{param}}',param_id) : dsNames[i]
                        const index = (dsNames.length == 1) ? 0 : e.dataset.indexOf(datasetId)
                        let value = e.data[index]

                        if (Number.isNaN(Number.parseFloat(value))) {
                            value = ''
                        }

                        obj['value' + i] = value
                    }

                    dataProvider.push(obj)
                }

                console.log('JSON dataProvider : ' + JSON.stringify(dataProvider))

                if (type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2) {
                    callback(dataProvider)
                    return                    
                } 
                 
                if (type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3) {
                    let rta = {
                        series : mapeos,
                        data   : dataProvider
                    }
                    callback(rta)
                    return
                }

                
            } else {

                docsJS.forEach(e => {

                    let value = e[param_id] // Number.parseFloat(e[param_id])

                    data.push(value)

                    let ff = moment(e.FECHA_HORA, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')

                    console.log(`FECHA_HORA: [${e.FECHA_HORA}, ${ff}, ${value} ]`)

                    labels.push(ff+'T'+e.HORA)
                })

            }

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

            let rtaSerie = (type === c.TYPE_JSON_for_CHARTJS_M) ? rtaChartJS_multiple 
                         : (type === c.TYPE_JSON_for_CHARTJS_MULTI_SERIES) ? rtaChartJS_multiple_TOTAL
                         : rtaChartJS_simple

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
 * 
 * New!
 *  - /dataset/MGSET_01_2009_2018/p/AIRQ_CO/x/SECTOR?from=2018-03-05&to=2018-03-10&type=json_x_highstock
 *  - /dataset/MGSET_01_2009_2018/p/AIRQ_CO/x/COUNTRY?from=2018-03-05&to=2018-03-10&type=json_x_highstock
 * 
 * from = date 
 * to   = date
 * type = (csv, json, json_x_highstock)
 */
module.exports.getDataset_x_id_Params_x_id = (req, res) => {

    let dataset_id = req.params.dataset_id
    let param_id   = req.params.param_id
    var filter     = req.query.filter
    var country    = req.query.country
    var sector     = req.query.sector

    var from   = req.query.from
    var to     = req.query.to 
    var type   = req.query.type 

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

    if (type === c.TYPE_JSON_for_CHARTJS_M ||
        type === c.TYPE_JSON_for_CHARTJS_MULTI_SERIES || 
        type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V1 || 
        type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2 || 
        type === c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3)  {
        
        getSeriesDataMultiple(dataset_id, param_id, req, (rtaSerie) => {
        
            console.log('getSeriesDataMultiple callback con [' + rtaSerie.length + ' registros] => ' + JSON.stringify(rtaSerie))

            res.json(rtaSerie)

        })

    } else {

        datasetsWithParamsV1.getDataset_x_id_Params_x_id(req, res) 

    }


}

