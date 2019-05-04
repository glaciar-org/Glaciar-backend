var moment = require('moment')

var infoV1 = require('../v1/info')

module.exports.infoConsole = (PORT, CORS) => {

      infoV1.infoConsole(PORT, CORS, 'v2')
}


/**
 * GET /v2/info/heroku
 */
module.exports.getInfoHeroku = function (req, res) {

      infoV1.getInfoHeroku(Preq, res)
}


/**
 * GET /v2/info
 */
module.exports.getInfo = function (req, res) {

      const serverPath = req.protocol + '://' + req.get('host') + '/v2'

      console.log('serverPath = ' + serverPath)

      let s = infoV1.getStringInfo(serverPath, 'API Version 2.0')

      res.send(s)
}


