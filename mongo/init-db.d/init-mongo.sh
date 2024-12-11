#!/bin/bash

## Set new user to database
mongosh $MONGO_DB -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --eval "db.createUser({ user: '$MONGO_DB_USERNAME', pwd:  '$MONGO_DB_PASSWORD', roles: [{ role: 'readWrite', db: '$MONGO_DB'}]})" --authenticationDatabase admin

## Seed Users and Contacts into database
mongosh $MONGO_DB <<EOF 
    var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
    var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
    var admin = db.getSiblingDB('$MONGO_INITDB_DATABASE');
    admin.auth(rootUser, rootPassword);

db.users.drop();
db.users.insertMany([
  {
    "_id": ObjectId("6759daeb097c7d69426b7649"),
    "create_date": new Date("2024-12-11T19:29:19.895Z"),
    "username": "nitin27may@gmail.com",
    "email": "nitin27may@gmail.com",
    "password": "\$2a\$10\$nc0yO2eeCDOLg6sObsAHfuXQY8NnCrhHz5GbkmPYsAGLsQoSZa.qm",
    "firstName": "NItin",
    "lastName": "Singh"
  }
]);

db.contacts.drop();
db.contacts.insertMany([
  {
    "_id": ObjectId("6759daeb097c7d69426b7641"),
    "firstName": "Nitin",
    "lastName": "Singh",
    "mobile": "9876543243",
    "email": "nitin27may@gmail.com",
    "city": "Mumbai",
    "postalCode": "421201",
    "create_date": new Date()
  },
  {
    "_id": ObjectId("6759daeb097c7d69426b7650"),
    "firstName": "Sachin",
    "lastName": "Singh",
    "mobile": "9876540000",
    "email": "saching@gmail.com",
    "city": "Pune",
    "postalCode": "421201",
    "create_date": new Date()
  },
  {
    "_id": ObjectId("6759daeb097c7d69426b7651"),
    "firstName": "Vikram",
    "lastName": "Singh",
    "mobile": "9876540000",
    "email": "saching@gmail.com",
    "city": "Pune",
    "postalCode": "421201",
    "create_date": new Date()
  }
]);
EOF