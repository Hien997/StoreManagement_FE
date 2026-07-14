import * as React from 'react'
import { type FieldValues } from 'react-hook-form'

import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { getFieldError, requiredLabel, type BaseFieldProps } from './utils'

interface FormFieldProps<T extends FieldValues>
  extends Pick<
    BaseFieldProps<T>,
    'label' | 'description' | 'required' | 'className'
  > {
  id: string
  error?: string
  children: React.ReactNode
  /** Optional extra content rendered after the control (e.g. loading hint). */
  footer?: React.ReactNode
}

/**
 * Shared layout wrapper for all form fields. Renders the label (with required
 * indicator), the control, optional helper text and a consistent error block.
 * Field components compose this so spacing, label and error styling stay uniform.
 */
export const FormField = React.memo(function FormField<T extends Record<string, unknown>>({
  id,
  label,
  description,
  required,
  error,
  className,
  children,
  footer,
}: FormFieldProps<T>) {
  const describedBy = error
    ? `${id}-error`
    : description
      ? `${id}-description`
      : undefined

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && 'text-destructive')}>
          {requiredLabel(label, required)}
        </Label>
      )}
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      } as Record<string, unknown>)}
      {description && !error && (
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
      {footer}
    </div>
  )
})

export { getFieldError }