import { Controller, useFormState, type FieldValues } from 'react-hook-form'

import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { getFieldError, type BaseFieldProps } from './utils'

export interface FormCheckboxProps<T extends FieldValues>
  extends Omit<BaseFieldProps<T>, 'placeholder'> {
  loading?: boolean
}

/**
 * Checkbox bound to React Hook Form via Controller. Renders an inline
 * label + control layout (no separate floating label).
 */
export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  loading,
}: FormCheckboxProps<T>) {
  const { errors } = useFormState({ control })
  const error = getFieldError(errors as never, name as never)
  const id = `field-${String(name)}`

  return (
    <div className={cn('space-y-2', className)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={id}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled || loading}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            {label && (
              <Label htmlFor={id} className={cn('font-normal', error && 'text-destructive')}>
                {label}
                {required && (
                  <span className="ml-0.5 text-destructive" aria-hidden="true">
                    *
                  </span>
                )}
              </Label>
            )}
          </div>
        )}
      />
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
    </div>
  )
}