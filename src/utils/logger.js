const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'debug', // nebo 'info' v produkci
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        // můžeš přidat i do souboru:
        // new transports.File({ filename: 'logs/server.log' })
    ]
});

module.exports = logger;
