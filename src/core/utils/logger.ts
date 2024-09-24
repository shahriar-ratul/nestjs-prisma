import { WinstonModule } from 'nest-winston';
import { format, transports } from "winston";
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

// Define the timestamp format
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";

function stringify(obj) {
    let cache = [];
    const str = JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // reset the cache
    return str;
}

// Custom format for console logging
const consoleLogFormat = printf(({ level, message, timestamp, ...rest }) => {

    // let requestId = httpContext.get('requestId');

    // rest have any requestID
    // if (rest.requestId) {
    //     requestId = rest.requestId;
    //     delete rest.requestId;
    // }


    const response = {
        level: level,
        timestamp,
        requestId: "N/A",
        message: message,
        data: { ...rest },
    };

    return stringify(response);
});


const errorTransport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%-error.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m',
    maxFiles: '30d',
    level: 'error',
    format: format.combine(format.timestamp(), format.json()),
});

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: 'logs/requests-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
});

const combinedTransport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%-combined.log',
    format: format.combine(format.timestamp(), format.json()),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxFiles: '30d',
});



const customLogger = WinstonModule.createLogger({
    transports: [
        errorTransport,
        combinedTransport,
        dailyRotateFileTransport,
        new transports.Console({
            format: consoleLogFormat,  // Format for the console output
        }),
        // new transports.Console({
        //     format: format.combine(
        //         format.colorize(),
        //         format.cli(),
        //         format.splat(),
        //         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
        //         format.printf((info) => {
        //             return `${info.timestamp} ${info.level}: ${info.message}`;
        //         }),
        //     ),
        // }),
    ],
})

export default customLogger;
