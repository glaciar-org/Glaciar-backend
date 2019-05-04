var c = require('../../common/Const')
var g = require('../../common/Global')
var moment = require('moment');

const APP_NAME= "Glaciar"

module.exports.infoConsole = (PORT, CORS, VERSION = '') => {

      console.log(`infoConsole() process.env.GlaciaR_DATABASE_RELEASE = ${process.env.GlaciaR_DATABASE_RELEASE} `)
      console.log(`infoConsole() process.env.GlaciaR_DATABASE_LIMIT   = ${process.env.GlaciaR_DATABASE_LIMIT} `)      
      
      console.log(`infoConsole() `
                  + ` [isUpsalaMongoDB= ${g.isUpsalaMongoDB()}  `
                  + `  isViedmaMongoDB= ${g.isViedmaMongoDB()}] `)

      console.log('\n\n______________________________________________________')
      console.log('Config from => ')
      console.log('       - LOCAL  =>  ./.env ')
      console.log('       - HEROKU =>  ./.env-heroku.sh ')

      if (g.isViedmaMongoDB()) {

            console.log('process.env.GlaciaR_Viedma_backend__RUNTIME='           + process.env.GlaciaR_Viedma_backend__RUNTIME)
            console.log('process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_BASE=' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_BASE)
            console.log('process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_USER=' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_USER)
            console.log('process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_PASS=' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_PASS)
            console.log('process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_HOST=' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_HOST)

      } else {

            console.log('process.env.GlaciaR_Upsala_backend__RUNTIME='           + process.env.GlaciaR_Upsala_backend__RUNTIME)
            console.log('process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_BASE=' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_BASE)
            console.log('process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_USER=' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_USER)
            console.log('process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_PASS=' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_PASS)
            console.log('process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_HOST=' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_HOST)
      }
      console.log('process.env.PORT=' + process.env.PORT + ' (Heroku Prod)' )
      console.log('______________________________________________________\n\n')

      console.log('upsala-backend: ')
      console.log(' [service ] http://localhost:' + PORT + VERSION + '/hello/:name?                    [GET] ')
      console.log(' [service ] http://localhost:' + PORT + VERSION + '/dataset/:dataset_id             [GET] ')
      console.log(' [service ] http://localhost:' + PORT + VERSION + '/dataset/:dataset_id/p/:param_id [GET] ')
      console.log(' [CORS    ] http://localhost:' + CORS)

      console.log(`${APP_NAME}-backend-backend started! `)

}


/**
 * GET /info/heroku
 */
module.exports.getInfoHeroku = (req, res) => {
      console.log('GET /info/heroku')
      res.json({ envHerokuRuntime: process.env.GlaciaR_Upsala_backend__RUNTIME })
}


