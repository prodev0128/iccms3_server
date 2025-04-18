import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { File, FileDocument, Invoice, InvoiceDocument } from '@app/database';
import { GlobalsService } from '@app/globals';
import { DataTypes, FindCategory, InvoiceActions, InvoiceStatus, Roles } from '@app/globals/constants';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';
import { divideWithPrecision } from '@app/globals/utils';

import { InvoiceDto } from './dto/invoice.dto';
import { UpdateInvoicesStatusDto } from './dto/update-invoice-status.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly globalsService: GlobalsService,
  ) {}
  async findInvoices(
    user: any,
    category: string,
    minStatus: string,
    maxStatus: string,
    dataType: string,
    page: number,
    pageSize: number,
    filterModel: string,
    sortModel: string,
  ) {
    const findQuery1: any = {};

    // category
    if (category === FindCategory.ALL) {
      if (!user.roles.includes(Roles.RECEIPT_VIEW)) {
        category = FindCategory.DEP;
      }
    }
    if (category === FindCategory.DEP) {
      if (!user.roles.includes(Roles.DEP_VIEW)) {
        category = FindCategory.MINE;
      } else {
        findQuery1.dep = user.dep;
      }
    }
    if (category === FindCategory.MINE) {
      if (!user.roles.includes(Roles.PERSONAL_VIEW)) {
        return { totalCount: 0, invoices: [] };
      }
      if (minStatus === InvoiceStatus.ASSIGNED && maxStatus === InvoiceStatus.ASSIGNED) {
        findQuery1.censor = user.userID;
      } else if (minStatus === InvoiceStatus.CENSORED && maxStatus === InvoiceStatus.CENSORED) {
        findQuery1.checker = user.userID;
      } else {
        findQuery1.$or = [{ censor: user.userID }, { checker: user.userID }];
      }
    }

    // min, max status
    const allStatus = this.globalsService.getCodes('status');
    const foundMinStatus = allStatus.find((status: any) => status.value === minStatus);
    const foundMaxStatus = allStatus.find((status: any) => status.value === maxStatus);
    if (!foundMinStatus || !foundMaxStatus) {
      throw new InternalServerErrorException();
    }
    const foundStatus = allStatus
      .filter(
        (status: any) =>
          status.options.value >= foundMinStatus.options.value && status.options.value <= foundMaxStatus.options.value,
      )
      .map((status: any) => status.value);
    if (!foundStatus.length) {
      throw new InternalServerErrorException();
    }
    if (foundStatus.length === 1) {
      findQuery1.status = foundStatus[0];
    } else {
      findQuery1.status = { $in: foundStatus };
    }

    // file type
    if (dataType !== DataTypes.ALL) {
      findQuery1.dataType = dataType;
    }

    // filter with grid
    const findQuery2 = filterQueryBuilder(filterModel, ['name']);
    const findQuery = { $and: [findQuery1, findQuery2] };
    const sortQuery1: Record<string, 1 | -1> = { createdAt: -1 };
    const sortQuery2: Record<string, 1 | -1> = sortQueryBuilder(sortModel);
    const sortQuery: Record<string, 1 | -1> = { ...sortQuery1, ...sortQuery2 };
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
    const { action, ids, ...more } = updateDto;
    const actions = this.globalsService.getCodes('action');
    const findAction = actions.find((item: any) => item.value === action);
    if (!findAction) {
      throw new InternalServerErrorException();
    }
    const { nextStatus, prevStatus } = findAction.options;
    if (!prevStatus || !nextStatus) {
      throw new InternalServerErrorException();
    }
    switch (action) {
      case InvoiceActions.UNTRANSFER:
        more.dep = '';
        break;
      case InvoiceActions.UNASSIGN:
        more.censor = more.checker = '';
        break;
      case InvoiceActions.CENSOR:
        more.progress = 100;
    }
    const findQuery = { _id: { $in: ids }, status: prevStatus };
    const updateQuery = { status: nextStatus, ...more };
    return this.invoiceModel.updateMany(findQuery, updateQuery).exec();
  }

  async removeInvoices(ids: string[]) {
    return this.invoiceModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async updateInvoiceProgress(id: string) {
    const fileItems = await this.fileModel
      .find({ invoiceID: new Types.ObjectId(id) })
      .select(['cenFlag'])
      .exec();
    const cenCount = fileItems.filter((item) => item.cenFlag).length;
    const progress = divideWithPrecision(100 * cenCount, fileItems.length, 2);
    return this.invoiceModel.findByIdAndUpdate(id, { progress }, { new: true }).exec();
  }
}
