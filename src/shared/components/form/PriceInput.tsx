import * as React from "react";
import { Controller, useFormState, type FieldValues } from "react-hook-form";

import { Input } from "@/shared/components/ui/input";
import { FormField } from "./FormField";
import { getFieldError, type BaseFieldProps } from "./utils";
import { formatCurrency } from "@/shared/lib/format";

export interface PriceInputProps<
  T extends FieldValues,
> extends BaseFieldProps<T> {
  loading?: boolean;
  min?: number;
  max?: number;
}

const groupDigits = (raw: string) => {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
};

/**
 * Currency input bound to React Hook Form via Controller.
 * Shows thousand-grouped digits while typing and a fully formatted
 * currency value on blur, while storing the raw numeric value.
 */
export function PriceInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  required,
  disabled,
  className,
  loading,
  min,
  max,
}: PriceInputProps<T>) {
  const { errors } = useFormState({ control });
  const error = getFieldError(errors as never, name as never);
  const id = `field-${String(name)}`;

  return (
    <FormField
      id={id}
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
          <PriceControl
            id={id}
            value={field.value as number | undefined}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled || loading}
            placeholder={placeholder}
            min={min}
            max={max}
          />
        )}
      />
    </FormField>
  );
}

function PriceControl({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  min,
  max,
}: {
  id: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onBlur: () => void;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  const [focused, setFocused] = React.useState(false);
  const [display, setDisplay] = React.useState(
    value != null ? String(value) : "",
  );

  React.useEffect(() => {
    if (focused) return;
    setDisplay(value != null ? formatCurrency(Number(value)) : "");
  }, [value, focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const grouped = groupDigits(e.target.value);
    setDisplay(grouped);
    const num = grouped === "" ? undefined : Number(grouped.replace(/,/g, ""));
    onChange(num);
  };

  const handleFocus = () => {
    setFocused(true);
    setDisplay(value != null ? String(value) : "");
  };

  const handleBlur = () => {
    setFocused(false);
    if (value != null) setDisplay(formatCurrency(Number(value)));
    onBlur();
  };

  return (
    <Input
      id={id}
      type="text"
      inputMode="decimal"
      value={display}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      className="pl-7"
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
