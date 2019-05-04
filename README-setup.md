# GlaciaR-Upsala-backend

VIA Upsala backend (dev)

## Table of contents

<details>

<!-- toc -->

- [1. Usage](#1-Usage)
  * [1.1 Server Run            ](#1.1.-server-run)
  * [1.2 Env config            ](#1.2.-env config)
  * [1.3 Heroku Server         ](#1.3.-heroku server)
  * [1.4 Docker Build and Use  ](#1.4.-docker-build-and-use)
  * [1.5 Mongo DB              ](#1.5.-mongo-db)
  * [1.6 Linux Comands         ](#1.6.-linux)

- [3. TODO and Next Steps      ](#3.-TODO-and-Next-Steps)
- [4. Enhacement               ](#4.-Enhacement)
- [5. Resources and References ](#5.-Resources-and-References)

<!-- tocstop -->

</details>

## Usage

## 1. Usage

### 1.1. Server Run

Run `node index.js` and navigate to `http://localhost:5000/` 

´´´bash
node    index.js --help

node    index.js --port 4444 --cors 8001
nodemon index.js --port 4444 --cors 8001
´´´


### 1.2 Env config 

Env config:

https://www.npmjs.com/package/dotenv


# RECORDAR QUE .env no maneja herencia, si existe la propiedad no la pisa

Para Development, utilizo ./.env 

$ cat .env
GlaciaR_Upsala_backend__MONGODB_MLAB_BASE=upsala-r03
GlaciaR_Upsala_backend__MONGODB_MLAB_USER=
GlaciaR_Upsala_backend__MONGODB_MLAB_PASS=
GlaciaR_Upsala_backend__MONGODB_MLAB_HOST=localhost:27017


En producción no vamos a tener el archivo .env
¿Cómo seteamos las variables de entorno en Heroku?

https://devcenter.heroku.com/articles/config-vars


### 1.3.-heroku server

For heroku server 

```sh
$ heroku login

$ heroku logs   -a glaciar-upsala-backend
$ heroku config -a glaciar-upsala-backend
=== glaciar-upsala-backend Config Vars

$ heroku config:set   GlaciaR_Upsala_backend__CONFIG_HEROKU=fruta
$ heroku config:get   GlaciaR_Upsala_backend__CONFIG_HEROKU
$ heroku config:unset GlaciaR_Upsala_backend__CONFIG_HEROKU


```


For Example:


```sh

$ heroku config:set GlaciaR_Upsala_backend__CONFIG_HEROKU=fruta    -a glaciar-upsala-backend                              Setting GlaciaR_Upsala_backend__CONFIG_HEROKU and restarting ⬢ glaciar-upsala-backend... done, v27
GlaciaR_Upsala_backend__CONFIG_HEROKU: fruta

$ heroku config:get  GlaciaR_Upsala_backend__CONFIG_HEROKU         -a glaciar-upsala-backend
fruta

$ heroku config                          -a glaciar-upsala-backend
=== glaciar-upsala-backend Config Vars
GlaciaR_Upsala_backend__CONFIG_HEROKU: fruta

$ heroku logs -a glaciar-upsala-backend | grep process.env.GlaciaR_Upsala_backend__CONFIG_HEROKU
2018-08-25T23:04:31.814128+00:00 app[web.1]: process.env.GlaciaR_Upsala_backend__CONFIG_HEROKU=fruta

```


So .... We can see that we can work for a production environmetn

### 1.3.1. Heroku Specific Port

.listen(process.env.PORT || 5000)

Heroku dynamically assigns your app a port. It will listen to port 5000 locally, and also work on Heroku.
See Heroku docs on Node.js: https://devcenter.heroku.com/articles/getting-started-with-nodejs

### 1.3.2. Heroku Specific Start

To determine how to start your app, Heroku first looks for a Procfile. If no Procfile exists for a Node.js app, we will attempt to start a default web process via the start script in your package.json.

```sh
╰─$ cat Procfile
web: node index.js

```



### 1.4. Docker Build and Use

Build Doceker 

```sh
$ docker build .   
$ docker build -t pabloezequiel/upsala-backend .

$ docker run -p 5000:5000    pabloezequiel/upsala-backend
$ docker run -p 5000:5000 -d pabloezequiel/upsala-backend --env-file ~/.env.list 

# Browse to `http://localhost:5000/` 
```

Use docker 

```sh
$ docker ps
$ docker logs pabloezequiel/upsala-backend

# Enter the container
$ docker exec -it pabloezequiel/upsala-backend /bin/bash
```


### 1.5.-mongo-db

Tengo datos repetidos en Mongo DB    => Debería resetear las bases.
La base de datos Mongo DB esta lenta => Debería crear indices.

```sh
db.getCollection('MGSET_02_2010_2015').createIndex({'FECHA_HORA':1})
```

MongoDB query with Find framework

```sh
db.getCollection('MGSET_01_2009_2018')
                        .find({ FECHA_HORA:
                                {
                                    '$gt': ISODate('2015-01-14T21:00:00-03:00'),
                                    '$lt': ISODate('2015-02-14T21:00:00-03:00')
                                }
                              },
                              {"_id":0,"FECHA_HORA":1,"FECHA":1,"HORA":1,"DATASET":1,"AIRQ_CO":1})
                        .sort({"FECHA_HORA":1})
                        .limit(6)
                        .skip(0)
                        */
```

MongoDB query with Aggregated framework

```sh
db.getCollection('MGSET_01_2009_2018')
                        .aggregate([
                            { $match: {
                                FECHA_HORA:
                                {
                                    '$gt': ISODate('2015-01-14T03:00:00-03:00'),
                                    '$lt': ISODate('2015-01-14T12:00:00-03:00')
                                }
                            } },
                            { $limit  :  40 },
                            { $group  :
                                {
                                    _id: "$DATASET",
                                    respuesta : {
                                         $push:  {
                                            FECHA_HORA: "$FECHA_HORA",
                                                 FECHA: "$FECHA",
                                                  HORA: "$HORA",
                                               AIRQ_CO: "$AIRQ_CO",
                                               DATASET: "$DATASET"
                                             
                                         }
                                    } 
                                } 
                             },
                            { $sort   :  {"FECHA_HORA":1}  },
                            { $skip   :  0 }
                        ])
```

Nota:  { $limit  :  40 } indica que si hay cuatro grupos, cada uno tendrá 10

#1.6.-linux

```sh
ps -A  | grep nodemon
ps aux | grep nodemon
kill -9 <PID>
```

## 3. TODO and Next Steps

- Swagger
- TDD with Mocha & Chai


## 4. Enhacement

- Jenkins Pipeline
- Code Build Pipeline

## 5. Resources and References

```sh
$ docker run --env-file ~/.env.list ubuntu env | grep VAR
```

- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)


- ID #05 Descarga de Datos Backend
https://github.com/PabloEzequiel/GlaciaR-Upsala-backend/projects/1#card-13238348

Ejemplo de un GET:
URL	https://glaciar-upsala-backend.herokuapp.com/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2015-03-12&to=2015-04-30



https://glaciar-upsala-backend.herokuapp.com/dataset/MGSET_01_2009_2018/p/AIRQ_CO?from=2015-03-12&to=2015-03-14


[{"data":["0.39","0.37","0.35","0.33","0.31","0.3","0.3","0.32","0.34","0.37","0.38","0.4","0.4","0.39","0.38","0.37","0.37","0.36","0.37","0.38","0.38","0.38","0.38","0.36","0.38","0.33","0.3","0.27","0.25","0.26","0.27","0.29","0.34","0.32","0.37","0.39","0.41","0.41","0.4","0.39","0.38","0.39","0.41","0.44","0.48","0.48","0.48","0.39","0.37","0.35","0.33","0.31","0.3","0.3","0.32","0.34","0.37","0.38","0.4","0.39","0.4","0.38","0.37","0.36","0.37","0.37","0.38","0.38","0.38","0.38","0.33","0.38","0.36","0.27","0.3","0.26","0.25","0.29","0.27","0.32","0.37","0.34","0.39","0.41","0.4","0.41","0.39","0.38","0.39","0.41","0.44","0.48","0.48","0.48","0.37","0.39","0.35","0.31","0.33","0.3","0.3","0.34","0.37","0.32","0.38","0.4","0.4","0.39","0.38","0.37","0.36","0.37","0.37","0.38","0.38","0.38","0.36","0.38","0.33","0.38","0.3","0.27","0.25","0.26","0.27","0.29","0.32","0.34","0.37","0.39","0.41","0.41","0.4","0.39","0.38","0.39","0.41","0.48","0.48","0.48","0.44","0.39","0.35","0.33","0.37","0.31","0.3","0.3","0.34","0.32","0.37","0.38","0.4","0.39","0.4","0.38","0.36","0.37","0.37","0.37","0.38","0.38","0.38","0.38","0.38","0.33","0.36","0.3","0.25","0.26","0.27","0.27","0.29","0.34","0.32","0.37","0.39","0.41","0.41","0.4","0.39","0.38","0.39","0.41","0.44","0.48","0.48","0.48","0.39","0.37","0.35","0.33","0.31","0.3","0.3","0.32","0.34","0.37","0.38","0.4"],"labels":["12/03/2015T2","12/03/2015T3","12/03/2015T4","12/03/2015T5","12/03/2015T6","12/03/2015T7","12/03/2015T8","12/03/2015T9","12/03/2015T10","12/03/2015T11","12/03/2015T12","12/03/2015T13","12/03/2015T14","12/03/2015T15","12/03/2015T16","12/03/2015T17","12/03/2015T19","12/03/2015T18","12/03/2015T20","12/03/2015T21","12/03/2015T22","12/03/2015T23","12/03/2015T24","13/03/2015T2","13/03/2015T1","13/03/2015T3","13/03/2015T4","13/03/2015T5","13/03/2015T6","13/03/2015T7","13/03/2015T8","13/03/2015T9","13/03/2015T11","13/03/2015T10","13/03/2015T12","13/03/2015T13","13/03/2015T14","13/03/2015T15","13/03/2015T16","13/03/2015T17","13/03/2015T18","13/03/2015T19","13/03/2015T20","13/03/2015T21","13/03/2015T22","13/03/2015T23","13/03/2015T24","12/03/2015T2","12/03/2015T3","12/03/2015T4","12/03/2015T5","12/03/2015T6","12/03/2015T7","12/03/2015T8","12/03/2015T9","12/03/2015T10","12/03/2015T11","12/03/2015T12","12/03/2015T13","12/03/2015T15","12/03/2015T14","12/03/2015T16","12/03/2015T17","12/03/2015T18","12/03/2015T19","12/03/2015T20","12/03/2015T22","12/03/2015T21","12/03/2015T23","12/03/2015T24","13/03/2015T3","13/03/2015T1","13/03/2015T2","13/03/2015T5","13/03/2015T4","13/03/2015T7","13/03/2015T6","13/03/2015T9","13/03/2015T8","13/03/2015T10","13/03/2015T12","13/03/2015T11","13/03/2015T13","13/03/2015T14","13/03/2015T16","13/03/2015T15","13/03/2015T17","13/03/2015T18","13/03/2015T19","13/03/2015T20","13/03/2015T21","13/03/2015T22","13/03/2015T23","13/03/2015T24","12/03/2015T3","12/03/2015T2","12/03/2015T4","12/03/2015T6","12/03/2015T5","12/03/2015T7","12/03/2015T8","12/03/2015T10","12/03/2015T11","12/03/2015T9","12/03/2015T12","12/03/2015T13","12/03/2015T14","12/03/2015T15","12/03/2015T16","12/03/2015T17","12/03/2015T18","12/03/2015T19","12/03/2015T20","12/03/2015T21","12/03/2015T22","12/03/2015T23","13/03/2015T2","12/03/2015T24","13/03/2015T3","13/03/2015T1","13/03/2015T4","13/03/2015T5","13/03/2015T6","13/03/2015T7","13/03/2015T8","13/03/2015T9","13/03/2015T10","13/03/2015T11","13/03/2015T12","13/03/2015T13","13/03/2015T14","13/03/2015T15","13/03/2015T16","13/03/2015T17","13/03/2015T18","13/03/2015T19","13/03/2015T20","13/03/2015T22","13/03/2015T24","13/03/2015T23","13/03/2015T21","12/03/2015T2","12/03/2015T4","12/03/2015T5","12/03/2015T3","12/03/2015T6","12/03/2015T7","12/03/2015T8","12/03/2015T10","12/03/2015T9","12/03/2015T11","12/03/2015T12","12/03/2015T14","12/03/2015T15","12/03/2015T13","12/03/2015T16","12/03/2015T18","12/03/2015T17","12/03/2015T19","12/03/2015T20","12/03/2015T21","12/03/2015T22","12/03/2015T24","12/03/2015T23","13/03/2015T1","13/03/2015T3","13/03/2015T2","13/03/2015T4","13/03/2015T6","13/03/2015T7","13/03/2015T5","13/03/2015T8","13/03/2015T9","13/03/2015T11","13/03/2015T10","13/03/2015T12","13/03/2015T13","13/03/2015T15","13/03/2015T14","13/03/2015T16","13/03/2015T17","13/03/2015T18","13/03/2015T19","13/03/2015T20","13/03/2015T21","13/03/2015T22","13/03/2015T23","13/03/2015T24","12/03/2015T2","12/03/2015T3","12/03/2015T4","12/03/2015T5","12/03/2015T6","12/03/2015T7","12/03/2015T8","12/03/2015T9","12/03/2015T10","12/03/2015T11","12/03/2015T12","12/03/2015T13"],"label":"Serie AIRQ_CO"}]





MongoDB query with Aggregated framework

Detectar la densidad de la base de datos

```sh
db.getCollection('MGSET_01_2009_2018').aggregate([
{ $match : {   FECHA_HORA :{ $gt: ISODate("2014-07-01T00:00:00.000Z")}}},
{ $group : {
        _id : {   
              year: { $year: "$FECHA_HORA" } ,
           // month: { $month: "$FECHA_HORA" },
           // day: { $dayOfMonth: "$FECHA_HORA" }
        },
        count: { $sum: 1 },
        "FECHA_HORA":{"$first":"$FECHA_HORA"}
}}])

// RESPUESTA POR AÑO:

{  
   "_id":{"year":2018 },
   "count":25776.0,
   "FECHA_HORA":   ISODate("2018-01-01T00:00:00.000   Z")
}
{  
   "_id":{"year":2014 },
   "count":17564.0,
   "FECHA_HORA":   ISODate("2014-07-01T01:00:00.000   Z")
}
{  
   "_id":{"year":2015 },
   "count":27696.0,
   "FECHA_HORA":   ISODate("2015-01-01T00:00:00.000   Z")
}
{  
   "_id":{"year":2016 },
   "count":33848.0,
   "FECHA_HORA":   ISODate("2016-01-01T00:00:00.000   Z")
}
{  
   "_id":{"year":2017 },
   "count":34608.0,
   "FECHA_HORA":   ISODate("2017-01-01T00:00:00.000   Z")
}
```

// Query tomada del log:


>dataset_id    : MGSET_01_2009_2018
>param_id      : AIRQ_CO
>date[from-to] : [2018-02-28, 2018-03-31]
>type          :  json_x_amcharts4_multi_series_v3
getSeriesDataMultiple('MGSET_01_2009_2018', 'AIRQ_CO', 'DEFAULT', {"from":"2018-02-28","to":"2018-03-31","type":"json_x_amcharts4_multi_series_v3"})
dateFrom=Tue Feb 27 2018 21:00:00 GMT-0300 (-03)
dateTo=Fri Mar 30 2018 21:00:00 GMT-0300 (-03)

// MongoDB Query

```
    db.getCollection('MGSET_01_2009_2018')
        .aggregate([
        { $match: {
            FECHA_HORA:
            { 
                '$gt': ISODate('2018-02-27T21:00:00-03:00'),
                '$lt': ISODate('2018-03-30T21:00:00-03:00')  
            }
        } },
        {"$skip":0},
        { $project :  {
            "_id":0
            FECHA_HORA":1
            FECHA":1
            HORA":1
            DATASET":1
            AIRQ_CO":1
            } 
        },
        {
            "$group":{
                "_id":{
                    "FECHA":"$FECHA"
                    HORA":"$HORA"
                    PARAM":"AIRQ_CO"
                }
                gtype":{"$first":"json_x_amcharts4_multi_series_v3"}
                data":{"$push":"$AIRQ_CO"}
                dataset":{"$push":"$DATASET"}
                label":{"$first":"Serie AIRQ_CO"}
                labels":{"$push":"$FECHA_HORA"}
                FECHA_HORA":{"$first":"$FECHA_HORA"}
            }
        },
        { $sort   :  {"FECHA_HORA":-1} },
        { $skip   :  0 }
    ])
```

// Mongo Query del DS04: con (WIP)


```
db.getCollection('MGSET_04_2010_2015-PRN')
    .aggregate([
    { $match: {
        FECHA_HORA:
        { 
            '$gt': ISODate('2012-12-31T21:00:00-03:00'),
            '$lt': ISODate('2013-12-30T21:00:00-03:00')  
        }
    } },
    {"$skip":0},
    { $project : 
            {
            "_id":0,
            "FECHA_HORA":1,
            "FECHA":1,
            "HORA":1,
            "DATASET":1,
            "WATERQ_pH":1
            }
    },
    {"$group":
        {
                "_id":{"FECHA":"$FECHA","HORA":"$HORA","PARAM":"WATERQ_pH"},
            "gtype":{"$first":"json_x_amcharts4_multi_series_v3"},
            "data":{"$push":"$WATERQ_pH"},
            "dataset":{"$push":"$DATASET"},
            "label":{"$first":"Serie WATERQ_pH"},
            "labels":{"$push":"$FECHA_HORA"},
        "FECHA_HORA":{"$first":"$FECHA_HORA"}
            }
    },
    { $sort   :  {"FECHA_HORA":-1} },
    { $skip   :  0 }
    ])
```

// ------------------------------------------------------------------------------------
DS04 
    NOTA:
    VER EL EJEMPLO COMPLETO EN:
    https://github.com/PabloEzequiel/Glaciar-Upsala-backend/issues/23

            ```
            db.getCollection('MGSET_04_2010_2015-PRN')
                .aggregate([
                { $match: 
                    {
                        "DATASET": { $in: [ /WATERQ_Temp$/ ] }
                    } 
                }, 
                {"$skip":0},
                { $project : 
                    {
                        "_id" : 0,
                    "FECHA_HORA" : 1,
                        "FECHA" : 1,
                        "HORA" : 1,
                    "DATASET" : 1,
                        "LABEL" : 1
                    } 
                },
                {"$group":
                    {
                        "_id" : { "FECHA":"$FECHA","HORA": "$HORA","PARAM":"WATERQ_Temp" },
                        "gtype" : { "$first":"json_x_amcharts4_multi_series_v3" },
                        "data" : { "$push":"$LABEL" },
                    "dataset" : { "$push":"$DATASET" },
                        "label" : { "$first":"Serie WATERQ_Temp" },
                    "labels" : { "$push":"$FECHA_HORA" },
                "FECHA_HORA" : { "$first":"$FECHA_HORA" }
                    }
                },
                { $sort : { "FECHA_HORA" : -1 } },
                { $skip : 0 }
            ])
            ```

            /* 1 */
            {
                "_id" : {
                    "FECHA" : "03/03/2017",
                    "HORA" : "09:41:00",
                    "PARAM" : "WATERQ_Temp"
                },
                "gtype" : "json_x_amcharts4_multi_series_v3",
                "data" : [ 
                    "30.3"
                ],
                "dataset" : [ 
                    "DATASET-GGY-WATERQ_Temp"
                ],
                "label" : "Serie WATERQ_Temp",
                "labels" : [ 
                    ISODate("2017-03-03T09:41:00.000Z")
                ],
                "FECHA_HORA" : ISODate("2017-03-03T09:41:00.000Z")
            }

            /* 2 */
            {
                "_id" : {
                    "FECHA" : "14/02/2017",
                    "HORA" : "06:28:00",
                    "PARAM" : "WATERQ_Temp"
                },
                "gtype" : "json_x_amcharts4_multi_series_v3",
                "data" : [ 
                    "25.9"
                ],
                "dataset" : [ 
                    "DATASET-PRN-WATERQ_Temp"
                ],
                "label" : "Serie WATERQ_Temp",
                "labels" : [ 
                    ISODate("2017-02-14T06:28:00.000Z")
                ],
                "FECHA_HORA" : ISODate("2017-02-14T06:28:00.000Z")
            }

           ... etc

// ------------------------------------------------------------------------------------
Este es el bueno
{DATASET: {$in: [ RegExp('WATERQ_Temp$')]}}
{ "DATASET": { $in: [ /WATERQ_Temp$/ ] }, }


db.getCollection('MGSET_04_2010_2015-PRN')
    .aggregate([
        { $match   : 
            {
                 // "DATASET": { $in: [ /WATERQ_Temp$/ ] },
                    "DATASET": { $in: [ RegExp('WATERQ_Temp$')] },
            },
        },
    {"$skip":0},
    { $project : 
        {
               "_id" : 0,
        "FECHA_HORA" : 1,
             "FECHA" : 1,
              "HORA" : 1,
           "DATASET" : 1,
             "LABEL" : 1
        } 
    },
    {"$group":
        {
              "_id" : { "FECHA":"$FECHA","HORA": "$HORA","PARAM":"WATERQ_Temp" },
            "gtype" : { "$first":"json_x_amcharts4_multi_series_v3" },
             "data" : { "$push":"$LABEL" },
          "dataset" : { "$push":"$DATASET" },
            "label" : { "$first":"Serie WATERQ_Temp" },
           "labels" : { "$push":"$FECHA_HORA" },
       "FECHA_HORA" : { "$first":"$FECHA_HORA" }
        }
    },
    { $sort : { "FECHA_HORA" : -1 } },
    { $skip : 0 }
])


// ------------------------------------------------------------------------------------
Y tengo:

http://localhost:5000/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Temp?type=json_x_amcharts4_multi_series_v3
http://localhost:5000/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Temp?type=json_x_amcharts4_multi_series_v3&from=2007-03-03&to=2017-03-03

http://localhost:5000/dataset/MGSET_04_2010_2015-PRN/p/WATERQ_Temp?type=json_x_amcharts4_multi_series_v3

>dataset_id    : MGSET_04_2010_2015-PRN
>param_id      : WATERQ_Temp
>date[from-to] : [undefined, undefined]
>type          :  json_x_amcharts4_multi_series_v3
getSeriesDataMultiple('MGSET_04_2010_2015-PRN', 'WATERQ_Temp', c/'undefined', s/'undefined', {"type":"json_x_amcharts4_multi_series_v3"})
db.getCollection('MGSET_04_2010_2015-PRN').find( {} )
getDataset(MGSET_04_2010_2015-PRN).
Mongoose: MGSET_04_2010_2015-PRN.aggregate([ { '$match': {} }, { '$skip': 0 }, { '$project': { _id: 0, FECHA_HORA: 1, FECHA: 1, HORA: 1, DATASET: 1, LABEL: 1 } }, { '$group': { _id: { FECHA: '$FECHA', HORA: '$HORA', PARAM: 'WATERQ_Temp' }, gtype: { '$first': 'json_x_amcharts4_multi_series_v3' }, data: { '$push': '$LABEL' }, dataset: { '$push': '$DATASET' }, label: { '$first': 'Serie WATERQ_Temp' }, labels: { '$push': '$FECHA_HORA' }, FECHA_HORA: { '$first': '$FECHA_HORA' } } }, { '$sort': { FECHA_HORA: -1 } }, { '$skip': 0 } ], {})

    y anda  ok ... 


    _______________

    >dataset_id    : MGSET_04_2010_2015-PRN
    >param_id      : WATERQ_Temp
    >date[from-to] : [2007-03-03, 2017-03-03]
    >type          :  json_x_amcharts4_multi_series_v3
    getSeriesDataMultiple('MGSET_04_2010_2015-PRN', 'WATERQ_Temp', c/'undefined', s/'undefined', {"type":"json_x_amcharts4_multi_series_v3","from":"2007-03-03","to":"2017-03-03"})

    dateFrom: Fri Mar 02 2007 21:00:00 GMT-0300 (Argentina Standard Time)
    dateTo  : Thu Mar 02 2017 21:00:00 GMT-0300 (Argentina Standard Time)
    
    // MongoDB Query

        db.getCollection('MGSET_04_2010_2015-PRN')
            .aggregate([
            { $match   : { 
                "DATASET": { $in: [ /WATERQ_Temp$/ ] } 
            },
            {"$skip":0},
            { $project : {"_id":0,"FECHA_HORA":1,"FECHA":1,"HORA":1,"DATASET":1,"LABEL":1} },
            {"$group":{"_id":{"FECHA":"$FECHA","HORA":"$HORA","PARAM":"WATERQ_Temp"},"gtype":{"$first":"json_x_amcharts4_multi_series_v3"},"data":{"$push":"$LABEL"},"dataset":{"$push":"$DATASET"},"label":{"$first":"Serie WATERQ_Temp"},"labels":{"$push":"$FECHA_HORA"},"FECHA_HORA":{"$first":"$FECHA_HORA"}}},
            { $sort    : {"FECHA_HORA":-1} },
            { $skip    : 0 }
            ])

    getDataset(MGSET_04_2010_2015-PRN).
    Mongoose: MGSET_04_2010_2015-PRN.aggregate([ { '$match': { DATASET: { '$in': [ /WATERQ_pH$/ ] } } }, { '$skip': 0 }, { '$project': { _id: 0, FECHA_HORA: 1, FECHA: 1, HORA: 1, DATASET: 1, LABEL: 1 } }, { '$group': { _id: { FECHA: '$FECHA', HORA: '$HORA', PARAM: 'WATERQ_Temp' }, gtype: { '$first': 'json_x_amcharts4_multi_series_v3' }, data: { '$push': '$LABEL' }, dataset: { '$push': '$DATASET' }, label: { '$first': 'Serie WATERQ_Temp' }, labels: { '$push': '$FECHA_HORA' }, FECHA_HORA: { '$first': '$FECHA_HORA' } } }, { '$sort': { FECHA_HORA: -1 } }, { '$skip': 0 } ], {})
    TODO: Procesar: docsJS.length=43 registros
    getDatasetXParamas(MGSET_04_2010_2015-PRN, undefined, undefined)





// ------------------------------------------------------------------------------------
EJEMPLO DE EJECUCION:

    Query mongo para: json_x_amcharts4_multi_series_v3

    db.getCollection('MGSET_01_2009_2018').find({})

```
    db.getCollection('MGSET_01_2009_2018')
    .aggregate([
    { 
        $match: {
        FECHA_HORA:
        { 
            '$gt': ISODate('2016-01-14T21:00:00-03:00'),
            '$lt': ISODate('2016-02-14T21:00:00-03:00')  
        }
    } },
    {"$skip":0},
    { $project:

        {"_id":0,"FECHA_HORA":1,"FECHA":1,"HORA":1,"DATASET":1,"AIRQ_CO":1}

    },
    {

            "$group":{
                  "_id":{"FECHA":"$FECHA","HORA":"$HORA","PARAM":"AIRQ_CO"},
                "gtype":{"$first":"json_x_amcharts4_multi_series_v3"},
                 "data":{"$push":"$AIRQ_CO"},
              "dataset":{"$push":"$DATASET"},
                "label":{"$first":"Serie AIRQ_CO"},
               "labels":{"$push":"$FECHA_HORA"},
           "FECHA_HORA":{"$first":"$FECHA_HORA"} 
                    }
    },

    { $sort   :  {"FECHA_HORA":-1} },
    { $skip   :  0 }
    ])
```

Y respuesta:

```
    /* 1 */
    {
        "_id" : {
            "FECHA" : "2016-02-14",
            "HORA" : "24",
            "PARAM" : "AIRQ_CO"
        },
        "gtype" : "json_x_amcharts4_multi_series_v3",
        "data" : [ 
            "0.54", 
            "", 
            "0.56", 
            "0.46"
        ],
        "dataset" : [ 
            "MGSET_01_2009_2018_BO", 
            "MGSET_01_2009_2018_PA", 
            "MGSET_01_2009_2018_CE", 
            "MGSET_01_2009_2018_CO"
        ],
        "label" : "Serie AIRQ_CO",
        "labels" : [ 
            ISODate("2016-02-14T23:00:00.000Z"), 
            ISODate("2016-02-14T23:00:00.000Z"), 
            ISODate("2016-02-14T23:00:00.000Z"), 
            ISODate("2016-02-14T23:00:00.000Z")
        ],
        "FECHA_HORA" : ISODate("2016-02-14T23:00:00.000Z")
    }
```

----
ESTE es bueno:

si en dispercion 

quiero filtrar también por variables.... 
tengo la primera sección para agregar de "match":





        db.getCollection('MGSET_04_2010_2015-PRN')
            .aggregate([
                { $match   : 

                         {"DATASET":  {"$in":[  
                             "DATASET-PGY-WATERQ_Sal" 
                         ]}} 
                },
                { '$group': 
                    { _id: 
                        { 
                            year     : { '$year'       : '$FECHA_HORA' }, 
                            month    : { '$month'      : '$FECHA_HORA' }, 
                            day      : { '$dayOfMonth' : '$FECHA_HORA' },
                        }, 
                        count        : { '$sum'  :  1            },                                                                             
                        FECHA_HORA   : { '$first': '$FECHA_HORA' },
                    },
                }, 
                { $sort    : {"FECHA_HORA":-1} },
                { $skip    : 0 }
            ])
            
            