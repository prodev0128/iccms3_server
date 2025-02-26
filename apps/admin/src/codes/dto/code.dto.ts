import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CodeDto {
  @ApiProperty({
    description: 'id of code option',
    example: 'optionID',
  })
  optionID: Types.ObjectId;

  @ApiProperty({
    description: 'value of code',
    example: 'value',
  })
  value: string;

  @ApiProperty({
    description: 'name of code',
    example: 'name',
  })
  name: string;
}
