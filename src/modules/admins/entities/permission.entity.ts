import { ApiProperty } from "@nestjs/swagger";
import type { AdminRole, Permission, PermissionRole, Role } from "@prisma/client";

export class PermissionEntity implements Permission {
    name: string;
    slug: string;
    group: string;
    updatedAt: Date;
    groupOrder: number;
    displayName: string;
    description: string;
    isActive: boolean;
    @ApiProperty({ type: 'integer', description: 'permission id' })
    id: number;

    @ApiProperty({ description: 'When permission was created' })
    createdAt: Date;
}