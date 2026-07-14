import { useFormContext, useFormState, type FieldValues } from 'react-hook-form'

import { Input } from '@/shared/components/ui/input'
import { FormField } from './FormField'
import { getFieldError, type BaseFieldProps } from './utils'

export interface FormNumberInputProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  loading?: boolean
  min?: number
  max?: number
  step?: number
}

/**
 * Numeric input bound to React Hook Form via register({ valueAsNumber: true }).
 */
export function FormNumberInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required,
  disabled,
  readOnly,
  className,
  loading,
  min,
  max,
  step,
}: FormNumberInputProps<T>) {
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
        type="number"
        placeholder={placeholder}
        disabled={disabled || loading}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        {...register(name, { valueAsNumber: true })}
      />
    </FormField>
  )
}