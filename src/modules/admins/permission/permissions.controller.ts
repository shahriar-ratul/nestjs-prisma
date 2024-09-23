import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from '@/core/dto';
import { AbilityGuard } from '@/modules/auth/ability/ability.guard';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { PermissionResponse } from '../interface/PermissionResponse';

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
    ): Promise<PageDto<PermissionResponse>> {
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
}
