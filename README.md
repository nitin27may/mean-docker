# MEAN Stack using Docker

MEAN (full) stack application which comprises of MongoDB, ExpressJS, Angular and NodeJS. MongoDB is database, NodeJS and ExpressJS are for rest apis, and Angular is for front end.

Docker Compose can be used to create separate containers (and host them) for each of the stacks in a MEAN stack application. MEAN is the acronym for MongoDB Express Angular & NodeJs

## Angular (9.0.6)

In MEAN stack A stands for Angular, fronend of this project is developed in Angular.

It contains sample for below:

 1. User Registration
 2. Login
 3. Profile
 4. A complete CRUD example for Contact

Also, It has sample code for Auth guard, services, http interceptors, resolver and JWT  imaplmenation

For folder structure details refer this link: [Frontend Folder Structure](/docs/angular-frontend-structure.md)

## Expressjs (4.17.1)

In MEAN stack, E stands for Expressjs, all rest services are developed using express js.

It constains sample for:

1. Mongodb connection and schema validation using Mongoose
2. JWT implementation for Authorization
3. API routing
4. User registration & login APIs
5. Complete CRUD exmaple for Contact

For folder structure details refer this link: [API Folder Structure](/docs/expressjs-api-structure.md)

## Mongo DB

We are using Mongodb as database. MongoDB is a cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.



## NGINX

###### Note: only if you are using docker.

We have uses NGINX loadbalancer in case if there is a requirement that frontend and api need to be exposed on same port.
 For configutration please check [nginx.conf](/loadbalancer/nginx.conf)

## How to run project

### Using Docker

1. To run the project run command: `docker-compose up`

<hr>

#### Without Docker

##### Prerequisite

1. Install latest [Node js ](https://nodejs.org/en/)
2. Install Nodemon as global package (To run exprerssjs in development mode)
   `npm install -g nodemon`
3. Optional Install Angular CLI
   `npm install -g @angular/cli`
4. Install Mongodb locally or [Signup](https://www.mongodb.com/atlas-signup-from-mlab?utm_source=mlab.com&utm_medium=referral&utm_campaign=mlab%20signup&utm_content=blue%20sign%20up%20button) for a free managed account
5. Before running the project make sure that you are able to connect MongoDb , you can use [Robo 3T](https://robomongo.org/download) for it

#### Running the Project

1. Update connection string in config.json file. (in api folder)
2. Navigate to api folder and install all dependencies.
   RUN `npm i`
3. Navigate to forndend folder and install all dependencies.
   RUN `npm i`
4. From same folder (frontend) RUN `npm start` it will run both API and frontend
