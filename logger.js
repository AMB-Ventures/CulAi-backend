const winston = require('winston');
const log = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ]
});

module.exports = log;