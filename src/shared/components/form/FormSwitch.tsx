import { Controller, useFormState, type FieldValues } from 'react-hook-form'

import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { getFieldError, type BaseFieldProps } from './utils'

export interface FormSwitchProps<T extends FieldValues>
  extends Omit<BaseFieldProps<T>, 'placeholder'> {
  loading?: boolean
}

/**
 * Switch bound to React Hook Form via Controller. Inline label + control.
 */
export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  loading,
}: FormSwitchProps<T>) {
  const { errors } = useFormState({ control })
  const error = getFieldError(errors as never, name as never)
  const id = `field-${String(name)}`

  return (
    <div className={cn('space-y-2', className)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center justify-between gap-3">
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
            <Switch
              id={id}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled || loading}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
            />
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