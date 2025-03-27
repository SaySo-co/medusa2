import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { 
  Container, 
  Heading, 
  Text, 
  Button, 
  Input, 
  Label, 
  Checkbox, 
  Tooltip
} from "@medusajs/ui"
import { useState, useEffect } from "react"
import type { DetailWidgetProps } from "@medusajs/framework/types"

// Define the shipping option type
interface AdminShippingOption {
  id: string
  name: string
  rules: Array<{
    id?: string
    attribute: string
    operator: string
    value: string
  }>
  // Add other properties as needed
}

const ShippingOptionSubtotalRules = ({ 
  data 
}: DetailWidgetProps<AdminShippingOption>) => {
  const [minSubtotal, setMinSubtotal] = useState<string>("")
  const [maxSubtotal, setMaxSubtotal] = useState<string>("")
  const [hasMinSubtotal, setHasMinSubtotal] = useState<boolean>(false)
  const [hasMaxSubtotal, setHasMaxSubtotal] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Find existing min/max subtotal rules on component mount
  useEffect(() => {
    if (data?.rules?.length) {
      const minRule = data.rules.find(
        rule => rule.attribute === "cart.subtotal" && rule.operator === "gt"
      )
      
      const maxRule = data.rules.find(
        rule => rule.attribute === "cart.subtotal" && rule.operator === "lt"
      )
      
      if (minRule) {
        setMinSubtotal(minRule.value)
        setHasMinSubtotal(true)
      }
      
      if (maxRule) {
        setMaxSubtotal(maxRule.value)
        setHasMaxSubtotal(true)
      }
    }
  }, [data])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      // Prepare the rules to update
      const updatedRules = [...(data.rules || [])]
      
      // Filter out existing min/max subtotal rules
      const filteredRules = updatedRules.filter(
        rule => !(rule.attribute === "cart.subtotal" && (rule.operator === "gt" || rule.operator === "lt"))
      )
      
      // Add new min subtotal rule if enabled
      if (hasMinSubtotal && minSubtotal) {
        filteredRules.push({
          attribute: "cart.subtotal",
          operator: "gt",
          value: minSubtotal
        })
      }
      
      // Add new max subtotal rule if enabled
      if (hasMaxSubtotal && maxSubtotal) {
        filteredRules.push({
          attribute: "cart.subtotal",
          operator: "lt",
          value: maxSubtotal
        })
      }
      
      // Make API call to update the shipping option
      const response = await fetch(`/admin/shipping-options/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rules: filteredRules
        })
      })
      
      if (!response.ok) {
        throw new Error("Failed to update shipping option rules")
      }
      
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err) {
      setError(err.message || "An error occurred while saving rules")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Subtotal Rules</Heading>
        <Tooltip content="Set minimum and maximum subtotal requirements for this shipping option">
          <Button variant="secondary" size="small">?</Button>
        </Tooltip>
      </div>
      <div className="p-6 space-y-6">
        <Text>
          Configure when this shipping option should be available based on the cart subtotal.
        </Text>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={hasMinSubtotal} 
              onCheckedChange={setHasMinSubtotal}
              id="has-min-subtotal"
            />
            <Label htmlFor="has-min-subtotal">Set minimum subtotal</Label>
          </div>
          
          {hasMinSubtotal && (
            <div className="pl-6">
              <Label htmlFor="min-subtotal">Minimum subtotal</Label>
              <Input 
                id="min-subtotal"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={minSubtotal}
                onChange={(e) => setMinSubtotal(e.target.value)}
                className="mt-1"
              />
              <Text className="text-xs text-gray-500 mt-1">
                The shipping option will only be available if the cart subtotal is greater than this value.
              </Text>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={hasMaxSubtotal} 
              onCheckedChange={setHasMaxSubtotal}
              id="has-max-subtotal"
            />
            <Label htmlFor="has-max-subtotal">Set maximum subtotal</Label>
          </div>
          
          {hasMaxSubtotal && (
            <div className="pl-6">
              <Label htmlFor="max-subtotal">Maximum subtotal</Label>
              <Input 
                id="max-subtotal"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={maxSubtotal}
                onChange={(e) => setMaxSubtotal(e.target.value)}
                className="mt-1"
              />
              <Text className="text-xs text-gray-500 mt-1">
                The shipping option will only be available if the cart subtotal is less than this value.
              </Text>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaving}
          >
            Save Rules
          </Button>
        </div>
        
        {isSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded">
            Rules saved successfully!
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
      </div>
    </Container>
  )
}

// Define the widget configuration
export const config = defineWidgetConfig({
  zone: "shipping_option.details.after",
})

export default ShippingOptionSubtotalRules