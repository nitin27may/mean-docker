# MEAN Stack using Docker

MEAN (full) stack application which comprises of MongoDB, ExpressJS, Angular and NodeJS. MongoDB takes care of the back end database, NodeJS and ExpressJS are for server side rendering, rest apis, and Angular is for front end.

Docker Compose can be used to create separate containers (and host them) for each of the stacks in a MEAN stack application. MEAN is the acronym for MongoDB Express Angular & NodeJs

## Angular

frontend folder contains the Angular App

## Expressjs

Api folder contains REST apis which is developed using expressjs

## Mongo DB Connection

Update the connection string, in api/server.js like below:

## NGINX

We have uses NGINX loadbalancer in case if there is a requirement that frontend and api need to be exposed on same port. For configutration please check loadbalancer/nginx.conf

if using mongo db image :
`"connectionString":"mongodb://database/mean-docker"`

If running mongodb remotely (Like hosted db on mlab) :
`"connectionString": "mongodb://username:password@ds056789.mlab.com:56789/dbName"`

## How to run project

To run the project run below command:

`docker-compose up`
