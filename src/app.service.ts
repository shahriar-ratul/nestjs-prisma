import { Injectable } from '@nestjs/common';
import { DrizzleService } from './modules/drizzle/drizzle.service';
import { users } from './modules/drizzle/schema/schema';

@Injectable()
export class AppService {
    constructor(private readonly drizzleService: DrizzleService) { }

    async getHello() {
        return await this.drizzleService.db.select().from(users);
        return 'Hello World!';
    }
}
