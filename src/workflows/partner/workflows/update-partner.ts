import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk';
import type { WorkflowData } from '@medusajs/framework/workflows-sdk';
import type { UpdatePartnerWorkflowInput } from '../../../modules/partner/types/mutations';
import { updatePartnerStep } from '../steps/update-partner';

export const updatePartnerWorkflow = createWorkflow(
  'update-partner-workflow',
  (input: WorkflowData<UpdatePartnerWorkflowInput>) => {
    const partner = updatePartnerStep(input.partner);

    return new WorkflowResponse(partner);
  },
);
