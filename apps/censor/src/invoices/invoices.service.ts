import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Invoice, InvoiceDocument } from '@app/database';
import { GlobalsService } from '@app/globals';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';

import { InvoiceDto } from './dto/invoice.dto';
import { UpdateInvoicesStatusDto } from './dto/update-invoice-status.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly globalsService: GlobalsService,
  ) {}
  async findInvoices(
    user: any,
    dep: boolean,
    status: string,
    fileType: string,
    page: number,
    pageSize: number,
    filterModel: string,
    sortModel: string,
  ) {
    const allStatus = this.globalsService.getCodes('status');
    console.log('allStatus', allStatus);
    const checkQuery = (value: any) => value && value !== 'ALL';
    let findQuery: any = {};
    if (checkQuery(status)) {
      findQuery.status = status;
    }
    if (checkQuery(fileType)) {
      findQuery.fileType = fileType;
    }
    if (dep) {
      findQuery.dep = user.dep;
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
    const actions = this.globalsService.getCodes('action');
    const findAction = actions.find((item: any) => item.value === action);
    if (!findAction) {
      throw new InternalServerErrorException();
    }
    const { nextStatus, prevStatus } = findAction.options;
    if (!prevStatus || !nextStatus) {
      throw new InternalServerErrorException();
    }
    return await this.invoiceModel.updateMany({ _id: { $in: ids }, status: prevStatus }, { status: nextStatus }).exec();
  }

  async removeInvoices(ids: string[]) {
    return this.invoiceModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
