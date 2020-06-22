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