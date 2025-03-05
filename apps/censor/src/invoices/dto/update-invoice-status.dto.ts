import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class UpdateInvoicesStatusDto {
  @ApiProperty({
    description: 'Array of invoice IDs to update.',
    example: ['invoice123', 'invoice456'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  ids: string[];

  @ApiProperty({
    description: 'The action of the event.',
    example: 'REGISTER',
  })
  @IsString()
  action: string;
}
