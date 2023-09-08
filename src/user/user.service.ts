import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { INotificationService } from 'src/notification/interface';
import { NotificationService } from 'src/notification/notification.service';
import { UserModel } from './model';
import { IUser } from './interface';
import { CreateUserDto, UploadAvatarDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    @Inject(NotificationService)
    private readonly notificationService: INotificationService,
  ) {}

  async findAll(): Promise<IUser[]> {
    return await this.userModel.find();
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User is not defined');
    }
    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email });
  }

  async create(data: CreateUserDto): Promise<IUser> {
    const { name, email, password, passwordRepeat } = data;

    const exist = await this.userModel.findOne({ email });
    if (exist) {
      throw new ConflictException('This email is already exists');
    }

    if (password != passwordRepeat) {
      throw new BadRequestException('Passwords does not match');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  async uploadAvatarBase64(id: string, data: UploadAvatarDto): Promise<IUser> {
    const { extension, image } = data;
    const user = await this.findById(id);
    const avatarUrl = `${Date.now() + Math.random()}.${extension}`;

    if (user.avatar) {
      fs.unlink(`./avatars/${user.avatar}`, (err) =>
        err ? console.log(err) : null,
      );
    }
    fs.writeFileSync(`./avatars/${avatarUrl}`, image, { encoding: 'base64' });

    user.avatar = avatarUrl;

    return user.save();
  }

  async uploadAvatarFile(
    id: string,
    image: Express.Multer.File,
  ): Promise<IUser> {
    const user = await this.findById(id);

    if (user.avatar) {
      fs.unlink(`./avatars/${user.avatar}`, (err) =>
        err ? console.log(err) : null,
      );
    }
    user.avatar = image.filename;

    return user.save();
  }

  async subscribe(id: string, user: IUser): Promise<void> {
    const target = await this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({
        path: 'subscribers',
        select: '_id',
        match: { _id: user._id },
      });

    if (id !== user._id.toString() && target.subscribers.length === 0) {
      await this.userModel.updateOne(
        { _id: id },
        { $push: { subscribers: user } },
      );
      this.notificationService.sendNotification(
        `${user.name} has subscribed to you!`,
        target,
      );
    }
  }
}
