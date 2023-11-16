const appRootPath = require("app-root-path");
const fileExists = require("file-exists");
const env = require("node-env-file");

module.exports = {
  get: () => {
    const envFileLocation = appRootPath + "/.env";
    if (fileExists.sync(envFileLocation)) {
      env(envFileLocation);
    }
  },
};
