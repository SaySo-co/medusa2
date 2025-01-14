import type { WorkflowData } from '@medusajs/framework/workflows-sdk';
import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk';
import type { CreatePartnerWorkflowInput } from '../../../modules/partner/types/mutations';
import { createPartnerStep } from '../steps/create-partner';

export const createPartnerWorkflow = createWorkflow(
  'create-partner-workflow',
  (input: WorkflowData<CreatePartnerWorkflowInput>) => {
    const partner = createPartnerStep(input.partner);

    return new WorkflowResponse(partner);
  },
);
