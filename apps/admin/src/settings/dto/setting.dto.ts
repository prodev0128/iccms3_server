import { ApiProperty } from '@nestjs/swagger';

export class SettingDto {
  @ApiProperty({
    description: 'The key of setting',
    example: 'key',
  })
  key: string;

  @ApiProperty({
    description: 'The type of setting',
    example: 'type',
  })
  name: string;

  @ApiProperty({
    description: 'The type of setting',
    example: 'type',
  })
  type: string;

  @ApiProperty({
    description: 'The value of setting',
    example: 'value',
  })
  value: string;
}
