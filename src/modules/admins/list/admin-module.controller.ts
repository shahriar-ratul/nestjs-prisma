import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AbilityGuard } from './../../auth/ability/ability.guard';
import { PermissionsService } from '../permission/permissions.service';
import { RolesService } from '../role/roles.service';
import { AdminsService } from '../admin/admins.service';
import { JwtAuthGuard } from './../../auth/guards/jwt-auth.guard';

@ApiTags('common')
@Controller({
    version: '1',
    path: 'common',
})
@UseGuards(JwtAuthGuard)
@UseGuards(AbilityGuard)
export class AdminModuleController {
    constructor(
        private readonly _permissionsService: PermissionsService,
        private readonly _rolesService: RolesService,
        private readonly _adminsService: AdminsService,
    ) { }

    // common/all-permissions
    @ApiResponse({})
    @Get('/all-permissions')
    @SetMetadata('permissions', ['permission.view'])
    async getAllPermissions() {
        return this._permissionsService.getAllPermissions();
    }

    // common/all-roles
    @ApiResponse({})
    @Get('/all-roles')
    @SetMetadata('permissions', ['role.view'])
    async getAllRoles() {
        return this._rolesService.getAllRoles();
    }

    // common/all-admins
    @ApiResponse({})
    @Get('/all-admins')
    @SetMetadata('permissions', ['admin.view'])
    async getAllAdmins() {
        return this._adminsService.getAllAdmins();
    }
}
