/**
 * Data Binding System
 * Connects block elements to dynamic real estate data from Neon
 */

import type { CanvasElement, DataBinding } from "@/components/real-estate-builder/types"
import type { Property, Agent } from "./neon-client"

export type BindingData = Property | Agent | Record<string, unknown> | unknown[]

/**
 * Get value from nested object path
 * e.g., "property.price" -> property object's price
 */
function getValueByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

/**
 * Apply transform function to value
 * e.g., formatPrice(value) or truncate(value, 50)
 */
function applyTransform(value: unknown, transformFn?: string): string {
  if (!transformFn || !value) return String(value || "")

  try {
    // Create a safe transform function context
    const context = {
      value,
      formatPrice: (num: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num),
      formatDate: (date: string) => new Date(date).toLocaleDateString(),
      truncate: (str: string, length: number) => (str.length > length ? str.slice(0, length) + "..." : str),
      capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
      uppercase: (str: string) => String(str).toUpperCase(),
      lowercase: (str: string) => String(str).toLowerCase(),
    }

    // Use Function constructor to execute transform safely
    const fn = new Function(
      "value",
      "formatPrice",
      "formatDate",
      "truncate",
      "capitalize",
      "uppercase",
      "lowercase",
      `return ${transformFn}`,
    )

    return String(fn(value, context.formatPrice, context.formatDate, context.truncate, context.capitalize, context.uppercase, context.lowercase))
  } catch {
    return String(value)
  }
}

/**
 * Bind element data based on DataBinding configuration
 */
export function bindElementData(
  element: CanvasElement,
  binding: DataBinding,
  data: BindingData,
): CanvasElement {
  if (!data) return element

  const value = getValueByPath(data, binding.propertyPath)

  if (!value) return element

  const transformedValue = applyTransform(value, binding.transformFn)

  // Apply transformation based on binding type
  switch (binding.type) {
    case "text":
      if ("content" in element) {
        return {
          ...element,
          content: transformedValue,
        }
      }
      break

    case "image":
      if ("imageUrl" in element) {
        return {
          ...element,
          imageUrl: String(value),
        }
      }
      break

    case "repeater":
      // Repeater bindings are handled at block level
      return element
  }

  return element
}

/**
 * Repeat block for array data
 * e.g., properties array -> repeat property card block multiple times
 */
export interface RepeatedBlockData {
  originalBlockId: string
  repeatedInstances: Array<{
    id: string
    data: Record<string, unknown>
  }>
}

export function createRepeatedBlocks(
  blockElements: CanvasElement[],
  blockId: string,
  dataArray: BindingData[],
  bindings: DataBinding[],
): RepeatedBlockData {
  return {
    originalBlockId: blockId,
    repeatedInstances: (Array.isArray(dataArray) ? dataArray : [dataArray]).map((item, index) => ({
      id: `${blockId}-repeat-${index}`,
      data: {
        ...(typeof item === "object" ? item : { value: item }),
        _index: index,
      },
    })),
  }
}

/**
 * Apply bindings to multiple elements
 */
export function applyBindingsToElements(
  elements: CanvasElement[],
  bindings: DataBinding[],
  data: Record<string, BindingData>,
): CanvasElement[] {
  return elements.map((element) => {
    const relevantBindings = bindings.filter((b) => b.elementId === element.id)

    return relevantBindings.reduce((el, binding) => {
      const bindingData = getValueByPath(data, binding.propertyPath.split(".")[0])
      return bindElementData(el, binding, bindingData)
    }, element)
  })
}

/**
 * Validate bindings
 */
export function validateBinding(binding: DataBinding, data: BindingData): {
  valid: boolean
  error?: string
} {
  const value = getValueByPath(data, binding.propertyPath)

  if (value === undefined) {
    return {
      valid: false,
      error: `Property path "${binding.propertyPath}" not found in data`,
    }
  }

  if (binding.type === "text" && typeof value !== "string" && typeof value !== "number") {
    return {
      valid: false,
      error: `Text binding expects string or number, got ${typeof value}`,
    }
  }

  if (binding.type === "image" && typeof value !== "string") {
    return {
      valid: false,
      error: `Image binding expects string URL, got ${typeof value}`,
    }
  }

  return { valid: true }
}

/**
 * Data binding presets for common scenarios
 */
export const BINDING_PRESETS = {
  property: {
    price: { propertyPath: "property.price", transformFn: "formatPrice(value)" },
    address: { propertyPath: "property.address", transformFn: 'truncate(value, 50)' },
    beds: { propertyPath: "property.beds", transformFn: 'value + " beds"' },
    baths: { propertyPath: "property.baths", transformFn: 'value + " baths"' },
    sqft: { propertyPath: "property.sqft", transformFn: 'formatNumber(value) + " sqft"' },
    description: { propertyPath: "property.description", transformFn: 'truncate(value, 150)' },
    mainImage: { propertyPath: "property.images[0]", transformFn: 'value' },
    status: { propertyPath: "property.status", transformFn: 'capitalize(value)' },
  },
  agent: {
    name: { propertyPath: "agent.name", transformFn: 'value' },
    title: { propertyPath: "agent.title", transformFn: 'value' },
    email: { propertyPath: "agent.email", transformFn: 'value' },
    phone: { propertyPath: "agent.phone", transformFn: 'value' },
    bio: { propertyPath: "agent.bio", transformFn: 'truncate(value, 200)' },
    image: { propertyPath: "agent.imageUrl", transformFn: 'value' },
  },
  agency: {
    name: { propertyPath: "agency.name", transformFn: 'value' },
    phone: { propertyPath: "agency.phone", transformFn: 'value' },
    email: { propertyPath: "agency.email", transformFn: 'value' },
    address: { propertyPath: "agency.address", transformFn: 'value' },
    logo: { propertyPath: "agency.logoUrl", transformFn: 'value' },
  },
} as const

/**
 * Helper to format numbers with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}
