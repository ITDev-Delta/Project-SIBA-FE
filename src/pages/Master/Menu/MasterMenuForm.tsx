import { Checkbox, Spin, Switch } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createMenu,
  getAllMenus,
} from "../../../api/Master/services/masterMenuService";
import type { IMenu } from "../../../api/Master/types/masterMenu.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";

const MenuForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>();
  const [error, setError] = useState<string>();
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [useParent, setUseParent] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({});

  const getMenus = (): void => {
    setIsLoadingModal(true);
    const promise = getAllMenus();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setMenus(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedModule && useParent) {
      setError("Module harus diisi!");
      return;
    }

    setIsLoading(true);

    const payload = {
      module: useParent ? selectedModule.module : data.url,
      parent_id: data.parent_id || null,
      menu_name: data.menu_name,
      kode: useParent
        ? selectedModule.kode +
          (selectedModule.children?.length
            ? `.${selectedModule.children.length + 1}`
            : ".1")
        : (menus.length + 1).toString(),
      kode_parent: selectedModule?.kode ?? null,
      url: data.url,
      level: data.level,
      is_create: data.is_create == "1" ? "1" : "0",
      is_view: "1",
      is_update: data.is_update == "1" ? "1" : "0",
      is_delete: data.is_delete == "1" ? "1" : "0",
      is_approve: data.is_approve == "1" ? "1" : "0",
      is_reject: data.is_reject == "1" ? "1" : "0",
      is_show: data.is_detail == "1" ? "1" : "0",
    };

    console.log("payload", payload);

    createMenu(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          reset();
          toast.success(res.data.message);
          navigate("/master/master-menu");
        } else {
          setIsLoading(false);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  function flattenMenuItems(menuItems: IMenu[], list: Partial<IMenu>[] = []) {
    if (!menuItems) {
      return list;
    }

    for (const item of menuItems) {
      // Buat salinan item tanpa children untuk dimasukkan ke daftar
      // const { children, ...itemWithoutChildren } = item;
      list.push(item);

      // Jika ada children, panggil fungsi ini lagi untuk anak-anaknya
      if (item.children && item.children.length > 0) {
        flattenMenuItems(item.children, list);
      }
    }

    return list;
  }

  useEffect(() => {
    getMenus();
  }, []);

  return (
    <>
      <div className="sticky top-16 left-0 right-0 flex flex-row justify-between items-center mb-5 bg-white z-40 py-4">
        <MyBreadcrumb
          pageName="Master Menu"
          link="/master/master-menu"
          session="Tambah Data"
        />
        <div className="flex justify-end pr-5">
          <PrimaryButton onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
            Simpan
          </PrimaryButton>
        </div>
      </div>

      <Spin spinning={isLoadingModal} fullscreen />
      <div className="pt-6 pb-6">
        <Switch
          checked={useParent}
          onChange={(e) => {
            setUseParent(e);
            if (!e) {
              setSelectedModule(null);
              setValue("parent_id", null);
              setValue("level", "0");
            } else {
              setValue("level", null);
            }
          }}
          className="custom-switch text-sm font-medium"
        />
        <span className="ml-2 text-sm font-medium">Gunakan Parent</span>
      </div>
      <div className="rounded-sm border border-stroke bg-white">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 p-6">
          {useParent && (
            <SelectGroupField
              label="Parent"
              value={selectedModule?.full_url ?? ""}
              onChange={(value) => {
                if (!value) {
                  setSelectedModule(null);
                  setValue("parent_id", null);
                  setValue("level", null);
                  return;
                }
                setSelectedModule(value);
                setValue("parent_id", value.id);
                setValue("level", (Number(value.level) + 1).toString());
              }}
              options={flattenMenuItems(menus)}
              error={error}
            />
          )}
          <InputField
            label="Level"
            id="level"
            type="text"
            disabled
            register={register}
            errors={errors}
            validationSchema={{
              required: "Level harus diisi!",
            }}
          />
          {useParent && (
            <InputField
              label="Parent ID"
              id="parent_id"
              type="text"
              disabled
              register={register}
              errors={errors}
              validationSchema={{}}
            />
          )}

          <InputField
            label="Menu Name"
            id="menu_name"
            type="text"
            register={register}
            errors={errors}
            validationSchema={{
              required: "Menu name harus diisi!",
            }}
          />

          <InputField
            label="URL"
            id="url"
            type="text"
            register={register}
            errors={errors}
            validationSchema={{
              required: "URL harus diisi!",
            }}
          />
        </div>
        <div className="space-y-2 px-6 mb-10">
          <label className="block text-sm font-medium">Permissions</label>
          <Checkbox
            className="custom-checkbox"
            disabled
            defaultChecked={true}
            onChange={(_) => {}}
          >
            View
          </Checkbox>
          <Checkbox
            className="custom-checkbox"
            onChange={(e) => {
              setValue("is_create", e.target.checked ? "1" : "0");
            }}
          >
            Create
          </Checkbox>
          <Checkbox
            className="custom-checkbox"
            onChange={(e) => {
              setValue("is_update", e.target.checked ? "1" : "0");
            }}
          >
            Update
          </Checkbox>
          <Checkbox
            className="custom-checkbox"
            onChange={(e) => {
              setValue("is_delete", e.target.checked ? "1" : "0");
            }}
          >
            Delete
          </Checkbox>
          <Checkbox
            className="custom-checkbox"
            onChange={(e) => {
              setValue("is_approve", e.target.checked ? "1" : "0");
            }}
          >
            Approve
          </Checkbox>
          <Checkbox
            className="custom-checkbox"
            onChange={(e) => {
              setValue("is_reject", e.target.checked ? "1" : "0");
            }}
          >
            Reject
          </Checkbox>
          <Checkbox
            className="custom-checkbox"
            onChange={(e) => {
              setValue("is_detail", e.target.checked ? "1" : "0");
            }}
          >
            Detail
          </Checkbox>
        </div>
      </div>
    </>
  );
};

export default MenuForm;
