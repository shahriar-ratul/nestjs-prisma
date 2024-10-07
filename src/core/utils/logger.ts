import { WinstonModule } from 'nest-winston';
import { format, transports } from "winston";
import 'winston-daily-rotate-file';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();

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
const consoleLogFormat = printf(({ level, message, timestamp, requestId, ...rest }) => {
    const response = {
        level,
        timestamp,
        requestId,
        message,
        data: { ...rest }
    };

    return stringify(response);
});

const requestIdFormat = format((info) => {
    const store = asyncLocalStorage.getStore();
    if (store?.requestId) {
        info.requestId = store.requestId;
    } else if (info.context?.requestId) {
        info.requestId = info.context.requestId;
    } else {
        info.requestId = 'N/A';
    }
    info.context = undefined; // Remove context to avoid duplication
    return info;
});

const errorTransport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%-error.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m',
    maxFiles: '30d',
    level: 'error',
    format: format.combine(requestIdFormat(), format.timestamp(), format.json()),
});

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: 'logs/requests-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: format.combine(requestIdFormat(), format.timestamp(), format.json()),
});

const combinedTransport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%-combined.log',
    format: format.combine(requestIdFormat(), format.timestamp(), format.json()),
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
            format: combine(
                timestamp({ format: timestampFormat }),
                requestIdFormat(),
                consoleLogFormat
            ),
        }),
    ],
})

export default customLogger;
