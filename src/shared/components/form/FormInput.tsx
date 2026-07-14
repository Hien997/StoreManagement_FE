import * as React from 'react'
import { useFormContext, useFormState, type FieldValues } from 'react-hook-form'

import { Input } from '@/shared/components/ui/input'
import { FormField } from './FormField'
import { getFieldError, type BaseFieldProps } from './utils'

export interface FormInputProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  type?: React.HTMLInputTypeAttribute
  loading?: boolean
}

/**
 * Text input bound to React Hook Form via register().
 * Displays label, required marker, placeholder, helper text and Zod errors.
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required,
  disabled,
  readOnly,
  className,
  type = 'text',
  loading,
}: FormInputProps<T>) {
  const { register } = useFormContext<T>()
  const { errors } = useFormState({ control })
  const error = getFieldError(errors as never, name as never)

  return (
    <FormField
      id={`field-${String(name)}`}
      label={label}
      description={description}
      required={required}
      error={error}
      className={className}
    >
      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled || loading}
        readOnly={readOnly}
        {...register(name)}
      />
    </FormField>
  )
}