import { Controller, useFormState, type FieldValues } from 'react-hook-form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { FormField } from './FormField'
import { getFieldError, type BaseFieldProps } from './utils'

export interface SelectOption {
  value: string
  label: string
}

export interface FormSelectProps<T extends FieldValues>
  extends BaseFieldProps<T> {
  options: SelectOption[]
  loading?: boolean
  placeholder?: string
}

/**
 * Select bound to React Hook Form via Controller (Radix Select is controlled).
 */
export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  options,
  loading,
  placeholder,
}: FormSelectProps<T>) {
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
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value as string}
            onValueChange={field.onChange}
            disabled={disabled || loading}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  )
}