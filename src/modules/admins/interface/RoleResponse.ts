import { AdminRole, PermissionRole } from "@prisma/client";

export interface RoleResponse {
    id: number;
    name: string;
    slug: string;
    permissions?: PermissionRole[];
    admins?: AdminRole[];
    createdAt: Date;
    updatedAt: Date;
}