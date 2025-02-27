import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Invoice, InvoiceDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/utils';

import { InvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) {}

  async findInvoices(page: number, pageSize: number, filterModel: string, sortModel: string) {
    const filterQuery = filterQueryBuilder(filterModel, ['userID', 'name']);
    const sortQuery = sortQueryBuilder(sortModel);
    const users = await this.invoiceModel
      .find(filterQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalCount = await this.invoiceModel.countDocuments(filterQuery).exec();
    return { totalCount, users };
  }

  async createInvoice(invoiceDto: InvoiceDto) {
    const user = new this.invoiceModel(invoiceDto);
    return await user.save();
  }

  async updateInvoice(id: string, invoiceDto: InvoiceDto) {
    return this.invoiceModel.findByIdAndUpdate(id, invoiceDto, { new: true }).exec();
  }

  async removeInvoice(id: string) {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }
}
