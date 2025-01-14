import { type MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from '@medusajs/framework/http';
import { createSelectParams } from '@medusajs/medusa/api/utils/validators';
import { z } from 'zod';
import { partnerStatuses } from '../../../modules/partner/types/common';

const defaultAdminStorefrontFields = ['id', 'name', 'status', 'stripe_connect_id', 'address.*'];

const addressSchema = z.object({
  address_1: z.string(),
  address_2: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  country_code: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const createPartnerDTOSchema = z.object({
  name: z.string(),
  status: z.enum([...partnerStatuses]).default('pending'),
  stripe_connect_id: z.string().optional(),
  address: addressSchema.optional(),
});

const updatePartnerDTOSchema = createPartnerDTOSchema.partial();

export type CreatePartnerDTO = z.infer<typeof createPartnerDTOSchema>;
export type UpdatePartnerDTO = z.infer<typeof updatePartnerDTOSchema>;

const adminGetPartnerParams = createSelectParams();

const defaultPartnerIdQueryConfig = {
  defaults: [...defaultAdminStorefrontFields],
  isList: false,
};

const defaultPartnersIdQueryConfig = {
  defaults: [...defaultAdminStorefrontFields],
  defaultLimit: 50,
  isList: true,
};

export const adminPartnerRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/admin/partner',
    method: 'POST',
    middlewares: [validateAndTransformBody(createPartnerDTOSchema)],
  },
  {
    matcher: '/admin/partner/:id',
    method: 'PUT',
    middlewares: [validateAndTransformBody(updatePartnerDTOSchema)],
  },
  {
    matcher: '/admin/partner',
    method: 'GET',
    middlewares: [validateAndTransformQuery(adminGetPartnerParams, defaultPartnersIdQueryConfig)],
  },
  {
    matcher: '/admin/partner/:id',
    method: 'GET',
    middlewares: [validateAndTransformQuery(adminGetPartnerParams, defaultPartnerIdQueryConfig)],
  },
];
