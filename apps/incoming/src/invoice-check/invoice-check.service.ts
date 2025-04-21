import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Invoice, InvoiceDocument } from '@app/database';
import { InvoiceStatus } from '@app/globals/constants';

@Injectable()
export class InvoiceCheckService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) {}

  async start(invoice: any) {
    return this.invoiceModel.findByIdAndUpdate(invoice._id, { status: InvoiceStatus.REGISTERED }, { new: true }).exec();
  }
}
