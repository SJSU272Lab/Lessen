var winston = require('winston');

var clicklogger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.File)({
            filename: './logging/userclicks.log',
            json: true,
            maxsize: 5242880, //5MB
            colorize: true
        })
    ]
});

var bidlogger = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.File)({ filename: './logging/bids.log' })
    ]
});

exports.clicklogger = clicklogger;
exports.bidlogger = bidlogger;