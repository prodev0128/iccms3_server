import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { News, NewsDocument } from '@app/database';

import { NewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async findNews() {
    const news = await this.newsModel.find().exec();
    return { news };
  }

  async createNews(newsDto: NewsDto) {
    const news = new this.newsModel(newsDto);
    return await news.save();
  }

  async updateNews(id: string, newsDto: NewsDto) {
    return this.newsModel.findByIdAndUpdate(id, newsDto, { new: true }).exec();
  }

  async removeNews(id: string) {
    return this.newsModel.findByIdAndDelete(id).exec();
  }
}
