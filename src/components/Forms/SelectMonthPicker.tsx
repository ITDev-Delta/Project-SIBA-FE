import { ConfigProvider, DatePicker } from "antd";
import id_ID from "antd/es/locale/id_ID";
import dayjs from "dayjs";
import "dayjs/locale/id";
import React from "react";
dayjs.locale("id");
interface SelectMonthPickerProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  errors?: string;
  style?: React.CSSProperties;
  onChange: (month: any) => void;
}

const SelectMonthPicker = ({
  label,
  placeholder = label,
  disabled = false,
  required = false,
  defaultValue,
  errors,
  style,
  onChange,
}: SelectMonthPickerProps) => {
  return (
    <div>
      {label && (
        <label className="mb-3 block text-black">
          {label} {required === true && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <ConfigProvider locale={id_ID}>
          <DatePicker
            picker="month"
            mode="month"
            disabled={disabled}
            defaultValue={
              defaultValue ? dayjs(defaultValue, "MMMM") : undefined
            }
            format={"MMMM"}
            placeholder={placeholder}
            onChange={(date: dayjs.Dayjs) =>
              onChange(
                date
                  ? {
                      nama: date.format("MMMM"),
                      kode: date.format("M"),
                    }
                  : ""
              )
            }
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
            style={{ ...style }}
            popupClassName="hide-year"
          />
        </ConfigProvider>
        <style>
          {`.hide-year .ant-picker-header-view {
              pointer-events: none;
              color: transparent;
          }
          .hide-year .ant-picker-header-super-prev-btn,
          .hide-year .ant-picker-header-super-next-btn {
              display: none !important;
          }`}
        </style>
      </div>
      {errors && (
        <span className="ml-2 mt-5 text-sm text-red-500">{errors}</span>
      )}
    </div>
  );
};

export default SelectMonthPicker;
