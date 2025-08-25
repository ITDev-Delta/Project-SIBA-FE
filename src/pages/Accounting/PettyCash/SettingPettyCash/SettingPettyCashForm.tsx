import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCoaTransaction } from "../../../../api/Accounting/services/coaSevice";
import { addSettingPettyCash } from "../../../../api/Accounting/services/settingPettiCashService";
import type { ICoa } from "../../../../api/Accounting/types/coa.interface";
import { getMasterDepartemen } from "../../../../api/Master/services/departemenService";
import type { IDepartemen } from "../../../../api/Master/types/departemen.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";

const SettingPettyCashForm = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<IDepartemen[]>([]);
  const [coa, setCoa] = useState<ICoa[]>([]);
  // const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedDepartemen, setSelectedDepartemen] = useState<string>("");
  const [selectedCoaKasKecil, setSelectedCoaKasKecil] = useState<string>("");
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (data?.saldo_maksimum < 0 || data?.maksimum_transaksi < 0) {
      setIsLoading(false);
      toast.error(
        "Maksimum Saldo atau maksimum transaksi harus lebih besar dari 0!"
      );
      return;
    }

    if (
      Number(data?.maksimum_transaksi.replace(/\,/g, "")) >
      Number(data?.saldo_maksimum.replace(/\,/g, ""))
    ) {
      setIsLoading(false);
      toast.error(
        "Maksimum transaksi tidak boleh lebih besar dari maksimum saldo!"
      );
      return;
    }

    const payload = {
      ...data,
      nama_petty_cash: data?.nama_petty_cash,
      departemen_id: selectedDepartemen,
      coa_id: selectedCoaKasKecil,
      saldo_maksimum: data?.saldo_maksimum.replace(/\,/g, ""),
      maksimum_transaksi: data?.maksimum_transaksi.replace(/\,/g, ""),
    };

    console.log("payload", payload);

    await addSettingPettyCash(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/accounting/petty-cash/setting-petty-cash");
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

  const getDepartments = (): void => {
    setIsLoadingModal(true);

    const params = {
      is_active: "1",
    };
    const promise = getMasterDepartemen(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setDepartments(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  const getCoa = (): void => {
    setIsLoadingModal(true);
    const promise = getCoaTransaction();

    promise
      .then((res) => {
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
        console.log("err", err, isLoading);
      });
  };

  useEffect(() => {
    getDepartments();
    getCoa();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb
          pageName="Setting Petty Cash"
          link="/accounting/petty-cash/setting-petty-cash"
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
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-10">
            <InputField
              label="Nama"
              id="nama_petty_cash"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Nama harus diisi!",
              }}
            />
            <SelectGroupField
              label={"Departemen"}
              options={departments}
              value={selectedDepartemen}
              onChange={(value) => {
                setSelectedDepartemen(value.id);
              }}
            />
            <SelectGroupField
              label={"COA Kas Kecil"}
              options={coa}
              value={selectedCoaKasKecil}
              onChange={(value) => {
                setSelectedCoaKasKecil(value.id);
              }}
            />
            {/* {selectedDepartemen && selectedCoaKasKecil && (
              <InputField
                label="Maksimum Saldo Sekarang"
                id="maksimum_saldo_sekarang"
                type="number"
                disabled
                defaultValue="2000000"
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Maksimum Saldo Sekarang harus diisi!",
                }}
              />
            )} */}
            <InputField
              label="Maksimum Saldo Baru"
              id="saldo_maksimum"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Maksimum Saldo Baru harus diisi!",
              }}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              style={{ textAlign: "right", direction: "ltr" }}
            />
            {/* maksimum transaksi sekarang */}
            {/* {selectedDepartemen && selectedCoaKasKecil && (
              <InputField
                label="Maksimum Transaksi Sekarang"
                id="maksimum_transaksi_sekarang"
                type="number"
                disabled
                defaultValue="2000000"
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Maksimum Transaksi Sekarang harus diisi!",
                }}
              />
            )} */}
            <InputField
              label="Maksimum Transaksi Baru"
              id="maksimum_transaksi"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Maksimum Transaksi Baru harus diisi!",
              }}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              style={{ textAlign: "right", direction: "ltr" }}
            />
          </div>
        </form>
      </div>
      <Spin spinning={isLoadingModal} fullscreen />
    </>
  );
};

export default SettingPettyCashForm;
