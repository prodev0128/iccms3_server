import { ApiProperty } from '@nestjs/swagger';

export class NewsDto {
  @ApiProperty({
    description: 'The title of news',
    example: 'title',
  })
  title: string;

  @ApiProperty({
    description: 'The content of news',
    example: 'content',
  })
  content: string;
}
