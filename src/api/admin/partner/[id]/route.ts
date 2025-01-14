import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';
import { remoteQueryObjectFromString } from '@medusajs/framework/utils';
import { updatePartnerWorkflow } from '../../../../workflows/partner/workflows/update-partner';
import type { UpdatePartnerDTO } from '../middlewares';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve('remoteQuery');
  const { id } = req.params;

  const queryObject = remoteQueryObjectFromString({
    entryPoint: 'partner',
    fields: ['*', 'address.*'],
    variables: {
      id,
    },
  });

  const queryResult = await remoteQuery(queryObject);
  const partner = queryResult[0];

  res.status(200).json({ partner });
};

export const PUT = async (req: AuthenticatedMedusaRequest<UpdatePartnerDTO>, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve('remoteQuery');
  const { id } = req.params;
  const update = { ...req.validatedBody, id };

  const { result } = await updatePartnerWorkflow(req.scope).run({
    input: {
      partner: update,
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
