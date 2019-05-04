# TDD con Mocha Chai y Chai-http

Basado en:
https://mherman.org/blog/2015/09/10/testing-node-js-with-mocha-and-chai/

```sh
$ npm install chai@4.1.2 chai-http@4.0.0 --save-dev
```

a mocha lo instalo globalmente:

```sh
$ npm install -g mocha
$ npm install -g mocha-watch
```

╰─mocha --version
5.2.0

╰─mocha --watch



# Run TDD - unico .... 

╭─pabloinchausti@Maq-II ~/Desktop/DevOps/code/github/PabloEzequiel/GlaciaR-Upsala-backend  
╰─$ mocha test/unico-lab.js  --watch

________________________
Hello nodemon lab!


+TEST FECHAS:

FECHA: [2014-04-29, 29/04/2014]


  0 passing (1ms)



# Run TDD - Solo UN TEST

╭─pabloinchausti@Maq-II ~/Desktop/DevOps/code/github/PabloEzequiel/GlaciaR-Upsala-backend  
╰─mocha test/unico-lab.js                                                                                             


________________________
Hello nodemon lab!


+TEST FECHAS:

FECHA: [2014-04-29, 29/04/2014]


  0 passing (1ms)

# Run TDD - TODO
                                                                                                  1 ↵
╭─pabloinchausti@Maq-II ~/Desktop/DevOps/code/github/PabloEzequiel/GlaciaR-Upsala-backend  
╰─$ mocha

