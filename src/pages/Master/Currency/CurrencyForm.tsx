import { Checkbox, Spin } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addCurrency,
  getCurrency,
} from "../../../api/Accounting/services/currencyService";
import type { ICurrency } from "../../../api/Accounting/types/currency.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";

const CurrencySetupForm = () => {
  const navigate = useNavigate();

  const statusOptions = ["Active", "Inactive"];
  const [currency, setCurrency] = useState<ICurrency[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Active");
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const getCurrencys = (): void => {
    setIsLoadingModal(true);
    const promise = getCurrency();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setCurrency(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedStatus) return;
    setIsLoading(true);

    if (currency.find((item) => item.kode_currency === data.kode_currency)) {
      setIsLoading(false);
      toast.error("Kode Currency sudah ada!");
      return;
    }

    const payload = {
      ...data,
      nama_currency: data?.nama_currency.trim(),
      kode_currency: data?.kode_currency.trim(),
      is_active: selectedStatus === "Active" ? "1" : "0",
      is_default: isDefault ? "1" : "0",
    };

    await addCurrency(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/accounting/currency/master-currency");
        } else {
          setIsLoading(false);
          toast.error("Failed to add data");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getCurrencys();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <MyBreadcrumb
          pageName="Master Currency"
          link="/accounting/currency/master-currency"
          session="Tambah Data"
        />
        <PrimaryButton
          type="submit"
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
        >
          Simpan
        </PrimaryButton>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-5">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
            <InputField
              label="Nama Currency"
              id="nama_currency"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Nomor Jurnal harus diisi!",
              }}
            />
            <InputField
              label="Kode Currency"
              id="kode_currency"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Kode Currency harus diisi!",
              }}
            />

            <SelectGroupField
              label={"Status"}
              options={statusOptions}
              value={selectedStatus}
              onChange={(value: string) => {
                setSelectedStatus(value);
              }}
            />
          </div>
          <Checkbox
            onChange={(value) => {
              setIsDefault(value.target.checked);
            }}
            className="custom-checkbox"
          >
            {"Apakah ingin menjadikan currency sebagai default?"}
            <span style={{ color: "grey" }}> (optional)</span>
          </Checkbox>
        </form>
      </div>
      <Spin spinning={isLoadingModal} fullscreen />
    </>
  );
};

export default CurrencySetupForm;
