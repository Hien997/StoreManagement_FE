import { useFormContext, useFormState, type FieldValues } from 'react-hook-form'

import { Textarea } from '@/shared/components/ui/textarea'
import { FormField } from './FormField'
import { getFieldError, type BaseFieldProps } from './utils'

export interface FormTextareaProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  loading?: boolean
  rows?: number
}

/**
 * Textarea bound to React Hook Form via register().
 */
export function FormTextarea<T extends FieldValues>({
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
  rows,
}: FormTextareaProps<T>) {
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
      <Textarea
        placeholder={placeholder}
        disabled={disabled || loading}
        readOnly={readOnly}
        rows={rows}
        {...register(name)}
      />
    </FormField>
  )
}