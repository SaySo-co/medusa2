import { model } from '@medusajs/framework/utils';
import { partnerStatuses } from '../types/common';
import { PartnerAddress } from './address';

export const Partner = model.define('partner', {
  id: model.id({ prefix: 'partner' }).primaryKey(),
  name: model.text(),
  status: model.enum([...partnerStatuses]).default('pending'),
  stripe_connect_id: model.text(),
  address: model.hasOne(() => PartnerAddress).nullable(),
});
