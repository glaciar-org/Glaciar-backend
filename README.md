# Glaciar-backend

Aplicación "Glaciar" backend: https://glaciar-org-backend.herokuapp.com/

El front de la app es http://www.glaciar.org

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


a Development, utilizo ./.env 

$ cat .env
GlaciaR_Upsala_backend__MONGODB_MLAB_BASE=upsala-r03
GlaciaR_Upsala_backend__MONGODB_MLAB_USER=
GlaciaR_Upsala_backend__MONGODB_MLAB_PASS=
GlaciaR_Upsala_backend__MONGODB_MLAB_HOST=localhost:27017


En producción, se setea como variable de Heroku de ambiente
https://devcenter.heroku.com/articles/config-vars


### 1.3.-heroku server

For heroku server 

```sh
$ heroku login

$ heroku logs   -a glaciar-upsala-backend
$ heroku config -a glaciar-upsala-backend
=== glaciar-upsala-backend Config Vars

$ heroku config:set   GlaciaR_Upsala_backend__CONFIG_HEROKU=avalue
$ heroku config:get   GlaciaR_Upsala_backend__CONFIG_HEROKU
$ heroku config:unset GlaciaR_Upsala_backend__CONFIG_HEROKU


```
Heroku Specific Port

.listen(process.env.PORT || 5000)

Heroku dynamically assigns your app a port. It will listen to port 5000 locally, and also work on Heroku.
See Heroku docs on Node.js: https://devcenter.heroku.com/articles/getting-started-with-nodejs




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


```sh
$ docker run --env-file ~/.env.list ubuntu env | grep VAR
```

### 1.5.-mongo-db

Crear indices en la base de datos

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

## 2. Resources and References

- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
