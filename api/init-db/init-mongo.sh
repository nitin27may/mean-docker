#!/bin/bash
set -e

mongosh "$MONGO_DB" -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin <<EOF
  // Create user for application
  db.createUser({
    user: '$MONGO_DB_USERNAME',
    pwd: '$MONGO_DB_PASSWORD',
    roles: [{ role: 'readWrite', db: '$MONGO_DB' }]
  });

  // Seed Users
  db.users.drop();
  db.users.insertMany([
    {
      "_id": ObjectId("6759daeb097c7d69426b7649"),
      "create_date": new Date(),
      "username": "nitin27may@gmail.com",
      "email": "nitin27may@gmail.com",
      "password": "\$2a\$10\$nc0yO2eeCDOLg6sObsAHfuXQY8NnCrhHz5GbkmPYsAGLsQoSZa.qm",
      "firstName": "Nitin",
      "lastName": "Singh"
    }
  ]);

  // Seed Contacts
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
      "email": "sachin@gmail.com",
      "city": "Pune",
      "postalCode": "421201",
      "create_date": new Date()
    },
    {
      "_id": ObjectId("6759daeb097c7d69426b7651"),
      "firstName": "Vikram",
      "lastName": "Singh",
      "mobile": "9876541111",
      "email": "vikram@gmail.com",
      "city": "Pune",
      "postalCode": "421201",
      "create_date": new Date()
    }
  ]);
EOF