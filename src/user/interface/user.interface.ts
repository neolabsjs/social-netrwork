import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId | string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  subscribers: IUser[];

  save?(): Promise<IUser>;
}
