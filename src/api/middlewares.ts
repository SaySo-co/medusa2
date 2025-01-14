import { defineMiddlewares } from '@medusajs/medusa';
import { adminPartnerRoutesMiddlewares } from './admin/partner/middlewares';

export default defineMiddlewares({
  routes: [
    ...adminPartnerRoutesMiddlewares,
  ],
});
