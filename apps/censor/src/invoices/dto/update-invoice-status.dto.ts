import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateInvoicesStatusDto {
  @ApiProperty({
    description: 'Array of invoice ids to update.',
    example: ['invoice1', 'invoice2', 'invoice3'],
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

  @ApiPropertyOptional({ description: 'Progress of invoice' })
  @IsString()
  @IsOptional()
  progress?: number;
}
