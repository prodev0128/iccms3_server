import { ApiProperty } from '@nestjs/swagger';

export class CensorFilesDto {
  @ApiProperty({
    description: 'The ids to check the files',
    example: ['file1', 'file2', 'file3'],
  })
  ids: Array<string>;

  @ApiProperty({
    description: 'The censor flag of the files',
    example: 'PUBLIC',
  })
  cenFlag: string;
}
