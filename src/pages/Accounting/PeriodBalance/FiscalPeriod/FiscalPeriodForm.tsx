import { useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addFiscalPeriod } from "../../../../api/Accounting/services/periodService";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import { EnumPeriod } from "../../../../constant/period_enum";

const FiscalPeriodForm = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tanggalMulai, setTanggalMulai] = useState<string>();
  const [tanggalBerakhir, setTanggalBerakhir] = useState<string>();
  const [errorMulai, setErrorMulai] = useState<string>();
  const [errorBerakhir, setErrorBerakhir] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!tanggalMulai) {
      return;
    }

    if (!tanggalBerakhir) {
      return;
    }
    setIsLoading(true);

    if (tanggalMulai === tanggalBerakhir) {
      setIsLoading(false);
      return toast.error("Tanggal Mulai dan Tanggal Berakhir tidak boleh sama");
    }

    const payload = {
      ...data,
      nama_periode: data?.nama_periode,
      tanggal_mulai: tanggalMulai,
      tanggal_berakhir: tanggalBerakhir,
      status: EnumPeriod.Inactive,
    };

    await addFiscalPeriod(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/accounting/period-balance/fiscal-period");
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

  return (
    <>
      <div className="sticky top-16 left-0 right-0 flex flex-row justify-between items-center mb-5 bg-white z-40 py-4 ">
        <MyBreadcrumb
          pageName="Fiscal Period"
          link="/accounting/period-balance/fiscal-period"
          session="Tambah Data"
        />
        <div className="flex justify-end pr-5">
          <PrimaryButton
            onClick={() => {
              if (!tanggalMulai) {
                setErrorMulai("Tanggal Mulai harus diisi!");
              }

              if (!tanggalBerakhir) {
                setErrorBerakhir("Tanggal Mulai harus diisi!");
              }
              handleSubmit(onSubmit)();
            }}
            isLoading={isLoading}
          >
            Simpan
          </PrimaryButton>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-10">
          <InputField
            label="Nama Periode"
            id="nama_periode"
            type="text"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Nama Periode harus diisi!",
            }}
          />
          <SelectDatePicker
            label="Tanggal Mulai"
            defaultValue={tanggalMulai}
            required={!!errorMulai}
            errors={errorMulai}
            onChange={(date) => {
              if (date !== "") {
                setErrorMulai(undefined);
              }
              setTanggalMulai(date);
            }}
          />
          <SelectDatePicker
            label="Tanggal Berakhir"
            defaultValue={tanggalBerakhir}
            required={!!errorBerakhir}
            errors={errorBerakhir}
            onChange={(date) => {
              if (date !== "") {
                setErrorBerakhir(undefined);
              }
              setTanggalBerakhir(date);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default FiscalPeriodForm;
