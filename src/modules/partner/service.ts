import { MedusaService } from '@medusajs/framework/utils';
import { Partner, PartnerAddress } from './models';

class PartnerService extends MedusaService({
  Partner,
  PartnerAddress,
}) {}

export default PartnerService;
