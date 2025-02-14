import { ApiProperty } from '@nestjs/swagger';

export class CodeOptionDto {
  @ApiProperty({
    description: 'type of code option',
    example: 'type',
  })
  type: string;

  @ApiProperty({
    description: 'name of code option',
    example: 'name',
  })
  name: string;
}
