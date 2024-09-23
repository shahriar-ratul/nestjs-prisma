import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@/core/decorator';

@ApiTags('app')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get Hello Successful',
    })
    @Public()
    @ApiResponse({})
    async getHello(): Promise<string> {
        return await this.appService.getHello();
    }
}
