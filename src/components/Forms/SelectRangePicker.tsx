import { DatePicker } from "antd";
import dayjs from "dayjs";
import React from "react";

const { RangePicker } = DatePicker;

interface SelectRangePickerProps {
  label?: string;
  placeholder?: [string, string];
  disabled?: boolean;
  required?: boolean;
  defaultValue?: [string, string];
  errors?: string;
  style?: React.CSSProperties;
  onChange: (startDate: string, endDate: string) => void;
}

const SelectRangePicker = ({
  label,
  placeholder,
  disabled = false,
  required = false,
  defaultValue,
  errors,
  style,
  onChange,
}: SelectRangePickerProps) => {
  const handleInputDown = (e: React.KeyboardEvent | any) => {
    if (e.key === "Enter") {
      return e.preventDefault();
    }
    if (
      !(
        (e.key >= "0" && e.key <= "9") ||
        e.key === "/" ||
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      )
    ) {
      return e.preventDefault();
    }

    if (e.key === "/" && e.target.value.length === 0) {
      return e.preventDefault();
    }
    if (
      e.key === "/" &&
      e.target.value.length !== 2 &&
      e.target.value.length !== 5
    ) {
      return e.preventDefault();
    }

    if (
      (e.target.value.length === 2 || e.target.value.length === 5) &&
      e.key !== "/" &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      return e.preventDefault();
    }

    if (
      e.target.value.length === 10 &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      return e.preventDefault();
    }
  };
  return (
    <div>
      {label && (
        <label className="mb-3 block text-black">
          {label} {required === true && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <RangePicker
          disabled={disabled}
          defaultValue={
            defaultValue
              ? [
                  dayjs(defaultValue[0], "DD/MM/YYYY"),
                  dayjs(defaultValue[1], "DD/MM/YYYY"),
                ]
              : undefined
          }
          format={"DD/MM/YYYY"}
          placeholder={placeholder}
          onKeyDown={handleInputDown}
          onChange={(dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) =>
            onChange(
              dates ? dates[0]?.format("YYYY-MM-DD") ?? "" : "",
              dates ? dates[1]?.format("YYYY-MM-DD") ?? "" : ""
            )
          }
          onAbort={() => onChange("", "")}
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

export default SelectRangePicker;
