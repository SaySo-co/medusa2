import { 
  ModuleRegistrationName,
  MedusaModule,
} from "@medusajs/framework/types"
import { asFunction } from "awilix"
import ShippingOptionValidator from "./services/shipping-option-validator"

// Define the module registration
export const ShippingModule = MedusaModule.create({
  moduleRegistration: {
    name: "shipping" as ModuleRegistrationName,
    dependencies: ["fulfillment", "cart"],
    configuration: {
      imports: asFunction((container) => {
        return {
          shippingOptionValidator: new ShippingOptionValidator(container),
        }
      }),
    },
  },
})

// Export the validator service for use in other modules
export * from "./services/shipping-option-validator"
export default ShippingModule