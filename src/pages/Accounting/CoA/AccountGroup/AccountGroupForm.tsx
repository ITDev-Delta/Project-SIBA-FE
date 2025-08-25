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

const AccountGroupForm = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>("Active");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [coaParent, setCoaParent] = useState<ICoa[]>([]);
  const [selectedCoaParent, setSelectedCoaParent] = useState<ICoa>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedCoaParent) {
      setError("Parent Account harus diisi!");
      return;
    }
    if (!selectedStatus) return;
    setIsLoading(true);

    if (data.kode_akun.length > 1) {
      toast.error("Kode akun tidak boleh lebih dari 1 digit");
      setIsLoading(false);
      return;
    }

    if (data.kode_akun === "0") {
      toast.error("Kode akun tidak boleh 0");
      setIsLoading(false);
      return;
    }

    const payload = {
      ...data,
      id_parent: (selectedCoaParent?.id ?? "").toString(),
      kode_akun: data?.kode_akun,
      nama_akun: data?.nama_akun,
      kategori: selectedCoaParent?.kategori ?? "Asset",
      is_active: selectedStatus === "Active" ? "1" : "0",
    };

    await addAccountCoa(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/accounting/coa/account-group");
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
    const promise = getAccountCoa(2);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          const data = res.data.data.map((item: ICoa) => {
            const removeEmptyChildren = (item: ICoa) => {
              if (item.all_children?.length === 0) {
                delete item.all_children;
              } else {
                item.all_children = item.all_children?.map(removeEmptyChildren);
              }
              return item;
            };

            return removeEmptyChildren(item);
          });
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
      return 1;
    } else {
      const lastChild = parseInt(
        parent.all_children?.[parent.all_children.length - 1]?.kode_akun
      );
      if (lastChild !== 9) {
        return lastChild + 1;
      } else {
        let i = 1;
        while (i < 10) {
          const findChild = parent.all_children?.find(
            (child) => parseInt(child.kode_akun) === i
          );
          if (findChild === undefined) {
            return i;
          }
          i++;
        }
        return 99;
      }
    }
  };

  return (
    <>
      <div className="sticky top-16 left-0 right-0 flex flex-row justify-between items-center mb-5 bg-white z-40 py-4 ">
        <MyBreadcrumb
          pageName="Account Group"
          link="/accounting/coa/account-group"
          session="Tambah Data"
        />
        <div className="flex justify-end pr-5">
          <PrimaryButton
            onClick={() => {
              if (!selectedCoaParent) {
                setError("Parent Account harus diisi!");
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
      <div className="rounded-sm border border-stroke bg-white ">
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
                  setError(undefined);
                }
              }}
              error={error}
            />
            <InputField
              label="Kode Account Group"
              id="kode_akun"
              type="text"
              register={register}
              errors={errors}
              onKeyDown={(e) => {
                // Cek jika panjang input sudah 1, blokir input tambahan
                if (e.target.value.length >= 1 && e.key !== "Backspace") {
                  e.preventDefault();
                }
                // Blokir input angka 0, koma, titik, dan karakter non-numeric
                if (!/^[1-9]$/.test(e.key) && e.key !== "Backspace") {
                  e.preventDefault();
                }
              }}
              validationSchema={{
                required: "Kode harus diisi!",
                pattern: {
                  value: /^\d+$/,
                  message: "Hanya angka yang diperbolehkan",
                },

                maxLength: {
                  value: 1,
                  message: "Maksimal 1 angka",
                },
              }}
            />
            <InputField
              label="Nama Account Group"
              id="nama_akun"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{ required: "Nama harus diisi!" }}
            />
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

export default AccountGroupForm;
