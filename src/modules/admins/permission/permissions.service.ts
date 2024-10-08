import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto, PageOptionsDto } from '@/core/dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Permission, Prisma } from '@prisma/client';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionsService {
    constructor(private readonly _prisma: PrismaService) { }

    async findAll(query: PageOptionsDto): Promise<PageDto<Permission>> {
        const limit: number = query.limit || 10;
        const page: number = query.page || 1;
        const skip: number = (page - 1) * limit;
        const search = query.search || '';

        const sort = query.sort || 'id';

        const order = query.order || 'asc';


        const queryData: Prisma.PermissionFindManyArgs = {
            where: {
                OR: [
                    { name: { contains: search } },
                    { slug: { contains: search } },
                    { group: { contains: search } },
                ],
            },

            take: limit,
            skip: skip,
            orderBy: {
                [sort]: order.toLowerCase(),
            },
        };
        const [items, count] = await this._prisma.$transaction([
            this._prisma.permission.findMany(queryData),
            this._prisma.permission.count({ where: queryData.where })
        ]);



        const pageOptionsDto = {
            limit: limit,
            page: page,
            skip: skip,
        };


        const pageMetaDto = new PageMetaDto({
            total: count,
            pageOptionsDto: pageOptionsDto,
        });


        return new PageDto(items, pageMetaDto);

    }

    async findOne(id: number): Promise<{ message: string, item: Permission }> {
        const item = await this._prisma.permission.findUnique({
            where: {
                id: id,
            },
        });

        if (!item) {
            throw new HttpException('Permission not found', HttpStatus.BAD_REQUEST);
        }

        return {
            message: 'Permission fetched successfully',
            item: item,
        };
    }

    async create(createPermissionDto: CreatePermissionDto) {
        const checkPermission = await this._prisma.permission.findFirst({
            where: {
                OR: [
                    { slug: createPermissionDto.slug },
                    { name: createPermissionDto.name },
                ],
            },
        });
        // console.log(checkPermission);
        if (checkPermission) {
            throw new HttpException(
                'Permission already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const permission = await this._prisma.permission.create({
            data: {
                name: createPermissionDto.name,
                slug: createPermissionDto.slug,
                group: createPermissionDto.group,
                isActive: createPermissionDto.isActive,
                description: createPermissionDto.description,
                groupOrder: createPermissionDto.groupOrder,

            },
        });

        return {
            data: permission,
            message: 'Permission created successfully',
        };
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto) {
        const checkPermission = await this._prisma.permission.findUnique({
            where: {
                id: id,
            },
        });

        if (!checkPermission) {
            throw new HttpException('Permission not found', HttpStatus.BAD_REQUEST);
        }

        const checkSlug = await this._prisma.permission.findFirst({
            where: {
                slug: updatePermissionDto.slug,
                NOT: {
                    id: id,
                },
            },

        });

        if (checkSlug) {
            throw new HttpException('Slug already exists', HttpStatus.BAD_REQUEST);
        }


        const permission = await this._prisma.permission.update({
            where: { id },
            data: {
                name: updatePermissionDto.name,
                slug: updatePermissionDto.slug,
                group: updatePermissionDto.group,
                isActive: updatePermissionDto.isActive,
                description: updatePermissionDto.description,
                groupOrder: updatePermissionDto.groupOrder,
            },
        });
        return {
            data: permission,
            message: 'Permission updated successfully',
        };
    }

    async remove(id: number) {

        const permission = await this._prisma.permission.findUnique({
            where: {
                id: id,
            },
        });

        if (!permission) {
            throw new HttpException('Permission not found', HttpStatus.BAD_REQUEST);
        }

        await this._prisma.permission.delete({
            where: { id },
        });


        return {
            message: 'Permission deleted successfully',
        };
    }

    async changeStatus(id: number) {

        const permission = await this._prisma.permission.findUnique({
            where: {
                id: id,
            },
        });

        if (!permission) {
            throw new HttpException('Permission not found', HttpStatus.BAD_REQUEST);
        }

        await this._prisma.permission.update({
            where: {
                id: id,
            },
            data: {
                isActive: !permission.isActive,
            },
        });

        return {
            message: 'Status Changed successfully',
        };
    }



    // getAllPermissions
    async getAllPermissions() {
        try {
            const permissions = await this._prisma.permission.findMany({
                where: {
                    isActive: true,
                },
                orderBy: [
                    { groupOrder: 'asc' },
                    { name: 'asc' }
                ],
            });

            const groupedPermissions = [];

            for (const permission of permissions) {
                const { group, name, groupOrder } = permission;

                if (!group || !name) {
                    console.error('Invalid permission object:', permission);
                    continue; // Skip invalid permissions
                }

                let existingGroup = groupedPermissions.find(
                    (groupItem) => groupItem.groupOrder === groupOrder,
                );

                if (!existingGroup) {
                    existingGroup = {
                        groupName: group,
                        groupOrder: groupOrder,
                        permissions: [],
                    };
                    groupedPermissions.push(existingGroup);
                }

                existingGroup.permissions.push(permission);
            }

            // Sort the groupedPermissions array by groupOrder
            groupedPermissions.sort((a, b) => a.groupOrder - b.groupOrder);

            // Sort the permissions in each group alphabetically by name
            for (const group of groupedPermissions) {
                group.permissions.sort((a, b) => a.name.localeCompare(b.name));
            }

            return {
                message: 'Permissions retrieved successfully',
                total: permissions.length,
                permissions: groupedPermissions,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to retrieve permissions');
        }
    }
}
