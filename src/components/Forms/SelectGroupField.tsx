import { Select } from "antd";
import React, { useState } from "react";

interface SelectGroupFieldProps {
  label?: string;
  id?: string;
  options: any[];
  value: any;
  style?: React.CSSProperties;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  allowClear?: boolean;
  onChange: (value: any) => void;
  error?: string;
  className?: string;
}

const SelectGroupField: React.FC<SelectGroupFieldProps> = ({
  id,
  label,
  options,
  value,
  placeholder,
  disabled = false,
  allowClear = true,
  onChange,
  required,
  error,
  style,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fungsi untuk menentukan properti label yang akan digunakan
  const getDisplayValue = (option: any) => {
    if (typeof option === "string") {
      return option; // Jika opsi berupa string, kembalikan string tersebut
    }
    if (!option || typeof option !== "object") {
      return ""; // Jika option tidak valid, kembalikan string kosong
    }
    return (
      option.nomor_shipment ??
      option.role_name ??
      option.alamat_lengkap ??
      option.nama_customer ??
      option.nama_category ??
      option.no_po ??
      option.no_so ??
      option.nomor_grn ??
      option.full_nama ??
      option.nama ??
      option.full_account_name ??
      option.nama_supplier ??
      option.master_satuan_nama ??
      option.nama_metode_pembayaran ??
      option.nama_sumber_pembayaran ??
      (option.currency && option.currency.nama_currency) ??
      option.nama_periode ??
      option.account ??
      option.nama_petty_cash ??
      (option.kode_item && option.nama_item
        ? option.kode_item + " - " + option.nama_item
        : null) ??
      option.kode_item ??
      option.coa_account ??
      option.nama_departemen ??
      option.nama_satuan ??
      option.nama_barang ??
      option.nama_currency ??
      option.jenis_pajak ??
      option.tracking_code ??
      option.nomor_assembly_order ??
      option.nomor_assembly ??
      option.tracking_code ??
      option.full_url ??
      option.id ??
      option.toString() // Sebagai fallback untuk data lain
    );
  };

  // Filter opsi berdasarkan pencarian
  const filteredOptions = options.filter((option) =>
    getDisplayValue(option).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Transformasi data opsi ke format Ant Design
  const transformedOptions = filteredOptions.map((option) =>
    typeof option === "string"
      ? { label: option, value: option }
      : {
          label: getDisplayValue(option),
          value: JSON.stringify(option), // Serialize seluruh objek untuk mempermudah akses
        }
  );

  const handleChange = (selectedValue: string) => {
    if (typeof options[0] === "string") {
      // Jika opsi berupa string, langsung kembalikan string
      onChange(selectedValue ?? "");
      return;
    }
    const selectedOption = selectedValue ? JSON.parse(selectedValue) : null; // Deserialize objek if valid
    onChange(selectedOption); // Tetap menggunakan format objek asli
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-3 block text-black">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className={`relative z-20 bg-transparent cursor-pointer`}>
        <Select
          id={id}
          showSearch
          disabled={disabled}
          value={getDisplayValue(value) || undefined}
          placeholder={
            getDisplayValue(value) || placeholder || "Select your subject"
          }
          style={{
            ...style,
            width: "100%",
            height: "3rem",
            backgroundColor: "transparent",
            ...style,
          }}
          allowClear={allowClear}
          dropdownRender={(menu) => <div>{menu}</div>}
          onDropdownVisibleChange={() => setSearchQuery("")} // Reset query saat dropdown dibuka
          onChange={handleChange}
          options={transformedOptions}
          filterOption={(input, option) =>
            (option?.label || option?.value || "")
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
        {error && (
          <span className="text-red-500 text-sm ml-2 mt-4.5">{error}</span>
        )}
      </div>
    </div>
  );
};

export default SelectGroupField;
