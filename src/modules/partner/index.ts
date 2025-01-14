import { Module } from '@medusajs/framework/utils';
import Service from './service';

export const PARTNER_MODULE = 'partner';

export default Module(PARTNER_MODULE, {
  service: Service,
});
