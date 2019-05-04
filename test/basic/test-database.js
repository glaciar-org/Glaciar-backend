"use strict"

const chai = require('chai')
const assert = require('assert')
const should = chai.should()
const expect = chai.expect

const mongoose = require('mongoose').set('debug', true)
const Schema = mongoose.Schema

var Global = require('../../common/Global')

require('dotenv').config({path: './.env'})


const FECHA_HORA = "FECHA_HORA"
const FECHA = "FECHA"
const HORA = "HORA"
const DATASET = "DATASET"


describe('Database Tests', function() {

    //Before starting the test, create a sandboxed database connection
    //Once a connection is established invoke done()
    before(function (done) {
        mongoose.connect(Global.getMongoConfig(), function(err, res) {
            expect(err).to.be.null
        })

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', function() {
            console.log('We are connected to test database!')
            done()
        })
    })



    describe('Test Database', function() {

        it('Should retrieve data from test database', function(done) {

            const dataset_id = 'DS01'

            const LIMIT = 0

            let query = {}
            let aggrega    = { skip: 0, limit: LIMIT }
            let projection = { _id:0, FECHA_HORA:1, FECHA:1, HORA:1, DATASET:1 }
            
            //Look up the 'Mike' object previously saved.
            var Dataset = require('../../model/dataset.model')(Global.getDatasetId(dataset_id))

            Dataset.find(query,  projection, aggrega, (err, data) => {

                if(err) {throw err}
                if(data.length === 0) {
                    throw new Error('No data!')
                }

                console.log("data.length= " + data.length )
                done()
                
            })


        })

    })

    //After all tests are finished drop database and close connection
    after(() => {

        // To Avoid OverwriteModelError: Cannot overwrite `Dataset` model once compiled.
        //      Based on: 
        //      https://smalldata.tech/blog/2016/10/12/integration-testing-asynchronously-created-mongoose-models-using-mocha
        mongoose.models = {}
        mongoose.modelSchemas = {}

    })


  })


