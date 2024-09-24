import { WinstonModule } from 'nest-winston';
import *  as  winston from 'winston';
import 'winston-daily-rotate-file';

const { transports, format } = winston;

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
            format: format.combine(
                format.colorize(),
                format.cli(),
                format.splat(),
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
                format.printf((info) => {
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                }),
            ),
        }),
    ],
})

export default customLogger;
