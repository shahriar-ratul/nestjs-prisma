import { Injectable } from '@nestjs/common';

import { CreateTokenDto } from '../dto/create-token.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';


@Injectable()
export class TokenService {
    constructor(
        private readonly _prisma: PrismaService,
    ) { }

    async create(createTokenDto: CreateTokenDto) {

        this._prisma.adminToken.create({
            data: {
                token: createTokenDto.token || '',
                refreshToken: createTokenDto.refresh_token || '',
                ip: createTokenDto.ip || '',
                userAgent: createTokenDto.userAgent || '',
                expiresAt: createTokenDto.expires_at,
                admin: {
                    connect: {
                        id: Number(createTokenDto.admin_id),
                    },
                },
            },
        });

        return {
            message: 'Token Created Successfully',

        }
    }

    async findById(id: number) {

        return await this._prisma.adminToken.findUnique({
            where: {
                id: id,
            },
        });


    }

    async findByAdminId(adminId: number) {

        return await this._prisma.adminToken.findMany({
            include: {
                admin: true,
            },
            where: {
                adminId: adminId,
            },
        });



    }

    async findByToken(token: string) {
        return await this._prisma.adminToken.findFirst({
            where: {
                token: token,
            },
        });
    }

    // isRevokedToken
    async isRevokedToken(token: string) {
        const tokenData = await this._prisma.adminToken.findFirst({
            where: {
                token: token,
            },
        });

        if (!tokenData) {
            return false;
        }

        if (tokenData.isRevoked) {
            return true;
        }

        return false;
    }
}
