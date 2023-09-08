import { IUser } from 'src/user/interface';

export interface INotificationService {
  sendNotification(message: string, user: IUser): void;
}
