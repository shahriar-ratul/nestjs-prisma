import {
    type MiddlewareConsumer,
    Module,
    type NestModule,
    type ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
// import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
// import { redisStore } from 'cache-manager-redis-yet';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AdminsModule } from './modules/admins/admins.module';
import {
    APP_FILTER,
    APP_GUARD,
    APP_INTERCEPTOR,
    APP_PIPE,
    Reflector,
} from '@nestjs/core';
import {
    AllExceptionsFilter,
    BadRequestExceptionFilter,
    ForbiddenExceptionFilter,
    NotFoundExceptionFilter,
    UnauthorizedExceptionFilter,
    ValidationExceptionFilter,
} from './core/filters';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { ResponseInterceptor } from './core/interceptor/response.interceptor';
import { ErrorFilter } from './core/filters/error.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        MulterModule.register({
            dest: './public',
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'public'),
            exclude: ['/api/(.*)', '/docs'],
            serveRoot: '/public',
        }),

        ThrottlerModule.forRoot([
            {
                ttl: 1,
                limit: 100,
            },
        ]),
        // AuthModule,
        // AdminsModule,
        // UsersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // {
        //   provide: APP_INTERCEPTOR,
        //   useClass: CacheInterceptor,
        // },
        {
            provide: 'APP_GUARD',
            useClass: ThrottlerGuard,
        },

        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ErrorFilter,
        },
        // {
        //   provide: APP_GUARD,
        //   useClass: JwtAuthGuard,
        // },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_FILTER, useClass: ValidationExceptionFilter },
        { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
        { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
        { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
        { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
        {
            provide: APP_PIPE,
            useFactory: () =>
                new ValidationPipe({
                    exceptionFactory: (errors: ValidationError[]) => {
                        return errors[0];
                    },
                }),
        },

        Reflector,
    ],
    exports: [ConfigModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
