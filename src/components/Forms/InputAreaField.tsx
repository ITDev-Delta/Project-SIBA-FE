import React from "react";
// Custom components
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

// props
interface InputAreaFieldProps<T extends FieldValues> {
  id: Path<T>;
  label?: string;
  placeholder?: string;
  onClick?: Function;
  onChange?: (event: any) => void;
  state?: string;
  disabled?: boolean;
  readonly?: boolean;
  rows?: number;
  defaultValue?: string;
  onInput?: (event: any) => void;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validationSchema: RegisterOptions<T>;
  autocomplete?: string;
  style?: React.CSSProperties;
  onKeyDown?: (event: any) => void;
  prefixText?: string;
}

const InputAreaField = <T extends FieldValues>({
  id,
  label,
  placeholder = label,
  onClick,
  disabled = false,
  rows = 3,
  readonly,
  defaultValue,
  onInput,
  onChange,
  onKeyDown,
  autocomplete = "off",
  state,
  register,
  errors,
  validationSchema,
  style,
  prefixText,
  ...rest
}: InputAreaFieldProps<T>) => {
  return (
    <div>
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
        <textarea
          id={id}
          rows={rows}
          onKeyDown={onKeyDown}
          readOnly={readonly}
          autoComplete={autocomplete}
          placeholder={placeholder}
          onClick={() => onClick}
          onInput={onInput}
          defaultValue={defaultValue}
          style={{
            ...style,
            paddingLeft: prefixText ? "2.5rem" : undefined,
            backgroundColor: disabled ? "#F5F5F5" : undefined,
            borderColor: disabled ? "#D9D9D9" : undefined,
          }}
          onWheel={(e) => e.currentTarget.blur()}
          disabled={disabled}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary hover:border-secondary disabled:cursor-default disabled:bg-whiter"
          {...register(id, {
            ...validationSchema,
            onChange,
          })}
          {...rest}
        />
      </div>
      {(errors.root || errors[id]) && (
        <span className="ml-2 mt-5 text-sm text-red-500">
          {errors?.root?.message?.toString() ?? (errors[id]?.message as string)}
        </span>
      )}
    </div>
  );
};

export default InputAreaField;
