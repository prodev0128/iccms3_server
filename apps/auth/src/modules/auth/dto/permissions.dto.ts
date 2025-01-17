import { ApiProperty } from '@nestjs/swagger';

export class PermissionsDto {
  @ApiProperty({
    description: 'The permissions of the user',
    example: ['read', 'write', 'delete'],
  })
  permissions: Array<string>;
}
