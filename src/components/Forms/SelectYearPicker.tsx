import { DatePicker } from "antd";
import dayjs from "dayjs";
import React from "react";

interface SelectYearPickerProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  errors?: string;
  style?: React.CSSProperties;
  yearOptions?: string[];
  onChange: (year: string) => void;
}

const SelectYearPicker = ({
  label,
  placeholder = label,
  disabled = false,
  required = false,
  defaultValue,
  errors,
  style,
  yearOptions,
  onChange,
}: SelectYearPickerProps) => {
  const disabledDate = (current: dayjs.Dayjs) => {
    return yearOptions
      ? !yearOptions.includes(current.year().toString())
      : false;
  };
  return (
    <div>
      {label && (
        <label className="mb-3 block text-black">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <DatePicker
          disabled={disabled}
          defaultValue={defaultValue ? dayjs(defaultValue, "YYYY") : undefined}
          format={"YYYY"}
          picker="year"
          placeholder={placeholder}
          onChange={(date: dayjs.Dayjs) =>
            onChange(date ? date.format("YYYY") : "")
          }
          disabledDate={disabledDate}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          style={{ ...style }}
        />
      </div>
      {errors && (
        <span className="ml-2 mt-5 text-sm text-red-500">{errors}</span>
      )}
    </div>
  );
};

export default SelectYearPicker;
