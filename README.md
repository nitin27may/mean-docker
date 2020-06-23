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

### Frontend (Angular) [Dockerfile](/frontend/Dockerfile)

```dockerfile
# Create image based off of the official Node 10 image
FROM node:12.8-alpine

# Copy dependency definitions
COPY package.json package-lock.json ./


# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false

## installing and Storing node modules on a separate layer will 
## prevent unnecessary npm installs at each build
RUN npm i && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Build server side bundles
RUN npm run build:ssr

# Expose the port the app runs in
EXPOSE 4000
# Serve the app
CMD ["node", "dist/frontend/server/main.js"]

```

## Expressjs (4.17.1)

In MEAN stack, E stands for Expressjs, all rest services are developed using express js.

It constains sample for:

1. Mongodb connection and schema validation using Mongoose
2. JWT implementation for Authorization
3. API routing
4. User registration & login APIs
5. Complete CRUD exmaple for Contact

For folder structure details refer this link: [API Folder Structure](/docs/expressjs-api-structure.md)

### Backend (Expressjs) [Dockerfile](/api/Dockerfile)

```dockerfile
FROM node:12.8-alpine

# Copy dependency definitions
COPY package.json package-lock.json ./

# disabling ssl for npm for Dev or if you are behind proxy
RUN npm set strict-ssl false

## installing and Storing node modules on a separate layer will 
## prevent unnecessary npm installs at each build
RUN npm i && mkdir /app && mv ./node_modules ./app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Get all the code needed to run the app
COPY . /app/

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]

```

## Mongo DB

We are using Mongodb as database. MongoDB is a cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.

We have used mongo db image and for data seed used `docker-entrypoint-initdb.d` and shell script is in file [`init-mongo.sh`](/mongo/init-db.d/init-mongo.sh)

Here, we have added same database credentials for root user for mongodb server and  our database. We can also use different credenitails for it

Also, we have added one default user for application :

UserName: john.doe@gmail.com
Password: Password (In database, it is hashed version)

```bat
mongo -- "$MONGO_INITDB_DATABASE" <<EOF
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME'; 
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('admin');
    admin.auth(rootUser, rootPassword);

    db.createUser({user: rootUser, pwd: rootPassword, roles: ["readWrite"]});


db.users.drop();
db.users.insertMany([
  {
    _id: 1,
    firstName: "John",
    lastName: "Doe",
    mobile: "9876543210",
    username: "john.doe@gmail.com",
    email: "john.doe@gmail.com",
   "password" : "$2a$10$85qQuOuD4cDtXOoxbtv0/e79ijARyN/4vpN438N2i8MKLQPUvSX46", 
    create_date: Date(),
  }
  ]);

db.contacts.drop();
db.contacts.insertMany([
  {
    _id: 1,
    firstName: "Nitin",
    lastName: "Singh",
    mobile: "9876543243",
    email: "nitin27may@gmail.com",
    city: "Mumbai",
    postalCode: "421201",
    create_date: Date(),
  },
  {
    _id: 2,
    firstName: "Sachin",
    lastName: "Singh",
    mobile: "9876540000",
    email: "saching@gmail.com",
    city: "Pune",
    postalCode: "421201",
    create_date: Date(),
  },
  {
    _id: 3,
    firstName: "Vikram",
    lastName: "Singh",
    mobile: "9876540000",
    email: "saching@gmail.com",
    city: "Pune",
    postalCode: "421201",
    create_date: Date(),
  }
]);

EOF
```

## NGINX

###### Note: only if you are using docker.

We have uses NGINX loadbalancer in case if there is a requirement that frontend and api need to be exposed on same port.
 For configutration please check [nginx.conf](/loadbalancer/nginx.conf)

### Loadbalancer (nginx) [Dockerfile](/api/loadbalancer)

```dockerfile
# Use the standard Nginx image from Docker Hub
FROM nginx
# Copy the configuration file from the current directory and paste
# it inside the container to use it as Nginx's default config.
COPY nginx.conf /etc/nginx/nginx.conf
# Port 8080 of the container will be exposed and then mapped to port
# 8080 of our host machine via Compose. This way we'll be able to
# access the server via localhost:8080 on our host.
EXPOSE 8000

# Start Nginx when the container has provisioned.
CMD ["nginx", "-g", "daemon off;"]

```
### NGINX config

 ```
events {
    worker_connections 1024;
  }
http {
  upstream frontend {
    # These are references to our backend containers, facilitated by
    # Compose, as defined in docker-compose.yml
    server angular:4000;
  } 
  upstream backend {
    # These are references to our backend containers, facilitated by
    # Compose, as defined in docker-compose.yml
    server express:3000;
  }
  

server {
    listen 8000;
    server_name frontend;
    server_name backend;

    location / {
       proxy_pass http://frontend;
       proxy_set_header Host $host;
    }
    location /api {
       proxy_pass http://backend;
       proxy_set_header Host $host;
    }
  }
}

 ```

## Docker-compose [file](/docker-compose.yml)

```dockerfile
version: "3" # specify docker-compose version

# Define the services/containers to be run
services:
  angular: # name of the first service
    build: frontend # specify the directory of the Dockerfile
    container_name: mean_angular
    ports:
      - "4000:4000" # specify port forewarding
    environment:
      - NODE_ENV=dev

  express: #name of the second service
    build: api # specify the directory of the Dockerfile
    container_name: mean_express
    ports:
      - "3000:3000" #specify ports forewarding
      # Below database enviornment variable for api is helpful when you have to use 
      # database as managed service
    environment:
      - MONGO_DB_USERNAME=admin-user
      - MONGO_DB_PASSWORD=admin-password
      - MONGO_DB_HOST=database
      - MONGO_DB_PORT=
      - MONGO_DB_PARAMETERS=
      - MONGO_DB_DATABASE=mean-contacts
    links:
      - database

  database: # name of the third service
    image: mongo # specify image to build container from
    container_name: mean_mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin-user
      - MONGO_INITDB_ROOT_PASSWORD=admin-password
      - MONGO_INITDB_DATABASE=mean-contacts
    volumes:
      - ./mongo/init-db.d/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh
    ports:
      - "27017:27017" # specify port forewarding

  nginx: #name of the fourth service
    build: loadbalancer # specify the directory of the Dockerfile
    container_name: mean_nginx
    ports:
      - "80:8000" #specify ports forewarding
    links:
      - express
      - angular

```

## How to run project

### Using Docker

1. To run the project run command: `docker-compose up`

2. Use `http://localhost` or `http://localhost:4000`

3. Use below default for login:

UserName: john.doe@gmail.com
Password: Password


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
