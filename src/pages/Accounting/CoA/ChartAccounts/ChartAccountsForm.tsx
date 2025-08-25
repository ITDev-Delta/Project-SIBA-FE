import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addAccountCoa,
  getAccountCoa,
} from "../../../../api/Accounting/services/coaSevice";
import type { ICoa } from "../../../../api/Accounting/types/coa.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";

const ChartAccountsForm = () => {
  const navigate = useNavigate();
  const [selectedDK, setSelectedDK] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>("Active");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [coaParent, setCoaParent] = useState<ICoa[]>([]);
  const [selectedCoaParent, setSelectedCoaParent] = useState<ICoa>();
  const [error, setError] = useState<string>();
  const [errorParent, setErrorParent] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedCoaParent) {
      setErrorParent("Parent Account harus diisi!");
      return;
    }
    if (!selectedDK && selectedCoaParent?.level === "3") {
      setError("Debit/Kredit harus diisi!");
      return;
    }
    setIsLoading(true);

    if (data.kode_akun.length > 2) {
      toast.error("Kode akun tidak boleh lebih dari 2 digit");
      setIsLoading(false);
      return;
    }

    if (data.kode_akun === "0" || data.kode_akun === "00") {
      toast.error("Kode akun tidak boleh 0");
      setIsLoading(false);
      return;
    }

    if (data.kode_akun.length === 1) {
      data.kode_akun = `0${data.kode_akun}`;
    }

    if (!selectedStatus) {
      setIsLoading(false);
      return;
    }

    if (!selectedDK && data.debit_kredit === undefined) {
      setIsLoading(false);
      return;
    }

    const payload = {
      ...data,
      id_parent: (selectedCoaParent?.id ?? "").toString(),
      kode_akun: data?.kode_akun,
      nama_akun: data?.nama_akun,
      kategori: selectedCoaParent?.kategori ?? "Asset",
      debit_kredit: selectedDK?.toLowerCase() ?? data?.debit_kredit,
      is_active: selectedStatus === "Active" ? "1" : "0",
    };

    await addAccountCoa(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/accounting/coa/account-list");
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

  const getCoaParent = (): void => {
    setIsLoadingModal(true);
    // get by level : 1
    const promise = getAccountCoa();

    promise
      .then((res) => {
        console.log("res", res);
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          let data = res.data.data as ICoa[];
          data = [
            ...data.filter((item) => item.level != "1" && item.level != "2"),
          ];
          setCoaParent(data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getCoaParent();
  }, []);

  const findKodeAkunLastChildinParent = (parent: ICoa) => {
    if (
      parent.all_children?.length === 0 ||
      parent.all_children === undefined
    ) {
      return "1".padStart(2, "0");
    } else {
      const lastChild = parseInt(
        parent.all_children?.[parent.all_children.length - 1]?.kode_akun
      );
      if (lastChild != 99) {
        return (lastChild + 1).toString().padStart(2, "0");
      } else {
        let i = 1;
        while (i < 100) {
          const findChild = parent.all_children?.find(
            (child) => parseInt(child.kode_akun) === i
          );
          if (findChild === undefined) {
            return i.toString().padStart(2, "0");
          }
          i++;
        }
        return "999";
      }
    }
  };

  return (
    <>
      <div className="sticky top-16 left-0 right-0 flex flex-row justify-between items-center mb-5 bg-white z-40 py-4 ">
        <MyBreadcrumb
          pageName="Account List"
          link="/accounting/coa/account-list"
          session="Tambah Data"
        />
        <div className="flex justify-end pr-5">
          <PrimaryButton
            onClick={() => {
              if (!selectedCoaParent) {
                setErrorParent("Parent Account harus diisi!");
              }
              if (!selectedDK && selectedCoaParent?.level === "3") {
                setError("Debit/Kredit harus diisi!");
              }
              handleSubmit(onSubmit)();
            }}
            isLoading={isLoading}
          >
            Simpan
          </PrimaryButton>
        </div>
      </div>
      <Spin spinning={isLoadingModal} fullscreen />
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-10">
            <SelectGroupField
              label="Parent Account"
              options={coaParent}
              value={selectedCoaParent?.full_account_name}
              onChange={(value: ICoa) => {
                console.log("value", value);
                setSelectedCoaParent(value);
                const kode = findKodeAkunLastChildinParent(value);
                setValue("kode_akun", kode.toString(), {
                  shouldValidate: true,
                });
                if (value !== null && value !== undefined) {
                  setErrorParent(undefined);
                }
              }}
              error={errorParent}
            />
            <InputField
              label="Kode Account"
              id="kode_akun"
              type="text"
              register={register}
              errors={errors}
              onKeyDown={(e) => {
                // Cek jika panjang input sudah 1, blokir input tambahan
                if (e.target.value.length >= 2 && e.key !== "Backspace") {
                  e.preventDefault();
                }

                // Blokir input angka 0, koma, titik, dan karakter non-numeric
                if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              validationSchema={{
                required: "Kode harus diisi!",
                pattern: {
                  value: /^\d+$/,
                  message: "Hanya angka yang diperbolehkan",
                },
              }}
            />
            <InputField
              label="Nama Account"
              id="nama_akun"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{ required: "Nama harus diisi!" }}
            />
            {selectedCoaParent && parseInt(selectedCoaParent?.level) === 3 && (
              <SelectGroupField
                label="Debit/Kredit"
                options={["Debit", "Kredit"]}
                value={selectedDK}
                onChange={(value: string) => {
                  setSelectedDK(value);
                  if (value !== null && value !== undefined) {
                    setError(undefined);
                  }
                }}
                error={error}
              />
            )}
            {selectedCoaParent && parseInt(selectedCoaParent?.level) > 3 && (
              <InputField
                label="Debit/Kredit"
                id="debit_kredit"
                defaultValue={selectedCoaParent.debit_kredit}
                type="text"
                disabled
                register={register}
                errors={errors}
                validationSchema={{ required: "Debit/Kredit harus diisi!" }}
              />
            )}
            <SelectGroupField
              label="Status"
              options={["Active", "Inactive"]}
              value={selectedStatus}
              onChange={(value: string) => {
                setSelectedStatus(value);
              }}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ChartAccountsForm;
