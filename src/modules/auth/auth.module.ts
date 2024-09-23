import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from '../admins/admins.module';

import 'dotenv/config';
import { AbilityFactory } from './ability/ability.factory';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        //  JwtModule.registerAsync(jwtConfig),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '3d',
                },
                global: true,
            }),
        }),
        AdminsModule,
        forwardRef(() => UsersModule),
    ],
    providers: [AuthService, JwtStrategy, RefreshJwtStrategy, AbilityFactory],
    controllers: [AuthController],
    exports: [AuthService, JwtModule, AbilityFactory, JwtStrategy],
})
export class AuthModule { }
