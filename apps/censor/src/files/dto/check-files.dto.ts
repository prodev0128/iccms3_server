import { ApiProperty } from '@nestjs/swagger';

export class CheckFilesDto {
  @ApiProperty({
    description: 'The ids to check the files',
    example: ['file1', 'file2', 'file3'],
  })
  ids: Array<string>;
}
