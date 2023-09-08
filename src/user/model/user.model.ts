import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../interface';
import mongoose from 'mongoose';

@Schema()
export class UserModel implements IUser {
  @Prop({ alias: '_id' })
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop({ type: [mongoose.Types.ObjectId], ref: 'user', default: [] })
  subscribers: IUser[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
