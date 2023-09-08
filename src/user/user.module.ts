import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel, UserSchema } from './model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './avatars',
        filename: (_req, file, cb) =>
          cb(
            null,
            `${Date.now() + Math.random()}.${file.originalname
              .split('.')
              .pop()}`,
          ),
      }),
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
