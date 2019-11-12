# MEAN Stack using Docker, Docker Images and Docker Compose

MEAN (full) stack application which comprises of MongoDB, ExpressJS, Angular and NodeJS. MongoDB takes care of the back end database, NodeJS and ExpressJS are for server side rendering, rest apis, and Angular is for front end.

Docker Compose can be used to create separate containers (and host them) for each of the stacks in a MEAN stack application. MEAN is the acronym for MongoDB Express Angular & NodeJs

## Mongo DB Image

Download mongodb image: `docekr pull mongo`

Update the connection string like below:

if using mongo db image :
`"connectionString":"mongodb://database/mean-docker"`

If running mongodb remotely (Like hosted db on mlab) :
`"connectionString": "mongodb://username:password@ds056789.mlab.com:56789/nksmongo"`

## Angular

AngularClient folder contains the Angular UI App

## NodeJs Image

Download mongodb Nodejs: `docekr pull node:10.7.0-alpine`

## Docker Compose

To run the project run below command:

`docker-compose up --build`
