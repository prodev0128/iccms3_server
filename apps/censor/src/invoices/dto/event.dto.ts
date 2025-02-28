import { ApiProperty } from '@nestjs/swagger';

export class EventDto {
  @ApiProperty({
    description: 'The action of the event.',
    example: 'REGISTER',
  })
  action: string;

  @ApiProperty({
    description: 'If true means to do, then false means to undo.',
    example: true,
  })
  work: boolean;
}
