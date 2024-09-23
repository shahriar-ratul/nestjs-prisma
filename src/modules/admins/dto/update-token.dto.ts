import { PartialType } from '@nestjs/swagger';
import { CreateTokenDto } from './create-token.dto';

export class UpdatePermissionDto extends PartialType(CreateTokenDto) { }
