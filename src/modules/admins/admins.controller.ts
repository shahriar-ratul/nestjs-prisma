import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { AdminsService } from './admins.service';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateAdminDto } from './dto/create-admin.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }

    @Post()
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.adminsService.create(createAdminDto);
    }

    @Get()
    findAll() {
        return this.adminsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.adminsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
        return this.adminsService.update(+id, updateAdminDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.adminsService.remove(+id);
    }
}
