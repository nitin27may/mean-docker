---
layout: default
title: MongoDB Database
parent: Architecture
nav_order: 3
---

# MongoDB Database
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

# MongoDB Configuration

This directory contains the MongoDB configuration and seed data for the MEAN Stack Contacts application.

## Initialization Script

The main initialization script (`init-mongo.sh`) performs two primary tasks:

1. Creates a database user with appropriate permissions
2. Seeds the database with initial data (users and contacts)

### User Creation

```bash
mongosh $MONGO_DB -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --eval "db.createUser({ user: '$MONGO_DB_USERNAME', pwd:  '$MONGO_DB_PASSWORD', roles: [{ role: 'readWrite', db: '$MONGO_DB'}]})" --authenticationDatabase admin
```

### Data Seeding

The script seeds the database with initial data:

- One user account with login credentials
- Three sample contacts

```javascript
db.users.insertMany([
  {
    "_id": ObjectId("6759daeb097c7d69426b7649"),
    "create_date": new Date("2024-12-11T19:29:19.895Z"),
    "username": "nitin27may@gmail.com",
    "email": "nitin27may@gmail.com",
    "password": "$2a$10$nc0yO2eeCDOLg6sObsAHfuXQY8NnCrhHz5GbkmPYsAGLsQoSZa.qm",
    "firstName": "NItin",
    "lastName": "Singh"
  }
]);

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
  // Additional contacts...
]);
```

## Default User Credentials

The seed data creates a default user with the following credentials:

```
Username: nitin27may@gmail.com
Password: P@ssword#321
```

## Environment Variables

The MongoDB container uses the following environment variables:

- `MONGO_INITDB_ROOT_USERNAME`: Root username for MongoDB
- `MONGO_INITDB_ROOT_PASSWORD`: Root password for MongoDB
- `MONGO_DB_USERNAME`: Username for the application database
- `MONGO_DB_PASSWORD`: Password for the application database
- `MONGO_DB`: Database name

These variables should be defined in the root `.env` file of the project.

## Docker Configuration

The MongoDB container uses the official MongoDB image with custom initialization:

```dockerfile
FROM mongo

COPY init-db.d /docker-entrypoint-initdb.d
```

## Volumes

The Docker Compose configuration maps the following volumes:

1. `./mongo/init-db.d/:/docker-entrypoint-initdb.d/`: Initialization scripts
2. `./mongo/db:/data/db`: Data persistence

## Data Persistence

The MongoDB data is persisted in the `./mongo/db` directory. This ensures that your data is not lost when the container is stopped or restarted.

## Connecting to MongoDB

### From Docker Containers

Other containers can connect to MongoDB using the following connection string:

```
mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@database:27017/${MONGO_DB_DATABASE}?authSource=admin
```

### From Host Machine

You can connect to MongoDB from your host machine using:

```
mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@localhost:27017/${MONGO_DB_DATABASE}?authSource=admin
```

### Using MongoDB Compass or Robo 3T

To connect using GUI tools like MongoDB Compass or Robo 3T:

1. Host: `localhost`
2. Port: `27017`
3. Authentication: `Username/Password`
4. Username: Value of `MONGO_DB_USERNAME` from your `.env` file
5. Password: Value of `MONGO_DB_PASSWORD` from your `.env` file
6. Authentication Database: `admin`
7. Database: Value of `MONGO_DB_DATABASE` from your `.env` file

## Troubleshooting

### Permission Issues

If you encounter permission issues with the MongoDB data directory, run:

```bash
sudo chown -R $USER:$USER ./mongo/db
```

### Connection Issues

If you cannot connect to MongoDB, check:

1. The MongoDB container is running: `docker ps`
2. Environment variables are set correctly in `.env`
3. Ports are not blocked by a firewall
4. No other process is using port 27017

### Initialization Script Issues

If the initialization script fails, check:

1. The script has proper permissions: `chmod +x ./mongo/init-db.d/init-mongo.sh`
2. Line endings are set to LF: `git config --global core.autocrlf input`
3. No syntax errors in the script

## Customizing Seed Data

To modify the seed data:

1. Edit the `init-mongo.sh` file in the `init-db.d` directory
2. Rebuild and restart the containers:
   ```bash
   docker-compose down
   docker-compose -f docker-compose.nginx.yml up --build
   ```