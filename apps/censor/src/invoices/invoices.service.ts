import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { find } from 'rxjs';

import { Invoice, InvoiceDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';

// import { getRandomInt } from '@app/globals/utils';

import { InvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) {}

  async findInvoices(
    user: any,
    status: string,
    fileType: string,
    page: number,
    pageSize: number,
    filterModel: string,
    sortModel: string,
  ) {
    // const fileTypes = ['Email', 'Ftp', 'Out-Ftp'];
    // const invoice = new this.invoiceModel({
    //   name: `${getRandomInt(1000, 9999)}`,
    //   fileType: fileTypes[getRandomInt(0, 2)],
    //   org: '',
    //   status: '',
    // });
    // await invoice.save();

    const checkQuery = (value) => value && value !== 'ALL';
    let findQuery: any = {};
    if (checkQuery(status)) {
      findQuery.status = status;
    }
    if (checkQuery(fileType)) {
      findQuery.fileType = fileType;
    }
    const filterQuery = filterQueryBuilder(filterModel, ['userID', 'name']);
    findQuery = { ...findQuery, ...filterQuery };
    const sortQuery = sortQueryBuilder(sortModel);
    const invoices = await this.invoiceModel
      .find(findQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalCount = await this.invoiceModel.countDocuments(findQuery).exec();
    return { totalCount, invoices };
  }

  async createInvoice(invoiceDto: InvoiceDto) {
    const invoice = new this.invoiceModel(invoiceDto);
    return await invoice.save();
  }

  async updateInvoice(id: string, invoiceDto: InvoiceDto) {
    return this.invoiceModel.findByIdAndUpdate(id, invoiceDto, { new: true }).exec();
  }

  async removeInvoice(id: string) {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }
}
