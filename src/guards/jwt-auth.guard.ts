/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    type ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// biome-ignore lint/style/useImportType: <explanation>
import { Reflector } from '@nestjs/core';
import type { JwtService } from '@nestjs/jwt';

import 'dotenv/config';

import type { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/core/decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        // private TokenService: TokenService,
        private jwtService: JwtService,
        private reflector: Reflector
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();

        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic) {
            // 💡 See this condition
            return true;
        }

        const token = request.headers.authorization?.split(' ')[1] || '';

        if (!token) {
            throw new UnauthorizedException();
        }

        // check token is valid or not

        try {
            await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
        } catch {
            throw new UnauthorizedException();
        }

        if (token) {
            // check token is exist in database or not
            // const isRevoked = await this.TokenService.isRevokedToken(token);
            // if (isRevoked) {
            //   throw new UnauthorizedException();
            // }
        }

        return super.canActivate(context) as Promise<boolean>;
    }
}
