import { ApiProperty } from '@nestjs/swagger';

export class RolesDto {
  @ApiProperty({
    description: 'The roles of the user',
    example: ['read', 'write', 'delete'],
  })
  roles: Array<string>;
}
