# MEAN Stack using Docker

MEAN (full) stack application which comprises of MongoDB, ExpressJS, Angular and NodeJS. MongoDB takes care of the back end database, NodeJS and ExpressJS are for server side rendering, rest apis, and Angular is for front end.

Docker Compose can be used to create separate containers (and host them) for each of the stacks in a MEAN stack application. MEAN is the acronym for MongoDB Express Angular & NodeJs

## Angular (9.0.6)

frontend is developed in Angular, it's in forntend folder
[Details](/docs/angular-frontend-structure.md)

## Expressjs (4.17.1)

Api folder contains REST apis which is developed using expressjs
[Details](/docs/expressjs-api-structure.md)

## Mongo DB

We are using Mongodb as database.

## NGINX

###### Note: only if you are using docker.

We have uses NGINX loadbalancer in case if there is a requirement that frontend and api need to be exposed on same port. For configutration please check loadbalancer/nginx.conf

## How to run project

###using Docker

1. Updated Connection String : "connectionString":"mongodb://database/mean-docker"

2. To run the project run below command:

`docker-compose up`

### Without Docker

#### Prerequisite

1. Install latest [Node js ](https://nodejs.org/en/)
2. Install Nodemon as global package (To run exprerssjs in development mode)
   `npm install -g nodemon`
3. Optional Install Angular CLI
   `npm install -g @angular/cli`
4. Install Mongodb locally or [Signup](https://www.mongodb.com/atlas-signup-from-mlab?utm_source=mlab.com&utm_medium=referral&utm_campaign=mlab%20signup&utm_content=blue%20sign%20up%20button) for a free account
5. Before running the project make sure that you are able to connect MongoDb , you can use [Robo 3T](https://robomongo.org/download) for it

#### Running the Project

1. Update connection string in config.json file. (in api folder)
2. Navigate to api folder and install all dependencies.
   RUN `npm i`
3. Navigate to forndend folder and install all dependencies.
   RUN `npm i`
4. From same folder RUN `npm start`
