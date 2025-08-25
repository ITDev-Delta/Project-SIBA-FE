import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCoaSetting,
  getCoaTransaction,
} from "../api/Accounting/services/coaSevice";
import type { ICoa } from "../api/Accounting/types/coa.interface";
import SelectGroupField from "./Forms/SelectGroupField";

interface params {
  coaAccount: string;
  className?: string;
  coaDepartemen: string;
  id?: string;
  disabled?: boolean;
  options?: any[];
  value: any;
  error?: string;
  allowClear?: boolean;
  required?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  onChange(value: any): void;
}
const SelectCoa: React.FC<params> = ({
  disabled = false,
  className,
  onChange,
  options = [],
  style,
  coaAccount,
  coaDepartemen,
}) => {
  const [coa, setCoa] = useState<ICoa[]>(options);
  const [selectValue, setSelectValue] = useState<string>();

  const getCoaTrans = async () => {
    // get by level : 1
    const promise = getCoaTransaction();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          let data = res.data.data as ICoa[];
          data = [
            ...data.filter((item) => item.level != "1" && item.level != "2"),
          ];

          setCoa(data);
        }
      })
      .catch((err) => {
        // setIsLoadingModal(false);
        toast.error(err?.response?.data?.message || "Gagal memuat!");
      });
  };

  const getDataSetting = async (account: string, departemen: string) => {
    try {
      const params = {
        coa_account: account,
        coa_departemen: departemen,
      };
      const response = await getCoaSetting(params);
      if (response.status == 200 || response.status == 201) {
        setSelectValue(response.data.data.coa_setting_name);
      }
    } catch (err) {
      console.error("Kesalahan : ", err);
    }
  };

  const handleChange = (input: any) => {
    setSelectValue(input.full_account_name);
    onChange(input);
  };

  useEffect(() => {
    if (!disabled) {
      if (options.length == 0) getCoaTrans();
      if (options.length > 0) setCoa(options);
    }
    getDataSetting(coaAccount, coaDepartemen);
  }, []);

  return (
    <SelectGroupField
      options={coa}
      value={selectValue}
      disabled={disabled}
      onChange={(value) => {
        handleChange(value);
      }}
      className={className}
      style={style}
    />
  );
};

export default SelectCoa;
