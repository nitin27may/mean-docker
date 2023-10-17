module.exports = {
  mongodb: {
    uri:
      "mongodb://" +
      process.env.MONGO_DB_USERNAME +
      ":" +
      process.env.MONGO_DB_PASSWORD +
      "@" +
      process.env.MONGO_DB_HOST +
      (process.env.MONGO_DB_PORT
        ? ":" + process.env.MONGO_DB_PORT + "/"
        : "/") +
      process.env.MONGO_DB_DATABASE +
      process.env.MONGO_DB_PARAMETERS,
  },
  secret: process.env.SECRET,
};
