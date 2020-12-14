# Mongo Image

## Mongo DB Seed data

We have used mongo db image and for data seed used `docker-entrypoint-initdb.d` and shell script is in file `init-mongo.sh`



Also, we have used mongo import to seed data :


```bat
mongoimport --jsonArray --authenticationDatabase=admin \
   --username=$MONGO_INITDB_ROOT_USERNAME \
   --password=$MONGO_INITDB_ROOT_PASSWORD \
   --mode upsert \
   --host 127.0.0.1 \
   --db $MONGO_DB \
   --collection Contacts \
   /docker-entrypoint-initdb.d/data.json
```
Here, we have added database credentials for our new database. 
```bat
#!/bin/bash
set -e

mongo <<EOF
use admin
db.createUser({
  user: '$MONGO_DB_USERNAME',
  pwd:  '$MONGO_DB_PASSWORD',
  roles: [
     { role: 'readWrite', db: '$MONGO_DB'}]
})
EOF
```