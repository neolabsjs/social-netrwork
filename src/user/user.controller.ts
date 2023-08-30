import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetByIdParam } from 'src/utils';
import { UserService } from './user.service';
import { IUser } from './interface';
import { CreateUserDto, UploadAvatarDto } from './dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<IUser[]> {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() data: CreateUserDto): Promise<IUser> {
    return await this.userService.create(data);
  }

  @Put('/base64/:id')
  async uploadAvatarBase64(
    @Param() { id }: GetByIdParam,
    @Body() data: UploadAvatarDto,
  ): Promise<IUser> {
    return await this.userService.uploadAvatarBase64(id, data);
  }

  @Put('/file/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async uploadAvatarFile(
    @Param() { id }: GetByIdParam,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IUser> {
    return await this.userService.uploadAvatarFile(id, image);
  }
}
