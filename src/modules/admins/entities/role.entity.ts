import { ApiProperty } from "@nestjs/swagger";
import type { AdminRole, PermissionRole, Role } from "@prisma/client";

export class RoleEntity implements Role {
    displayName: string;

    @ApiProperty({ type: 'integer', description: 'permission id' })
    id: number;

    @ApiProperty({ description: 'When permission was created' })
    createdAt: Date;

    @ApiProperty({ description: 'When permission was updated' })
    updatedAt: Date;

    @ApiProperty({ type: 'string', description: 'permission name' })
    name: string;

    @ApiProperty({ type: 'string', description: 'permission slug' })
    slug: string;

    @ApiProperty({ type: 'string', description: 'permission group' })
    group: string;

    @ApiProperty({ type: 'string', description: 'permission description' })
    description: string;


    @ApiProperty({ type: 'boolean', description: 'permission status' })
    isActive: boolean;

    permissions: PermissionRole[];

    admins: AdminRole[];
}
