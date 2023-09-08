import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IUser } from '../interface';

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

  @Prop({ type: [mongoose.Types.ObjectId], ref: 'UserModel', default: [] })
  subscribers: IUser[];
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
