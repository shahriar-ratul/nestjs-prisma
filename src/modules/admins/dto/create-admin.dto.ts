import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateAdminDto {
    @ApiProperty({
        type: 'string',
        example: 'admin@admin.com',
        description: 'admin email',
    })
    @IsEmail()
    @MaxLength(100)
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: 'string',
        example: '123456',
        description: 'admin password',
    })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    password: string;

    @ApiProperty({
        type: 'string',
        example: 'mobile',
        description: 'admin mobile',
    })
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(255)
    mobile: string;

    @ApiProperty({
        type: 'string',
        example: 'admin',
        description: 'admin username',
    })
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    username: string;

    @ApiProperty({
        type: 'string',
        example: 'admin',
        description: 'admin firstName',
    })
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    firstName: string;

    @ApiProperty({
        type: 'string',
        example: 'admin',
        description: 'admin lastName',
    })
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    lastName: string;

    @ApiProperty({
        type: 'string',
        example: 'true',
        description: 'admin isActive',
    })
    // @IsNotEmpty()
    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        type: 'array',
        example: 'roles',
        description: 'admin roles',
        isArray: true,
    })
    @IsArray()
    @ArrayNotEmpty({
        message: 'At least 1 role is required',
    })
    roles: number[];
}
