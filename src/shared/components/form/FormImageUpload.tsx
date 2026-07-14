import { Controller, useFormState, type FieldValues } from 'react-hook-form'
import { ImagePlus, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { getFieldError, type BaseFieldProps } from './utils'

export interface FormImageUploadProps<T extends FieldValues>
  extends Omit<BaseFieldProps<T>, 'placeholder'> {
  loading?: boolean
}

/**
 * Image upload bound to React Hook Form via Controller. Stores a data URL
 * string (or undefined). Renders a preview with a remove button.
 */
export function FormImageUpload<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  className,
  loading,
}: FormImageUploadProps<T>) {
  const { errors } = useFormState({ control })
  const error = getFieldError(errors as never, name as never)
  const id = `field-${String(name)}`

  const handleFile = (file: File | undefined, onChange: (v: string | undefined) => void) => {
    if (!file) {
      onChange(undefined)
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <span className={cn('text-sm font-medium leading-none', error && 'text-destructive')}>
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div>
            {field.value ? (
              <div className="relative inline-block">
                <img
                  src={field.value as string}
                  alt={label ?? 'preview'}
                  className="h-32 w-32 rounded-md border object-cover"
                />
                <button
                  type="button"
                  onClick={() => field.onChange(undefined)}
                  disabled={disabled || loading}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label
                htmlFor={id}
                className={cn(
                  'flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground hover:bg-accent',
                  (disabled || loading) && 'cursor-not-allowed opacity-50',
                )}
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs">Upload</span>
                <input
                  id={id}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={disabled || loading}
                  onChange={(e) => handleFile(e.target.files?.[0], field.onChange)}
                />
              </label>
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