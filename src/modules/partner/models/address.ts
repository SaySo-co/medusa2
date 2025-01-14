import { model } from '@medusajs/framework/utils';
import { Partner } from './partner';

export const PartnerAddress = model.define('partner_address', {
  id: model.id({ prefix: 'part_addr' }).primaryKey(),
  address_1: model.text(),
  address_2: model.text().nullable(),
  city: model.text().nullable(),
  province: model.text().nullable(),
  postal_code: model.text().nullable(),
  country_code: model.text().nullable(),
  metadata: model.json().nullable(),
  partner: model.belongsTo(() => Partner, {
    mappedBy: 'address',
  }),
});
