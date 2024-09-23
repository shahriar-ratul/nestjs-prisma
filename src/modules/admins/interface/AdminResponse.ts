import { PermissionEntity } from "../entities/permission.entity";
import { RoleEntity } from "../entities/role.entity";

export interface AdminResponse {
    id: number;
    username: string;
    email: string;
    mobile: string;

    permissions?: PermissionEntity[] | null;
    roles?: RoleEntity[] | null;
}
