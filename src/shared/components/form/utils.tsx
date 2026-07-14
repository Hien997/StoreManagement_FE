import { type FieldError, type FieldErrors, type FieldPath, type Control, type FieldValues } from 'react-hook-form'
import { cn } from '@/shared/lib/utils'

/**
 * Merge class names. Thin wrapper around the shared cn() helper so form
 * components have a single, consistent entry point.
 */
export function mergeClassNames(...inputs: Parameters<typeof cn>) {
  return cn(...inputs)
}

/**
 * Resolve the error message for a given field path from the RHF errors object.
 * Returns undefined when there is no error so callers can render conditionally.
 */
export function getFieldError<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
  name: FieldPath<T>,
): string | undefined {
  const error = errors[name] as FieldError | undefined
  return error?.message
}

/**
 * Render a label with an optional required indicator.
 */
export function requiredLabel(label: string, required?: boolean) {
  if (!required) return label
  return (
    <>
      {label}
      <span className="ml-0.5 text-destructive" aria-hidden="true">
        *
      </span>
    </>
  )
}

export type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
}
