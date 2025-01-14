import type { MedusaContainer, MedusaResponse } from '@medusajs/framework';
import type { AuthenticatedMedusaRequest } from '@medusajs/framework';
import type { RemoteQueryObjectConfig } from '@medusajs/framework/types';
import { remoteQueryObjectFromString } from '@medusajs/framework/utils';
import { createPartnerWorkflow } from '../../../workflows/partner/workflows/create-partner';
import type { CreatePartnerDTO } from './middlewares';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve('remoteQuery');

  const queryObject = remoteQueryObjectFromString({
    entryPoint: 'partner',
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields as RemoteQueryObjectConfig<'partner'>['fields'],
  });

  const { rows: partners, metadata } = await remoteQuery(queryObject);

  res.status(200).json({ partners, count: metadata.count, offset: metadata.skip, limit: metadata.take });
};

export const POST = async (req: AuthenticatedMedusaRequest<CreatePartnerDTO>, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve('remoteQuery');

  const { result } = await createPartnerWorkflow(req.scope).run({
    input: {
      partner: { ...req.validatedBody },
    },
  });

  const queryObject = remoteQueryObjectFromString({
    entryPoint: 'partner',
    fields: ['*', 'address.*'],
    variables: {
      id: result.id,
    },
  });

  const queryResult = await remoteQuery(queryObject);
  const partner = queryResult[0];

  res.status(200).json({ partner });
};
