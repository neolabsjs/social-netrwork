import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsString, Length } from 'class-validator';

export class UploadAvatarDto {
  @ApiProperty({ example: '123456789' })
  @IsBase64()
  image: string;

  @ApiProperty({ example: 'jpeg' })
  @IsString()
  @Length(1, 50)
  extension: string;
}
