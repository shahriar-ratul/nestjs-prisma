import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '@/core/dto';
import { generateSlug } from '@/core/helpers/GenerateHelpers';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RoleResponse } from '../interface/RoleResponse';

@Injectable()
export class RolesService {
    constructor(
        private readonly _prisma: PrismaService,

    ) { }

    async findAll(query: PageOptionsDto): Promise<PageDto<RoleResponse>> {
        const limit: number = query.limit || 10;
        const page: number = query.page || 1;
        const skip: number = (page - 1) * limit;
        const search = query.search || '';

        const sort = query.sort || 'id';

        const order = query.order || 'asc';



        const queryData: Prisma.RoleFindManyArgs = {
            where: {
                OR: [
                    { name: { contains: search } },
                    { slug: { contains: search } },
                ],
            },
            // include: {
            //   permissions: {
            //     include: {
            //       permission: true,
            //     }
            //   },
            // },
            take: limit,
            skip: skip,
            orderBy: {
                [sort]: order.toLowerCase(),
            },
        };
        const [items, count] = await this._prisma.$transaction([
            this._prisma.role.findMany(queryData),
            this._prisma.role.count({ where: queryData.where })
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

    async findOne(id: number) {
        return await this._prisma.role.findUnique({
            where: {
                id: id,
            },
            include: {
                permissions: {
                    select: {
                        permissionId: true,
                        permission: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                group: true,

                            },
                        },
                    },
                },
            },
        });
    }

    async create(createRoleDto: CreateRoleDto) {
        // convert name to slug
        const slug = generateSlug(createRoleDto.name);

        const checkRole = await this._prisma.role.findFirst({
            where: {
                OR: [
                    { slug: slug },
                    { name: createRoleDto.name },
                ],
            },
        });

        if (checkRole) {
            throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
        }

        const role = await this._prisma.role.create({
            data: {
                name: createRoleDto.name,
                slug: slug,
                isActive: createRoleDto.is_active,
            },
        });

        // console.log(createRoleDto.permissions);
        if (createRoleDto.permissions.length > 0) {
            for (const permission of createRoleDto.permissions) {
                await this._prisma.permissionRole.create({
                    data: {
                        roleId: role.id,
                        permissionId: permission,
                    },
                });
            }
        }

        const roleData = await this._prisma.role.findUnique({
            where: {
                id: role.id,
            },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        return {
            message: 'Role created successfully',
            data: roleData,
            permissions: roleData.permissions,
        };
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        console.log(updateRoleDto);
        // convert name to slug
        const slug = generateSlug(updateRoleDto.name);

        // update role not working

        const role = await this._prisma.role.findUnique({
            where: {
                id: id,
            },
        });

        if (!role) {
            throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
        }

        const checkRole = await this._prisma.role.findFirst({
            where: {
                NOT: {
                    id: id,
                },
                OR: [
                    { slug: slug },
                    { name: updateRoleDto.name },
                ],
            },
        });

        if (checkRole) {
            throw new HttpException('Role already exists', HttpStatus.BAD_REQUEST);
        }


        await this._prisma.role.update({
            where: {
                id: id,
            },
            data: {
                name: updateRoleDto.name,
                slug: slug,
                isActive: updateRoleDto.is_active,
            },
        });


        // delete all permissions
        await this._prisma.permissionRole.deleteMany({
            where: {
                roleId: id,
            },
        });

        // add new permissions
        if (updateRoleDto.permissions.length > 0) {
            for (const permission of updateRoleDto.permissions) {
                await this._prisma.permissionRole.create({
                    data: {
                        roleId: id,
                        permissionId: permission,
                    },
                });
            }
        }

        const roleData = await this._prisma.role.findUnique({
            where: {
                id: id,
            },
            include: {
                permissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        return {
            message: 'Role Updated successfully',
            data: roleData,
            permissions: roleData.permissions,
        };
    }

    async remove(id: number) {

        const role = await this._prisma.role.findUnique({
            where: {
                id: id,
            },
            include: {
                admins: true,
            },
        });

        if (!role) {
            throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
        }


        if (role.admins.length > 0) {
            throw new HttpException('Role is in use it cannot be deleted', HttpStatus.BAD_REQUEST);
        }




        // superadmin role cannot be deleted
        if (role.slug === 'superadmin' || role.slug === 'admin') {
            throw new HttpException(
                'Superadmin cannot be deleted',
                HttpStatus.BAD_REQUEST,
            );
        }

        // delete all permissions
        await this._prisma.permissionRole.deleteMany({
            where: {
                roleId: id,
            },
        });

        // delete role
        await this._prisma.role.delete({
            where: {
                id: id,
            },
        });



        return {
            message: 'Role deleted successfully',
            data: role,
        };
    }

    async changeStatus(id: number) {

        const role = await this._prisma.role.findUnique({
            where: {
                id: id,
            },
        });

        if (!role) {
            throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
        }

        await this._prisma.role.update({
            where: {
                id: id,
            },
            data: {
                isActive: !role.isActive,
            },
        });

        return {
            message: 'Status Changed successfully',
        };
    }

    // getAllRoles
    async getAllRoles() {

        const roles = await this._prisma.role.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return {
            message: 'Roles fetched successfully',
            roles: roles,
        };
    }
}
