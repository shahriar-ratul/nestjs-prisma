import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

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

    @ApiProperty({
        type: 'number',
        example: 1,
        description: 'The order of the permission',
    })
    @IsNotEmpty()
    groupOrder: number;

    @ApiProperty({
        type: 'string',
        example: 'permission description',
        description: 'The description of the permission',
    })
    @IsOptional()
    description: string;


    @ApiProperty({
        type: 'boolean',
        example: true,
        description: 'The status of the permission',
    })
    @Transform(({ value }) => value.toString() === 'true')
    @IsNotEmpty()
    isActive: boolean;



}
