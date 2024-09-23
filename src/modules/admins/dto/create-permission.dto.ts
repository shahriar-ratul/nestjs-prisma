import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
    @ApiProperty({
        type: 'string',
        example: 'permission name',
        description: 'The name of the permission',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: 'string',
        example: 'permission description',
        description: 'The description of the permission',
    })
    @IsNotEmpty()
    slug: string;

    @ApiProperty({
        type: 'string',
        example: 'permission group',
        description: 'The description of the permission',
    })
    @IsNotEmpty()
    group: string;
}
