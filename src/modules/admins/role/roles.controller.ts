import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    SetMetadata,
    UseGuards,
    Query,
    Put,
} from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AbilityGuard } from '@/modules/auth/ability/ability.guard';
import { PageDto, PageOptionsDto } from '@/core/dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RoleResponse } from '../interface/RoleResponse';

@ApiTags('roles')
@Controller({
    version: '1',
    path: 'roles',
})
@UseGuards(JwtAuthGuard)
@UseGuards(AbilityGuard)
export class RolesController {
    constructor(private readonly _rolesService: RolesService) { }



    @Get()
    @ApiResponse({})
    @SetMetadata('permissions', ['role.view'])
    async findAll(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PageDto<RoleResponse>> {
        return await this._rolesService.findAll(pageOptionsDto);
    }

    @Post()
    @ApiResponse({})
    @SetMetadata('permissions', ['role.create'])
    create(@Body() createRoleDto: CreateRoleDto) {
        return this._rolesService.create(createRoleDto);
    }


    @Get(':id')
    @ApiResponse({})
    @SetMetadata('permissions', ['role.view'])
    async findOne(@Param('id') id: number) {
        return this._rolesService.findOne(id);
    }

    @Put(':id')
    @ApiResponse({})
    @SetMetadata('permissions', ['role.update'])
    async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
        return this._rolesService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @ApiResponse({})
    @SetMetadata('permissions', ['role.delete'])
    async remove(@Param('id') id: number) {
        return this._rolesService.remove(id);
    }

    @Post(':id/status')
    @ApiResponse({})
    @SetMetadata('permissions', ['role.status'])
    async changeStatus(@Param('id') id: number) {
        return this._rolesService.changeStatus(+id);
    }
}
