const path = require("path");
const dotenv = require("dotenv");

const envPaths = [
  path.resolve(__dirname, "..", "..", ".env"),
  path.resolve(__dirname, "..", ".env"),
];

envPaths.forEach((envPath, index) => {
  dotenv.config({
    path: envPath,
    override: index > 0,
  });
});
