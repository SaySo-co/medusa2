import { 
  ContainerRegistrationKeys,
  Modules,
  Workflow,
  createWorkflow,
} from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"

type FilterShippingOptionsBySubtotalInput = {
  cart_id: string
  shipping_options?: any[]
}

type FilterShippingOptionsBySubtotalOutput = {
  shipping_options: any[]
}

/**
 * Workflow to filter shipping options based on cart subtotal
 */
export const filterShippingOptionsBySubtotalWorkflow = (
  container: MedusaContainer
): Workflow<
  FilterShippingOptionsBySubtotalInput,
  FilterShippingOptionsBySubtotalOutput
> => {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  
  return createWorkflow<
    FilterShippingOptionsBySubtotalInput,
    FilterShippingOptionsBySubtotalOutput
  >(
    "filter-shipping-options-by-subtotal",
    container,
    async (input) => {
      const { cart_id, shipping_options = [] } = input
      
      try {
        // Get the cart module service
        const cartModuleService = container.resolve(Modules.CART)
        
        // Get the shipping module service
        const shippingModule = container.resolve("shipping")
        
        if (!shippingModule?.shippingOptionValidator) {
          logger.warn("Shipping option validator not found, skipping subtotal filtering")
          return { shipping_options }
        }
        
        // Get the cart
        const cart = await cartModuleService.retrieveCart(cart_id)
        if (!cart) {
          logger.warn(`Cart with ID ${cart_id} not found`)
          return { shipping_options }
        }
        
        // Get cart subtotal
        const cartSubtotal = cart.subtotal || 0
        
        // Filter shipping options based on subtotal rules
        const filteredOptions = shippingModule.shippingOptionValidator.filterShippingOptionsBySubtotal(
          shipping_options,
          cartSubtotal
        )
        
        return { shipping_options: filteredOptions }
      } catch (error) {
        logger.error(
          `Error filtering shipping options for cart ${cart_id}: ${error.message}`
        )
        return { shipping_options }
      }
    }
  )
}

export default filterShippingOptionsBySubtotalWorkflow