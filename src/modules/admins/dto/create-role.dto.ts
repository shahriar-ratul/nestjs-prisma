import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

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
    @Transform(({ value }) => value.toString() === 'true')
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        type: 'array',
        example: 'permissions id',
        description: 'The permissions of the role',
        isArray: true,
    })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const permissions = JSON.parse(value);
            return permissions.map((permission: string) => Number(permission));
        }
        return value;
    })
    @IsArray()
    @ArrayNotEmpty({
        message: 'At least 1 permission is required',
    })
    permissions: number[];
}
