import { ApiProperty } from '@nestjs/swagger';

export class CodeDto {
  @ApiProperty({
    description: 'type of code',
    example: 'type',
  })
  type: string;

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
