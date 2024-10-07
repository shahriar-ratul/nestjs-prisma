import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import type { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'node:path';
import {
    Logger,
    RequestMethod,
    VERSION_NEUTRAL,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import customLogger from './core/utils/logger';
import { AsyncLocalStorage } from 'node:async_hooks';
import { v4 as uuidv4 } from 'uuid';

const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();

async function bootstrap() {
    // Load environment variables from .env file
    config();
    const logger = new Logger();

    const port = process.env.PORT || 4000;
    const app_debug = process.env.APP_DEBUG || false;

    // const app = await NestFactory.create(AppModule);

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true,
        // logger: customLogger,
    });


    app.use(cookieParser());
    app.useBodyParser('json', { limit: '20mb' });

    // app.useStaticAssets(join(__dirname, '..', 'public'));
    app.useStaticAssets(join(__dirname, '..', 'static'));

    // cors
    app.enableCors({
        origin: '*',
    });

    // app.useGlobalPipes(new ValidationPipe());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidUnknownValues: true,
            forbidNonWhitelisted: true,
        })
    );

    // Enable trust for the proxy
    app.getHttpAdapter().getInstance().set('trust proxy', true);

    // prefix
    app.setGlobalPrefix('api', {
        exclude: [
            { path: '/', method: RequestMethod.GET },
            { path: 'docs', method: RequestMethod.GET },
        ],
    });

    // Versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL,
    });

    // docs
    if (app_debug === 'true') {
        // Swagger
        const config = new DocumentBuilder()
            .setTitle('API Documentation')
            .setDescription('API description')
            .setVersion('1.0')
            .addTag('docs')
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    // Move this middleware to the top of the middleware chain
    // app.use((req, res, next) => {
    //     const requestId = uuidv4();
    //     asyncLocalStorage.run({ requestId }, () => {
    //         next();
    //     });
    // });

    // Update the logging middleware to use the requestId from asyncLocalStorage
    // app.use((req: any, res: any, next: any) => {
    //     const { requestId } = asyncLocalStorage.getStore() || { requestId: 'N/A' };
    //     logger.log(`Request ${req.method} ${req.originalUrl}`, { requestId });
    //     next();
    // });

    (app as any).set('etag', false);

    app.use((req, res, next) => {
        res.removeHeader('x-powered-by');
        res.removeHeader('date');
        next();
    });

    logger.log(`Server running on http://localhost:${port}`);

    await app.listen(port);
}
bootstrap();
