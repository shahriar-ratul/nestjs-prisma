import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    SetMetadata,
    UseGuards,
    Put,
    Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from '@/core/dto';
import { AbilityGuard } from '@/modules/auth/ability/ability.guard';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { Permission } from '@prisma/client';

@ApiTags('permissions')
@Controller({
    version: '1',
    path: 'permissions',
})
@UseGuards(JwtAuthGuard)
@UseGuards(AbilityGuard)
export class PermissionsController {
    constructor(private readonly _permissionsService: PermissionsService) { }

    @Get()
    @ApiResponse({})
    @SetMetadata('permissions', ['permission.view'])
    async findAll(
        @Query() pageOptionsDto: PageOptionsDto,
    ): Promise<PageDto<Permission>> {
        return this._permissionsService.findAll(pageOptionsDto);
    }

    @ApiResponse({})
    @Get(':id')
    @SetMetadata('permissions', ['permission.view'])
    async findOne(@Param('id') id: string) {
        return this._permissionsService.findOne(+id);
    }

    @ApiResponse({})
    @Post()
    @SetMetadata('permissions', ['permission.create'])
    async create(@Body() createPermissionDto: CreatePermissionDto) {
        return this._permissionsService.create(createPermissionDto);
    }

    @Put(':id')
    @ApiResponse({})
    @SetMetadata('permissions', ['permission.update'])
    async update(@Param('id') id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this._permissionsService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    @ApiResponse({})
    @SetMetadata('permissions', ['permission.delete'])
    async remove(@Param('id') id: number) {
        return this._permissionsService.remove(id);
    }


    @Post(':id/status')
    @ApiResponse({})
    @SetMetadata('permissions', ['permission.status'])
    async changeStatus(@Param('id') id: number) {
        return this._permissionsService.changeStatus(+id);
    }
}
