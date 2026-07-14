import { useFormContext, useFormState, type FieldValues } from 'react-hook-form'

import { Input } from '@/shared/components/ui/input'
import { FormField } from './FormField'
import { getFieldError, type BaseFieldProps } from './utils'

export interface FormDatePickerProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  loading?: boolean
}

/**
 * Native date input bound to React Hook Form via register().
 * Stores the value as an ISO date string (yyyy-mm-dd).
 */
export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  readOnly,
  className,
  loading,
}: FormDatePickerProps<T>) {
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
        type="date"
        disabled={disabled || loading}
        readOnly={readOnly}
        {...register(name)}
      />
    </FormField>
  )
}