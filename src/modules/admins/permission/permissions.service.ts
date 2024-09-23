import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PageDto, PageMetaDto, PageOptionsDto } from '@/core/dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PermissionResponse } from '../interface/PermissionResponse';

@Injectable()
export class PermissionsService {
    constructor(private readonly _prisma: PrismaService) { }

    async findAll(query: PageOptionsDto): Promise<PageDto<PermissionResponse>> {
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


        // const transformedResult = items.map((item) => {
        //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //   delete item.password;
        //   return item;
        // });

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

    async findOne(id: number): Promise<PermissionResponse> {
        return await this._prisma.permission.findUnique({
            where: {
                id: id,
            },
        });
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
            },
        });

        return {
            data: permission,
            message: 'Permission created successfully',
        };
    }

    // getAllPermissions
    async getAllPermissions() {
        try {
            const permissions = await this._prisma.permission.findMany({
                orderBy: {
                    group: 'asc',
                    name: 'asc',
                },
            });

            const groupedPermissions = [];

            for (const permission of permissions) {
                const { group, name } = permission;

                if (!group || !name) {
                    console.error('Invalid permission object:', permission);
                    continue; // Skip invalid permissions
                }

                let existingGroup = groupedPermissions.find(
                    (groupItem) => groupItem.groupName === group,
                );

                if (!existingGroup) {
                    existingGroup = {
                        groupName: group,
                        permissions: [],
                    };
                    groupedPermissions.push(existingGroup);
                }

                existingGroup.permissions.push(permission);
            }

            // Sort the groupedPermissions array alphabetically by group name
            groupedPermissions.sort((a, b) => a.groupName.localeCompare(b.groupName));

            // Sort the permissions in each group alphabetically by name
            for (const group of groupedPermissions) {
                group.permissions.sort((a, b) => a.name.localeCompare(b.name));
            }

            // console.log(groupedPermissions); // For debugging


            // console.log(groupedPermissions);
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
