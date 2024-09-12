import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateAuthDto } from './dto/create-auth.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
    create(createAuthDto: CreateAuthDto) {
        return 'This action adds a new auth';
    }

    findAll() {
        return 'This action returns all auth';
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`;
    }

    update(id: number, updateAuthDto: UpdateAuthDto) {
        return `This action updates a #${id} auth`;
    }

    remove(id: number) {
        return `This action removes a #${id} auth`;
    }
}
