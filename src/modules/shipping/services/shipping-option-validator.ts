import { 
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/framework/types"

class ShippingOptionValidator {
  constructor(private readonly container: MedusaContainer) {}

  /**
   * Validates if a shipping option is available for a cart based on subtotal rules
   * @param shippingOptionId - The ID of the shipping option to validate
   * @param cartId - The ID of the cart to validate against
   * @returns boolean indicating if the shipping option is valid for the cart
   */
  async validateShippingOptionForCart(
    shippingOptionId: string,
    cartId: string
  ): Promise<boolean> {
    try {
      const logger = this.container.resolve(ContainerRegistrationKeys.LOGGER)
      const fulfillmentModuleService = this.container.resolve(Modules.FULFILLMENT)
      const cartModuleService = this.container.resolve(Modules.CART)

      // Get the shipping option
      const shippingOption = await fulfillmentModuleService.retrieveShippingOption(shippingOptionId)
      if (!shippingOption) {
        logger.warn(`Shipping option with ID ${shippingOptionId} not found`)
        return false
      }

      // Get the cart
      const cart = await cartModuleService.retrieveCart(cartId)
      if (!cart) {
        logger.warn(`Cart with ID ${cartId} not found`)
        return false
      }

      // Get cart subtotal
      const cartSubtotal = cart.subtotal || 0

      // Check for min/max subtotal rules
      if (shippingOption.rules && shippingOption.rules.length > 0) {
        // Check for minimum subtotal rule
        const minSubtotalRule = shippingOption.rules.find(
          rule => rule.attribute === "cart.subtotal" && rule.operator === "gt"
        )
        
        if (minSubtotalRule) {
          const minSubtotal = parseFloat(minSubtotalRule.value)
          if (cartSubtotal <= minSubtotal) {
            logger.debug(
              `Cart subtotal ${cartSubtotal} is less than or equal to minimum required ${minSubtotal}`
            )
            return false
          }
        }

        // Check for maximum subtotal rule
        const maxSubtotalRule = shippingOption.rules.find(
          rule => rule.attribute === "cart.subtotal" && rule.operator === "lt"
        )
        
        if (maxSubtotalRule) {
          const maxSubtotal = parseFloat(maxSubtotalRule.value)
          if (cartSubtotal >= maxSubtotal) {
            logger.debug(
              `Cart subtotal ${cartSubtotal} is greater than or equal to maximum allowed ${maxSubtotal}`
            )
            return false
          }
        }
      }

      // If we get here, the shipping option is valid for the cart
      return true
    } catch (error) {
      const logger = this.container.resolve(ContainerRegistrationKeys.LOGGER)
      logger.error(
        `Error validating shipping option ${shippingOptionId} for cart ${cartId}: ${error.message}`
      )
      return false
    }
  }

  /**
   * Filters shipping options based on cart subtotal rules
   * @param shippingOptions - Array of shipping options to filter
   * @param cartSubtotal - The cart subtotal to validate against
   * @returns Array of valid shipping options
   */
  filterShippingOptionsBySubtotal(
    shippingOptions: any[],
    cartSubtotal: number
  ): any[] {
    if (!shippingOptions || !shippingOptions.length) {
      return []
    }

    return shippingOptions.filter(option => {
      if (!option.rules || !option.rules.length) {
        return true
      }

      // Check for minimum subtotal rule
      const minSubtotalRule = option.rules.find(
        rule => rule.attribute === "cart.subtotal" && rule.operator === "gt"
      )
      
      if (minSubtotalRule) {
        const minSubtotal = parseFloat(minSubtotalRule.value)
        if (cartSubtotal <= minSubtotal) {
          return false
        }
      }

      // Check for maximum subtotal rule
      const maxSubtotalRule = option.rules.find(
        rule => rule.attribute === "cart.subtotal" && rule.operator === "lt"
      )
      
      if (maxSubtotalRule) {
        const maxSubtotal = parseFloat(maxSubtotalRule.value)
        if (cartSubtotal >= maxSubtotal) {
          return false
        }
      }

      return true
    })
  }
}

export default ShippingOptionValidator