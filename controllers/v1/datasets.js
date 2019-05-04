var Global = require('../../common/Global')

/**------
 * Observar que este controller no depende de la base de datos
 */

/**
 * 
 * @param {*} req 
 * @param {*} res 
 *  
 * /dataset/
 */
module.exports.getDataset = (req, res) => {

    console.error('GET: /dataset/')

    const serverPath = req.protocol + '://' + req.get('host');

    let mmm = []

    Global.getDatasetId('ALL').forEach(d => {
        mmm.push({
            name: d,
            uri: serverPath + '/dataset/' + d
        })
    })

    let rta = {
        dataset : mmm
    }

    res.json(rta)

}


/**
 * @param {*} req 
 * @param {*} res 
 * 
 * /dataset/:dataset_id
 */
module.exports.getDataset_x_id = (req, res) => {
    
    let dataset_id = req.params.dataset_id

    if (!Global.isValidDataset(dataset_id)) {
        res.status(404).send({ error: `dataset ${dataset_id} not found ` })
        return
    }

    console.error('GET: /dataset/' + dataset_id)

    const serverPath = req.protocol + '://' + req.get('host');

    let rta = {
        dataset : Global.getDatasetXParamas(dataset_id)
    }

    const AIRQ   = rta.dataset[0].params.AIRQ
    const WATERQ = rta.dataset[0].params.WATERQ

    rta.dataset[0].links = [] 

    rta.dataset[0].links.push({
        name : `dataset`,
        uri  : serverPath + `/dataset/${dataset_id}`
    })

    AIRQ.forEach(p =>  rta.dataset[0].links.push({
        name : `"${p}"`,
        uri  : serverPath + `/dataset/${dataset_id}/p/${p}`
    }))

    WATERQ.forEach(p =>  rta.dataset[0].links.push({
        name : `"${p}"`,
        uri  : serverPath + `/dataset/${dataset_id}/p/${p}`
    }))

    res.json(rta)

    
};












/*
    // http://localhost:5000/dataset/MGSET_01_2009_2018/p/AIRQ_CO
    // http://localhost:5000/dataset/MGSET_01_2009_2018/p/AIRQ_NO2

    // http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_CO
    // http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO
    // http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO2

    // http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_Temp?page=1
    // http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_pH
    // http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_OD
    // http://localhost:5000/dataset/MGSET_03_2015_2017/p/WATERQ_OD_pc


    http://localhost:5000/dataset/MGSET_04_2010_2015-PRN/p/WATER_OD
    // http://localhost:5000/dataset/MGSET_04_2010_2015-PRN/p/WATER_OD

    // http://localhost:5000/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2
    // http://localhost:5000/dataset/MGSET_05_WRI_CAIT_ETOT_CO2/p/AIRQ_CO2

    // http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO2?from=2018-04-28&to=2018-05-13
       

    db.getCollection('MGSET_01_2009_2018').find({
        FECHA_HORA: { "$eq" : new Date("2009-10-01T14:00:00.000Z") }
    })

    db.getCollection('MGSET_01_2009_2018').find({
        FECHA_HORA: { "$eq" : ISODate("2009-10-01T14:00:00.000Z") }
    })

    db.getCollection('MGSET_01_2009_2018').find({
        FECHA_HORA: { "$eq" : ISODate("2009-10-01T14:00:00.000Z") }
    })

    db.getCollection('MGSET_01_2009_2018').find({
        FECHA_HORA: { "$gt" : ISODate("2009-10-01"),
                      "$lt" : ISODate("2009-10-03"), }
    })

    http://localhost:5000/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2009-10-01&to=2009-10-03
    http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2012-10-01&to=2014-10-01


    db.getCollection('MGSET_02_2010_2015').find({
        FECHA_HORA: { "$gt" : ISODate("2012-10-01"),
                      "$lt" : ISODate("2014-10-03"), }
    })
    
    // ACA HAY DATOS!
    http://localhost:5000/dataset/MGSET_02_2010_2015/p/AIRQ_NO?from=2013-10-01&to=2014-10-01
    db.getCollection('MGSET_02_2010_2015').find({
        FECHA_HORA: { "$gt" : ISODate("2013-10-01"),
                      "$lt" : ISODate("2014-10-03"), }
    })

    cat /usr/local/etc/mongod.conf
    systemLog:
        destination: file
        path: /usr/local/var/log/mongodb/mongo.log
        logAppend: true
    storage:
        dbPath: /usr/local/var/mongodb
        net:
        bindIp: 127.0.0.1
    * 
    */
