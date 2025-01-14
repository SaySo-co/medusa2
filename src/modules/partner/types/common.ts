import type { InferTypeOf } from "@medusajs/framework/types";
import type { Partner, PartnerAddress } from "../models";

export type ModulePartner = InferTypeOf<typeof Partner>;
export type ModulePartnerAddress = InferTypeOf<typeof PartnerAddress>;

export const partnerStatuses = ['pending', 'active', 'inactive'] as const;