module.exports.getStringInfo = getStringInfo = (serverPath, version) => {

      console.log('serverPath = ' + serverPath)

      let s = '\n' 

      let date = new Date() 

      s +=`<h1 style="display: block; width: 100%; text-align: center">${APP_NAME}-backend</h1>`
      s +='<h2 style="display: block; width: 100%; text-align: center">' + version + '</h2>'

      s +=`${APP_NAME}-backend `
      s +='<pre>\n'
      s +='    [Info    ] ' + version + ' \n'
      s +='    [info    ] Last Commit ' + moment(date).format('YYYY-MM-DD T HH:mm:ss (GT: Z)') + ' Branch add-express-routes \n'
      s +='    [Info    ] CI/CD Demo GSP: ' + process.env.GlaciaR_Upsala_backend__RUNTIME + '\n'
      s +='    [Info    ] <a href="' + serverPath + '/info/heroku"  target="dataset">'
      s +=                             serverPath + '/info/heroku'
      s +=                '</a> [GET] { envHerokuRuntime: ' + process.env.GlaciaR_Upsala_backend__RUNTIME + ' }\n'
      s +='</pre>\n'


      s +=`${APP_NAME}-backend `
      s +='<pre>\n'
      s +='    [service ] ' + serverPath + '/hello/:name?                    [GET]\n'
      s +='    [service ] ' + serverPath + '/dataset/:dataset_id             [GET]\n'
      s +='    [service ] ' + serverPath + '/dataset/:dataset_id/p/:param_id [GET]\n'
      s +='    [CORS    ] http://localhost:* \n'
      s +='</pre>\n'



      s +=`${APP_NAME}-Api REST`
      s +='<pre>\n'

      s +='    [Dataset  ] <a href="' + serverPath + '/dataset/"  target="dataset">'
      s +=                              serverPath + '/dataset/'
      s +=                '</a> [GET] Return the list of all dataset \n'

      s +='    [Dataset P] <a href="' + serverPath + '/dataset/MGSET_02_2010_2015"  target="dataset">'
      s +=                              serverPath + '/dataset/:dataset_id'
      s +=                '</a> [GET] Return the Params of on dataset (MGSET_02_2010_2015) \n'

      s +='    [Dataset P] <a href="' + serverPath + '/dataset/MGSET_02_2010_2015/p/AIRQ_CO"  target="dataset">'
      s +=                              serverPath + '/dataset/:dataset_id/p/:id'
      s +=                '</a> [GET] Return the Params of on dataset (MGSET_02_2010_2015) and Param \n'

      s +='</pre>\n'


      let ffold = (txt, url, target = 'dataset') => `    [${txt}] <a target="${target}" 
      href="${serverPath}${url}" 
           >${serverPath}${url}</a> [GET]\n`

      let fft3 = (txt, url, target = 'dataset') => `    [${txt}] <a target="${target}" 
      href="${serverPath}${url}?type=${c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3}" 
           >${serverPath}${url}?type=${c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3}</a> [GET]\n`



      s +=`${APP_NAME}-Api Demo`


      s +='<pre>\n'
      s += ffold('Ej DS01 ', '/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2016-01-15&to=2016-02-15')
      s += ffold('Ej DS01 ', '/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2016-01-15&to=2016-02-15&type='    + c.TYPE_JSON_for_HIGHSTOCK )
      // s += ffold('Ej DS01 ', '/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2016-01-15&to=2016-02-15&type=' + c.TYPE_JSON_for_CHARTJS_M )
      s += ffold('Ej DS01 ', '/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2016-01-15&to=2016-02-15&type=' + c.TYPE_JSON_for_CHARTJS_MULTI_SERIES )
      s += ffold('Ej DS01 ', '/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2016-01-15&to=2016-02-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2 )
      s += ffold('Ej DS01 ', '/v2/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2016-01-15&to=2016-02-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3 )
      s += ffold('Ej DS01 ', '/dataset/MGSET_01_2009_2018/SERIES')
      s +='</pre>\n'

      
      s +='<pre>\n'
      s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15' )
      s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type=' + c.TYPE_JSON_for_HIGHSTOCK )
      // s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type=' + c.TYPE_JSON_for_CHARTJS_M )
      s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type=' + c.TYPE_JSON_for_CHARTJS_MULTI_SERIES )
      s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V1 )
      s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2 )
      s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/p/AIRQ_CO?from=2015-01-15&to=2015-02-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3 )
      s += ffold('Ej DS02 ', '/dataset/MGSET_02_2010_2015/SERIES' )
      s +='</pre>\n'


      s +='<pre>\n'
      s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15' )
      s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type=' + c.TYPE_JSON_for_HIGHSTOCK)
      // s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type=' + c.TYPE_JSON_for_CHARTJS_M)
      s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type=' + c.TYPE_JSON_for_CHARTJS_MULTI_SERIES)
      s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V1)
      s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V2)
      s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/p/WATERQ_pH?from=2016-01-15&to=2016-06-15&type=' + c.TYPE_JSON_for_AMCHARTS4_MULTI_SERIES_V3)
      s += ffold('Ej DS03 ', '/dataset/MGSET_03_2015_2017/SERIES')
      s +='</pre>\n'

      s +='<pre>\n'
      s += fft3('Ej DS04 WIP', '/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Temp' )
      s += fft3('Ej DS04 WIP', '/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_OD' )
      s += fft3('Ej DS04 WIP', '/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Cond' )
      s += fft3('Ej DS04 WIP', '/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Redox' )
      s += fft3('Ej DS04 WIP', '/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Cond25' )
      s += fft3('Ej DS04 WIP', '/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Sal' )
      s +='</pre>\n'



      s +='<pre>\n'

      s += fft3('Ej DS05 ', '/v2/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/s/Electricity')

      s += '\n'
      s += fft3('Ej DS05 ', '/v2/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/Argentina')
      s += fft3('Ej DS05 ', '/v2/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/Germany')
      s += fft3('Ej DS05 ', '/v2/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/Chile')
      s += fft3('Ej DS05 ', '/v2/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/Bolivia')
      s += fft3('Ej DS05 ', '/v2/dataset/MGSET_05_WRI_CAIT_EESS_CO2/p/AIRQ_CO2/c/Brazil')

      s +='</pre>\n'


      let ffdd = (url, txt) => `<a target="densidad" href="${serverPath}${url}">${txt}</a> `



      s +=`${APP_NAME}-Densidad-Api REST (GET /v2/densidad/:dataset_id/p/YYYY)`
      s +='<pre>\n'

      s +='    [Ej DS01 ] '
      s += ffdd('/v2/densidad/MGSET_01_2009_2018/p/YYYY', `${serverPath}/v2/densidad/MGSET_01_2009_2018/p/YYYY`) + ' opciones: '
      s += ffdd('/v2/densidad/MGSET_01_2009_2018/p/YYYY', 'YYYY')
      s += ffdd('/v2/densidad/MGSET_01_2009_2018/p/MM', 'MM')
      s += ffdd('/v2/densidad/MGSET_01_2009_2018/p/DD', 'DD')
      s += '\n'

      s +='    [Ej DS02 ] '
      s += ffdd('/v2/densidad/MGSET_02_2010_2015/p/YYYY', `${serverPath}/v2/densidad/MGSET_02_2010_2015/p/YYYY`) + ' opciones: '
      s += ffdd('/v2/densidad/MGSET_02_2010_2015/p/YYYY', 'YYYY')
      s += ffdd('/v2/densidad/MGSET_02_2010_2015/p/MM', 'MM')
      s += ffdd('/v2/densidad/MGSET_02_2010_2015/p/DD', 'DD')
      s += '\n'

      s +='    [Ej DS03 ] '
      s += ffdd('/v2/densidad/MGSET_03_2015_2017/p/YYYY', `${serverPath}/v2/densidad/MGSET_03_2015_2017/p/YYYY`) + ' opciones: '
      s += ffdd('/v2/densidad/MGSET_03_2015_2017/p/YYYY', 'YYYY')
      s += ffdd('/v2/densidad/MGSET_03_2015_2017/p/MM', 'MM')
      s += ffdd('/v2/densidad/MGSET_03_2015_2017/p/DD', 'DD')
      s += '\n'

      s +='    [Ej DS04 ] '
      s += ffdd('/v2/densidad/MGSET_04_2010_2015/p/YYYY', `${serverPath}/v2/densidad/MGSET_04_2010_2015/p/YYYY`) + ' opciones: '      
      s += ffdd('/v2/densidad/MGSET_04_2010_2015/p/YYYY', 'YYYY')
      s += ffdd('/v2/densidad/MGSET_04_2010_2015/p/MM', 'MM')
      s += ffdd('/v2/densidad/MGSET_04_2010_2015/p/DD', 'DD')
      s += '\n'

      s +='    [Ej DS05 ] '
      s += ffdd('/v2/densidad/MGSET_05_WRI_CAIT_EESS_CO2/p/YYYY', `${serverPath}/v2/densidad/MGSET_05_WRI_CAIT_EESS_CO2/p/YYYY`) + ' opciones: '      
      s += ffdd('/v2/densidad/MGSET_05_WRI_CAIT_EESS_CO2/p/YYYY', 'YYYY')
      s += ffdd('/v2/densidad/MGSET_05_WRI_CAIT_EESS_CO2/p/MM', 'MM')
      s += ffdd('/v2/densidad/MGSET_05_WRI_CAIT_EESS_CO2/p/DD', 'DD')
      s += '\n'

      s +='</pre>\n'

      

      s +=`${APP_NAME}-DB Connection`
      s +='<pre>\n'
      if (g.isViedmaMongoDB()) {
            s +='    [DB BASE  ] ' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_BASE + '\n'
            s +='    [DB USER  ] ******** \n'
            s +='    [DB PASS  ] ******** \n'
            s +='    [DB HOST  ] ' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_INFO + '\n'
            // s +='    [DB BASE  ] ' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_BASE + '\n'
            // s +='    [DB USER  ] ' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_USER + '\n'
            // s +='    [DB PASS  ] ' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_PASS + '\n'
            // s +='    [DB HOST  ] ' + process.env.GlaciaR_Viedma_backend__MONGODB_MLAB_HOST + '\n'
      } else {
            s +='    [DB BASE  ] ' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_BASE + '\n'
            s +='    [DB USER  ] ******** \n'
            s +='    [DB PASS  ] ******** \n'
            s +='    [DB HOST  ] ' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_INFO + '\n'
            s +='    [DB LIMIT ] ' + process.env.GlaciaR_DATABASE_LIMIT + '\n'
            // s +='    [DB BASE  ] ' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_BASE + '\n'
            // s +='    [DB USER  ] ' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_USER + '\n'
            // s +='    [DB PASS  ] ' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_PASS + '\n'
            // s +='    [DB HOST  ] ' + process.env.GlaciaR_Upsala_backend__MONGODB_MLAB_HOST + '\n'
      }
      s +='    \n'
      s +='    [DB LIMIT ] ' + process.env.GlaciaR_DATABASE_LIMIT + '\n'
      s +='    [DB RELSE ] ' + process.env.GlaciaR_DATABASE_RELEASE + '\n'      
      s +='<pre>\n'


      s +=`${APP_NAME}-Hostname`
      s +='<pre>\n'
      s +='    [SERVER   ] ' + serverPath + '\n\n'

      s +='    [LOCAL    ] <a href="http://localhost:5000/"  target="upsala">http://localhost:5000</a>\n'
      s +='    [LOCAL    ] <a href="http://192.168.144:5000/"  target="upsala">http://192.168.144:5000</a>\n'
      s +='    [DESA     ] <a href="https://glaciar-upsala-backend-dev.herokuapp.com/"  target="upsala">https://glaciar-upsala-backend-dev.herokuapp.com/</a>\n'
      s +='    [PROD     ] <a href="https://glaciar-upsala-backend.herokuapp.com/"  target="upsala">https://glaciar-upsala-backend.herokuapp.com/</a>\n'
      
      s +='<pre>\n'

      return s
}



/**
 * GET /info
 */
module.exports.getInfo = (req, res) => {

      const serverPath = req.protocol + '://' + req.get('host');

      let s = getStringInfo(serverPath, 'API Version 1.0')

      res.send(s)
}


