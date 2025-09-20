const mongoose = require("mongoose");
const log = require("../logger");
const chalk = require("chalk");

const connected = chalk.bold.blue;
const connectionError = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

let listenersRegistered = false;

function registerConnectionListeners() {
  if (listenersRegistered) {
    return;
  }

  const { connection } = mongoose;

  connection.on("connected", () => {
    log.info(connected("Mongoose default connection is open to ", process.env.DB));
  });

  connection.on("error", (err) => {
    log.error(
      connectionError("Mongoose default connection has occured " + err + " error")
    );
  });

  connection.on("disconnected", () => {
    log.info(disconnected("Mongoose default connection is disconnected"));
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      log.info(
        termination(
          "Mongoose default connection is disconnected due to application termination"
        )
      );
      process.exit(0);
    });
  });

  listenersRegistered = true;
}

async function initDb() {
  if (!process.env.DB) {
    log.warn(
      "Mongo connection string (process.env.DB) is not defined. Skipping database initialisation."
    );
    return null;
  }

  registerConnectionListeners();

  try {
    await mongoose.connect(process.env.DB, connectionOptions);
    return mongoose.connection;
  } catch (err) {
    log.error(
      connectionError("Mongoose default connection has occured " + err + " error")
    );
    throw err;
  }
}

module.exports = initDb;
