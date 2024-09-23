import { Permission } from "@prisma/client";

export interface PermissionResponse extends Permission {
    id: number;
    name: string;
    slug: string;
    group: string;
    createdAt: Date;
    updatedAt: Date;
}