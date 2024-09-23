import { ApiProperty } from "@nestjs/swagger";
import { AdminPermission, Permission, PermissionRole } from "@prisma/client";

export class PermissionEntity implements Permission {
    displayName: string;
    description: string;
    isActive: boolean;
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

    roles: PermissionRole[];

    admins: AdminPermission[];
}
