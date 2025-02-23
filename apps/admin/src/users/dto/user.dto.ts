import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The user ID of the user',
    example: 'userID',
  })
  userID: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}
