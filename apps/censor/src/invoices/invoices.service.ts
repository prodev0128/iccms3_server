import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Invoice, InvoiceDocument } from '@app/database';
// import { invoiceActions, invoiceStatus } from '@app/globals/constants';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';

// import { getRandomInt } from '@app/globals/utils';

import { InvoiceDto } from './dto/invoice.dto';
import { UpdateInvoicesStatusDto } from './dto/update-invoice-status.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
  ) {}
  async findInvoices(
    user: any,
    status: string,
    fileType: string,
    page: number,
    pageSize: number,
    filterModel: string,
    sortModel: string,
  ) {
    // Add Query
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
    return invoice.save();
  }

  async updateInvoice(id: string, invoiceDto: InvoiceDto) {
    return this.invoiceModel.findByIdAndUpdate(id, invoiceDto, { new: true }).exec();
  }

  async updateInvoicesStatus(updateDto: UpdateInvoicesStatusDto) {
    const { action, ids } = updateDto;
    console.log(action, ids);
    // switch (event.action) {
    //   case invoiceActions.REGISTER:
    //     if (event.work) {
    //       const prevStatus = invoiceStatus.UNDEFINED;
    //       const nextStatus = 'REGISTERED';
    //       const available = await this.invoiceModel.find({ _id: { $in: ids }, status: prevStatus }).exec();
    //       console.log('available', available);
    //       return await this.invoiceModel
    //         .updateMany({ _id: { $in: ids }, status: prevStatus }, { status: nextStatus })
    //         .exec();
    //     } else {
    //     }
    //     break;
    // }
  }

  async removeInvoices(ids: string[]) {
    return this.invoiceModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
