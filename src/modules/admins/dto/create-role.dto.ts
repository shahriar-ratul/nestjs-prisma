import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({
        type: 'string',
        example: 'role name',
        description: 'The name of the role',
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: 'string',
        example: 'true or false',
        description: 'Role is active or not',
    })
    @IsNotEmpty()
    @IsBoolean()
    is_active: boolean;

    @ApiProperty({
        type: 'array',
        example: 'permissions id',
        description: 'The permissions of the role',
        isArray: true,
    })
    @IsNotEmpty()
    @IsArray()
    permissions: number[];
}
