import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Length(2, 200)
  name: string;

  @ApiProperty()
  @Length(5, 200)
  @IsEmail()
  email: string;

  @ApiProperty()
  @Length(8, 200)
  password: string;

  @ApiProperty()
  @Length(8, 200)
  passwordRepeat: string;
}
