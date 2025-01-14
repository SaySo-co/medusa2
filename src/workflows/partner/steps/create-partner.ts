import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk';
import { PARTNER_MODULE } from '../../../modules/partner';
import type PartnerService from '../../../modules/partner/service';
import type { CreatePartnerInput } from '../../../modules/partner/types/mutations';

const createPartnerStepId = 'create-partner-step';

export const createPartnerStep = createStep(
  createPartnerStepId,
  async (data: CreatePartnerInput, { container }) => {
    const partnerService = container.resolve<PartnerService>(PARTNER_MODULE);

    const partner = await partnerService.createPartners(data);

    return new StepResponse(partner);
  },
  async (data, { container }) => {
    if (!data) return;
    const partnerService = container.resolve<PartnerService>(PARTNER_MODULE);

    const partner = await partnerService.deletePartners(data.id);

    return new StepResponse(partner);
  },
);
