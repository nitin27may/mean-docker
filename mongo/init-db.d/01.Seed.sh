mongoimport --jsonArray --authenticationDatabase=admin \
   --username=$MONGO_INITDB_ROOT_USERNAME \
   --password=$MONGO_INITDB_ROOT_PASSWORD \
   --mode upsert \
   --host 127.0.0.1 \
   --db $MONGO_DB \
   --collection Contacts \
   /docker-entrypoint-initdb.d/data.json