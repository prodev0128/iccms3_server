import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'Department information (if applicable).' })
  @IsString()
  @IsOptional()
  dep?: string;

  @ApiPropertyOptional({ description: 'Censor information (if applicable).' })
  @IsString()
  @IsOptional()
  censor?: string;

  @ApiPropertyOptional({ description: 'Checker information (if applicable).' })
  @IsString()
  @IsOptional()
  checker?: string;
}
