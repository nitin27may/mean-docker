version: "3.8" # specify docker-compose version

# Define the services/containers to be run
services:
  angular: # name of the first service
    build: # specify the directory of the Dockerfile
      context: ./frontend
      dockerfile: debug.dockerfile
    command: ["npm", "run", "start"]
    container_name: mean_angular
    volumes:
      - ./frontend/src:/app/src
    ports:
      - "4200:4200" # specify port forewarding
      - "49153:49153"
    environment:
      - NODE_ENV=dev
    links: 
      - express 

  express: #name of the second service
    build: # specify the directory of the Dockerfile
      context: ./api
      dockerfile: debug.dockerfile
    container_name: mean_express
    volumes:
      - ./api:/api
    ports:
      - "3000:3000" #specify ports forewarding
    environment:
      - SECRET=Thisismysecret
      - NODE_ENV=development
      - MONGO_DB_USERNAME=admin-user
      - MONGO_DB_PASSWORD=admin-password
      - MONGO_DB_HOST=database
      - MONGO_DB_PORT=
      - MONGO_DB_PARAMETERS=?authSource=admin
      - MONGO_DB_DATABASE=mean-contacts
    links:
      - database

  database: # name of the third service
    image: mongo # specify image to build container from
    container_name: mean_mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin-user
      - MONGO_INITDB_ROOT_PASSWORD=admin-password
      - MONGO_DB_USERNAME=admin-user1
      - MONGO_DB_PASSWORD=admin-password1
      - MONGO_DB=mean-contacts

    volumes:
      - ./mongo:/home/mongodb
      - ./mongo/init-db.d/:/docker-entrypoint-initdb.d/
      - ./mongo/db:/data/db
    ports:
      - "27017:27017" # specify port forewarding
