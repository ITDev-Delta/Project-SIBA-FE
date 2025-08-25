import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCoaTransaction } from "../../../api/Accounting/services/coaSevice";
import type { ICoa } from "../../../api/Accounting/types/coa.interface";
import type { ICurrency } from "../../../api/Accounting/types/currency.interface";
import { getDataCurrencys } from "../../../api/Controller/GetData";
import { addMasterPaymentSources } from "../../../api/Master/services/paymentSourcesService";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";

const CashAndBankForm = () => {
  const navigate = useNavigate();
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [currency, setCurrency] = useState<ICurrency[]>([]);
  const [selectedCoa, setSelectedCoa] = useState<Partial<ICoa>>();
  const [selectedCurrency, setSelectedCurrency] =
    useState<Partial<ICurrency>>();
  const [error, setError] = useState<string>();
  const [errorCurrency, setErrorCurrency] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedCoa) {
      return;
    }
    if (!selectedCurrency) {
      return;
    }
    setIsLoading(true);

    const payload = {
      ...data,
      nama_sumber_pembayaran: data?.nama_sumber_pembayaran ?? "",
      kode_sumber_pembayaran: data?.kode_sumber_pembayaran ?? "",
      currency_id: (selectedCurrency.id ?? 0).toString(),
      coa_id: (selectedCoa.id ?? 0).toString(),
      atas_nama: data?.atas_nama ?? "",
      no_rekening: data?.no_rekening ?? "",
    };

    await addMasterPaymentSources(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/master/master-cash-bank");
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
  const getCoaTrans = (): void => {
    setIsLoadingModal(true);
    // get by level : 1
    const promise = getCoaTransaction();

    promise
      .then((res) => {
        console.log("res", res);
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          let data = res.data.data as ICoa[];
          data = [
            ...data.filter((item) => item.level != "1" && item.level != "2"),
          ];
          setCoa(data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getCoaTrans();
    getDataCurrencys({
      setData: setCurrency,
      setLoading: setIsLoadingModal,
    });
  }, []);

  return (
    <>
      <div className="sticky top-16 left-0 right-0 flex flex-row justify-between items-center mb-5 bg-white z-40 py-4 ">
        <MyBreadcrumb
          pageName="Master Cash & Bank"
          link="/master/master-cash-bank"
          session="Tambah Data"
        />
        <div className="flex justify-end pr-5">
          <PrimaryButton
            onClick={() => {
              if (!selectedCoa) {
                setError("Akun harus diisi!");
              }
              if (!selectedCurrency) {
                setErrorCurrency("Currency harus diisi!");
              }
              handleSubmit(onSubmit)();
            }}
            isLoading={isLoading}
          >
            Simpan
          </PrimaryButton>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white">
        <Spin spinning={isLoadingModal} fullscreen />
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-10">
            <InputField
              label="Nama Kas & Bank"
              id="nama_sumber_pembayaran"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Nama Kas & Bank harus diisi!",
              }}
            />
            <InputField
              label="Kode Kas & Bank"
              id="kode_sumber_pembayaran"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Kode Kas & Bank harus diisi!",
              }}
            />
            <SelectGroupField
              label="Currency"
              options={currency}
              value={selectedCurrency}
              onChange={(value: ICurrency) => {
                if (value) setErrorCurrency("");
                setSelectedCurrency(value);
              }}
              error={errorCurrency}
            />
            <InputField
              label="Atas Nama"
              id="atas_nama"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Atas Nama harus diisi!",
              }}
            />
            <InputField
              label="No. Rekening"
              id="no_rekening"
              type="number"
              register={register}
              errors={errors}
              validationSchema={{
                required: "No. Rekening harus diisi!",
              }}
            />
            <SelectGroupField
              label="Akun"
              options={coa}
              value={selectedCoa}
              onChange={(value: ICoa) => {
                if (value) setError("");
                setSelectedCoa(value);
              }}
              error={error}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default CashAndBankForm;
