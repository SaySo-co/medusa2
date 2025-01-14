import type { ModulePartner, ModulePartnerAddress } from './common';

export type CreatePartnerInput = Partial<Omit<ModulePartner, 'id' | 'created_at' | 'updated_at' | 'address'>>;
export type UpdatePartnerInput = Partial<Omit<ModulePartner, 'id' | 'created_at' | 'updated_at' | 'address'>> & {
  id: string;
  address?: {
    id?: string;
    address_1: string;
    address_2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country_code?: string;
    metadata?: Record<string, unknown>;
  };
};

export type CreatePartnerWorkflowInput = {
  partner: CreatePartnerInput;
};

export type UpdatePartnerWorkflowInput = {
  partner: UpdatePartnerInput;
};
