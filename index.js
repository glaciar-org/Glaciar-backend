var express = require('express')
var bodyParser = require('body-parser')
var dotenv = require('dotenv')
var moment = require('moment')
var stdio = require('stdio')
var cors = require('cors')
var app = express()

// require('dotenv').config({path: '~/.env'})
// require('dotenv').config({path: './.env'})
// require('dotenv').config({path: '.env'})

// USO ROUTER
var router = express.Router();

var Global = require('./common/Global')

const ENV = Global.getEnvFile();

require('dotenv').config({path: ENV})

var infoV1 = require('./controllers/v1/info')
var infoV2 = require('./controllers/v2/info')
var densiad = require('./controllers/v2/densidad')
var datasets = require('./controllers/v1/datasets')
var datasetsWithParamsV1 = require('./controllers/v1/datasets_params')
var datasetsWithParamsV2 = require('./controllers/v2/datasets_params')


const PORT  = process.env.PORT  || 5000
const CORS  = '*'

if (CORS === '*') {

    // // https://github.com/expressjs/cors/issues/134
    // // https://github.com/expressjs/cors

    // var app = express();
    // var corsOptions = {
    //     origin: 'http://localhost:4305',
    //     methods: ['GET'],
    //     allowedHeaders: ['Origin','X-Requested-With','contentType','Content-Type','Accept','Authorization'],
    //     credentials: true,
    //     optionsSuccessStatus: 200
    // }
    // app.use(cors(corsOptions));
    
    app.use(cors())

    router.use(cors())
}

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});


/**
* Static Data
* http://localhost:5000/static/data/DS02/DS02_BB_CO_t1.json
*/
app.use('/static', express.static(__dirname + '/static'));


/**
* GET /dataset/
* GET /dataset/:dataset_id
*/
router.get('/', infoV1.getInfo)
router.get('/info', infoV1.getInfo)
router.get('/info/heroku', infoV1.getInfoHeroku)
router.get('/dataset/', datasets.getDataset) 
router.get('/dataset/:dataset_id', datasets.getDataset_x_id) 
// router.get('/dataset/:dataset_id/p/:param_id', datasetsWithParamsV1.getDataset_x_id_Params_x_id)  // DEPRECADO!
router.get('/dataset/:dataset_id/p/:param_id', datasetsWithParamsV2.getDataset_x_id_Params_x_id)     
router.get('/dataset/:dataset_id/p/:param_id/c/:country',            datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/dataset/:dataset_id/p/:param_id/c/:country/s/:sector',  datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/dataset/:dataset_id/p/:param_id/s/:sector' ,            datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/dataset/:dataset_id/p/:param_id/s/:sector/c/:country' , datasetsWithParamsV2.getDataset_x_id_Params_x_id) 
router.get('/dataset/:dataset_id/SERIES', datasetsWithParamsV1.getDataset_SERIES)


/**
* API V1
*/
router.get('/v1/', infoV1.getInfo)
router.get('/v1/info', infoV1.getInfo)
router.get('/v1/info/heroku', infoV1.getInfoHeroku)
router.get('/v1/dataset/', datasets.getDataset) 
router.get('/v1/dataset/:dataset_id', datasets.getDataset_x_id) 
// router.get('/v1/dataset/:dataset_id/p/:param_id', datasetsWithParamsV1.getDataset_x_id_Params_x_id)   // DEPRECADO!
router.get('/v1/dataset/:dataset_id/p/:param_id', datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v1/dataset/:dataset_id/p/:param_id/c/:country',            datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v1/dataset/:dataset_id/p/:param_id/c/:country/s/:sector',  datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v1/dataset/:dataset_id/p/:param_id/s/:sector' ,            datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v1/dataset/:dataset_id/p/:param_id/s/:sector/c/:country' , datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v1/dataset/:dataset_id/SERIES', datasetsWithParamsV1.getDataset_SERIES)


/**
* API V2
*/
router.get('/v2/', infoV2.getInfo)
router.get('/v2/info', infoV2.getInfo)
router.get('/v2/info/heroku', infoV2.getInfoHeroku)
router.get('/v2/dataset/', datasets.getDataset) 
router.get('/v2/dataset/:dataset_id', datasets.getDataset_x_id) 
router.get('/v2/dataset/:dataset_id/p/:param_id', datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v2/dataset/:dataset_id/p/:param_id/c/:country',            datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v2/dataset/:dataset_id/p/:param_id/c/:country/s/:sector',  datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v2/dataset/:dataset_id/p/:param_id/s/:sector' ,            datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v2/dataset/:dataset_id/p/:param_id/s/:sector/c/:country' , datasetsWithParamsV2.getDataset_x_id_Params_x_id)
router.get('/v2/dataset/:dataset_id/SERIES', datasetsWithParamsV2.getDataset_SERIES)


/**
* API Cantidad
*/
router.get('/v2/densidad/:dataset_id/p/:zoom', densiad.getDensidad)

/**
 * Method Not Allowed
 */
router.post('/*', (req, res) => { res.status(405).send({ error: ` Method POST Not Allowed.` }) })
router.put('/*', (req, res) => { res.status(405).send({ error: ` Method PUT Not Allowed.` }) })
router.patch('/*', (req, res) => { res.status(405).send({ error: ` Method PATCH Not Allowed.` }) })
router.delete('/*', (req, res) => { res.status(405).send({ error: ` Method DELETE Not Allowed.` }) })

app.use('/', router)



// var ops = stdio.getopt({
//     'port' : {key: 'p', args: 1,  description: 'Listening PORT' },
//     'env'  : {key: 'e', args: 1,  description: 'Environmet (PROD/DESA/LOCAL/DOCKER)' }
// });


// Heroku dynamically assigns your app a port in "process.env.PORT"
// See Heroku docs on Node.js: https://devcenter.heroku.com/articles/getting-started-with-nodejs





infoV1.infoConsole(PORT, CORS)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


var mongoose = require('mongoose').set('debug', true)
mongoose.connect(Global.getMongoConfig(), function(err, res) {
    if(err) {
        console.log('Error connecting to the database. ' + err);
    } else {
        console.log('Connected to Database ... ');
    }
});



var db = mongoose.connection
mongoose.Promise = global.Promise


db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {

    console.log('Connected to MongoDB ...')

    // Based ON: For TDD
    // http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
    if(!module.parent){ 
        app.listen(PORT, '0.0.0.0', function () {
            console.log('GlaciaR-Upsala-backend listening on port: ' + PORT)
         })
     }

})


module.exports = app

