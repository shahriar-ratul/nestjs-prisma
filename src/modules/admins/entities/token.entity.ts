import { ApiProperty } from "@nestjs/swagger";
import { AdminToken } from "@prisma/client";

export class TokenEntity implements AdminToken {
    refreshToken: string;
    @ApiProperty({ type: 'integer', description: 'token id' })
    id: number;

    @ApiProperty({ type: 'integer', description: 'admin id' })
    adminId: number;

    @ApiProperty({ type: 'string', description: 'token' })
    token: string;

    @ApiProperty({ type: 'string', description: 'token type' })
    ip: string;

    @ApiProperty({ type: 'string', description: 'token type' })
    userAgent: string;

    @ApiProperty({ type: 'string', description: 'token type' })
    expiresAt: Date;

    @ApiProperty({ type: 'boolean', description: 'token type' })
    isRevoked: boolean;

    @ApiProperty({ type: 'string', description: 'token type' })
    revokedAt: Date;

    @ApiProperty({ type: 'integer', description: 'token type' })
    revokedBy: number;

    @ApiProperty({ type: 'string', description: 'token type' })
    revokedByIp: string;

    @ApiProperty({ type: 'string', description: 'token type' })
    createdAt: Date;

    @ApiProperty({ type: 'string', description: 'token type' })
    updatedAt: Date;
}