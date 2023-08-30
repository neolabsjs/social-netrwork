import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

export class GetByIdParam {
  @ApiProperty({ example: '64c3eeb87984df7cca567306' })
  @Length(24, 24)
  @Matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/, {
    message: 'Invalid ID',
  })
  id: string;
}
