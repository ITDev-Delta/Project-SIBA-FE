import { DatePicker } from "antd";
import dayjs from "dayjs";
import React from "react";

interface SelectDatePickerProps {
  id?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  picker?: "date" | "week" | "month" | "quarter" | "year";
  errors?: string;
  style?: React.CSSProperties;
  disableBeforeToday?: boolean;
  backDate?: number;
  onChange: (date: string) => void;
}

const SelectDatePicker = ({
  id,
  label,
  placeholder,
  disabled = false,
  required = false,
  defaultValue,
  errors,
  style,
  picker = "date",
  disableBeforeToday,
  backDate,
  onChange,
}: SelectDatePickerProps) => {
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
        <DatePicker
          id={id}
          disabled={disabled}
          defaultValue={
            defaultValue ? dayjs(defaultValue, "YYYY-MM-DD") : undefined
          }
          format={"DD/MM/YYYY"}
          picker={picker}
          placeholder={placeholder ?? "dd/mm/yyyy"}
          onKeyDown={handleInputDown}
          onChange={(date: dayjs.Dayjs) =>
            onChange(date ? date.format("YYYY-MM-DD") : "")
          }
          disabledDate={(current) => {
            if (backDate && typeof backDate === "number") {
              const startDate = dayjs()
                .subtract(backDate, "day")
                .startOf("day");
              const endDate = dayjs().endOf("day");
              return current && (current < startDate || current > endDate);
            }
            if (disableBeforeToday) {
              return current && current < dayjs().startOf("day");
            }
            return false;
          }}
          className="datepicker-right-align w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
          style={{ height: 48, ...style }}
        />
      </div>
      {errors && (
        <span className="ml-2 mt-5 text-sm text-red-500">{errors}</span>
      )}
    </div>
  );
};

export default SelectDatePicker;
