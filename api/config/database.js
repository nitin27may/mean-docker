const env = require("./env");

env.get();
module.exports = {
  mongodb: {
    uri:
      "mongodb://" +
      process.env.MONGO_DB_HOST +
      (process.env.MONGO_DB_PORT
        ? ":" + process.env.MONGO_DB_PORT + "/"
        : "/") +
      process.env.MONGO_DB_DATABASE +
      process.env.MONGO_DB_PARAMETERS,
    username: process.env.MONGO_DB_USERNAME,
    password: process.env.MONGO_DB_PASSWORD,
  },
};
