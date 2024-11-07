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
    _id: 1,
    firstName: "John",
    lastName: "Doe",
    mobile: "9876543210",
    username: "john.doe@gmail.com",
    email: "john.doe@gmail.com",
   "password" : "\$2a\$10\$85qQuOuD4cDtXOoxbtv0/e79ijARyN/4vpN438N2i8MKLQPUvSX46",
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