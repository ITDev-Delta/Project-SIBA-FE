import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
// Custom components
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

// props
interface InputFieldProps<T extends FieldValues> {
  id: Path<T>;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  onClick?: Function;
  onChange?: (event: any) => void;
  state?: string;
  disabled?: boolean;
  readonly?: boolean;
  min?: string | number;
  max?: string | number;
  defaultValue?: string | number | readonly string[] | undefined;
  onInput?: (event: any) => void;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validationSchema: RegisterOptions<T>;
  autocomplete?: string;
  style?: React.CSSProperties;
  onKeyDown?: (event: any) => void;
  onSearch?: (value: string) => void;
  onSelect?: React.ReactEventHandler<HTMLInputElement> | undefined;
  onMouseUp?: React.MouseEventHandler<HTMLInputElement> | undefined;
  prefixText?: string;
  suffixText?: string;
  className?: string;
  value?: string | number | readonly string[] | undefined;
  step?: string;
}

const InputField = <T extends FieldValues>({
  id,
  label,
  type,
  placeholder = label,
  onClick,
  disabled = false,
  readonly,
  defaultValue,
  onInput,
  onChange,
  onSearch,
  onKeyDown,
  onMouseUp,
  onSelect,
  min,
  max,
  value,
  autocomplete = "off",
  state,
  register,
  errors,
  validationSchema,
  style,
  prefixText,
  suffixText,
  className,
  step,
  ...rest
}: InputFieldProps<T>) => {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine the effective input type
  const effectiveType =
    type === "password" && isPasswordVisible ? "text" : type;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Handle perubahan input dengan debouncing
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Jalankan onChange jika ada
    if (onChange) onChange(event);

    // Jika sudah ada timer yang aktif, hapus dulu
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Pasang timer baru untuk menjalankan onSearch setelah 2000ms
    debounceTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(newValue);
      }
    }, 1000);
  };
  return (
    <div className={className}>
      {label && (
        <label className="mb-3 block text-black">
          {label}{" "}
          {validationSchema.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefixText && (
          <span className="absolute left-4 text-black">{prefixText}</span>
        )}
        <input
          id={id}
          type={effectiveType}
          onKeyDown={onKeyDown}
          onSelect={onSelect}
          onMouseUp={onMouseUp}
          value={value}
          readOnly={readonly}
          autoComplete={autocomplete}
          placeholder={placeholder}
          onClick={() => onClick}
          onInput={onInput}
          min={min}
          max={max}
          defaultValue={defaultValue}
          step={step}
          style={{
            ...style,
            paddingRight:
              suffixText || type === "password" ? "2.5rem" : undefined,
            paddingLeft: prefixText ? "2.5rem" : undefined,
            backgroundColor: disabled ? "#F5F5F5" : undefined,
            borderColor: disabled ? "#D9D9D9" : undefined,
          }}
          onWheel={(e) => e.currentTarget.blur()}
          disabled={disabled}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary hover:border-secondary disabled:cursor-default disabled:bg-whiter"
          {...register(id, {
            ...validationSchema,
            onChange: handleChange,
          })}
          {...rest}
        />
        {type === "password" ? (
          <>
            {isPasswordVisible ? (
              <EyeSlashIcon
                onClick={togglePasswordVisibility}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
                style={{
                  height: "20px",
                  width: "20px",
                }}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
              />
            ) : (
              <EyeIcon
                onClick={togglePasswordVisibility}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
                style={{
                  height: "20px",
                  width: "20px",
                }}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
              />
            )}
          </>
        ) : suffixText ? (
          <span className="absolute right-4 text-black">{suffixText}</span>
        ) : null}
      </div>
      {(errors.root || errors[id]) && (
        <span className="ml-2 mt-5 text-sm text-red-500">
          {errors?.root?.message?.toString() ?? (errors[id]?.message as string)}
        </span>
      )}
    </div>
  );
};

export default InputField;
