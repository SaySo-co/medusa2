import { logger } from '@medusajs/framework/logger';
import { MedusaError } from '@medusajs/framework/utils';
import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk';
import { PARTNER_MODULE } from '../../../modules/partner';
import type PartnerService from '../../../modules/partner/service';
import type { UpdatePartnerInput } from '../../../modules/partner/types/mutations';

export const updatePartnerStepId = 'update-partner-step';

export const updatePartnerStep = createStep(
  updatePartnerStepId,
  async (data: UpdatePartnerInput, { container }) => {
    const partnerService = container.resolve<PartnerService>(PARTNER_MODULE);

    const existingPartner = await partnerService.retrievePartner(data.id, {
      relations: ['address'],
    });

    if (!existingPartner) throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Partner not found');

    if (existingPartner.address?.id && data.address) {
      data.address.id = existingPartner.address.id;
    }

    const updatedPartner = await partnerService.updatePartners(data);

    return new StepResponse(updatedPartner, { ...existingPartner });
  },
  async (data, { container }) => {
    if (!data) return;

    const partnerService = container.resolve<PartnerService>(PARTNER_MODULE);

    return await partnerService.updatePartners(data);
  },
);
