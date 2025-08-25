import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addAccountCoa } from "../../../../api/Accounting/services/coaSevice";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";

const AccountClassForm = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>("Active");

  const location = useLocation();
  const kode_akun = location.state?.newData || "1";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({});

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedCategory) {
      setError("Kategori harus diisi!");
      return;
    }
    if (!selectedStatus) return;
    setIsLoading(true);

    const payload = {
      ...data,
      kode_akun: data?.kode,
      nama_akun: data?.nama,
      kategori: selectedCategory,
      is_active: selectedStatus === "Active" ? "1" : "0",
      id_parent: undefined,
    };

    await addAccountCoa(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/accounting/coa/account-class");
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
    selectedCategory && console.log(selectedCategory);
    selectedStatus && console.log(selectedStatus);
    setValue("kategori", "");
  }, []);

  return (
    <>
      <div className="sticky top-16 left-0 right-0 flex flex-row justify-between items-center mb-5 bg-white z-40 py-4 ">
        <MyBreadcrumb
          pageName="Account Class"
          link="/accounting/coa/account-class"
          session="Tambah Data"
        />
        <div className="flex justify-end pr-5">
          <PrimaryButton
            onClick={() => {
              if (!selectedCategory) {
                setError("Kategori harus diisi!");
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
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-10">
            <InputField
              label="Kode Account Class"
              id="kode"
              type="number"
              defaultValue={kode_akun}
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
              label="Nama Account Class"
              id="nama"
              type="text"
              register={register}
              errors={errors}
              validationSchema={{ required: "Nama harus diisi!" }}
            />
            <SelectGroupField
              label="Kategori"
              options={["Asset", "Equity", "Liability", "Revenue", "Cost"]}
              value={selectedCategory}
              onChange={(value: string) => {
                setSelectedCategory(value);
                if (value !== null && value !== undefined) {
                  setError(undefined);
                }
              }}
              error={error}
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

export default AccountClassForm;
