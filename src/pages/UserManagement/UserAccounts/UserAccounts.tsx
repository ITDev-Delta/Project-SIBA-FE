import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { baseUrl } from "../../../api/config";
import { getServiceUserManagement } from "../../../api/UserManagements/services/roleAndPermissionService";
import {
  createUserAccountService,
  getServiceUserAccounts,
  updateUserAccountService,
} from "../../../api/UserManagements/services/userAccountService";
import type { IRoleAndPermission } from "../../../api/UserManagements/types/roleAndPermission.interface";
import type { IUserAccount } from "../../../api/UserManagements/types/userAccounts.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";

const UserAccounts: React.FC = () => {
  const {
    setValue: setValueForm,
    getValues: getValuesForm,
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    reset: resetForm,
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchStatus, setSearchStatus] = useState<string>();

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nama",
      children: [
        {
          title: (
            <InputField
              id="nama_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getUserAccounts(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "nama_lengkap",
          align: "center",
          key: "nama_lengkap",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nama_lengkap.localeCompare(b.nama_lengkap),
    },
    {
      title: "Username",
      children: [
        {
          title: (
            <InputField
              id="username_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getUserAccounts(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "username",
          align: "center",
          key: "username",
        },
      ],
      align: "center",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Role",
      children: [
        {
          title: (
            <InputField
              id="role_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getUserAccounts(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "role",
          align: "center",
          key: "role",
          render: (_: any, record: any) => {
            return (
              <span>{record.role_user ? record.role_user.role_name : "-"}</span>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        a.role_user.role_name.localeCompare(b.role_user.role_name),
    },
    {
      title: "Status",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Active", "Inactive"]}
              value={searchStatus}
              onChange={(value: string) => setSearchStatus(value)}
            />
          ),
          align: "center",
          dataIndex: "status",
          key: "status",
          render: (status: string) => {
            return (
              <span
                className={`px-2 py-1 rounded-md text-xs ${
                  status === "Draft" ? "text-black" : "text-white"
                } ${status === "Active" ? "bg-green-600" : "bg-red-600"}`}
              >
                {status === "Active" ? "Active" : "Inactive"}
              </span>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record: any) => {
        return (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleView(record)}
          />
        );
      },
    },
  ];

  const [userAccount, setUserAccount] = useState<IUserAccount[]>([]);
  const [roleAndPermissions, setRoleAndPermissions] = useState<
    IRoleAndPermission[]
  >([]);

  const [selectedRecord, setSelectedRecord] = useState<IUserAccount>();
  const [selectedRole, setSelectedRole] = useState<IRoleAndPermission>();
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddData, setIsAddData] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image, setImage] = useState<File>();

  const [errorRole, setErrorRole] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<string>("");

  const handleView = (record: IUserAccount) => {
    console.log(record);

    const imageUrl = baseUrl.replace(/\/api$/, "");

    setIsAddData(false);

    setPreviewImage(
      record.avatar_path ? `${imageUrl}/storage/${record.avatar_path}` : null
    );

    setSelectedRecord(record);

    setValueForm("nip", record.nip);
    setValueForm("nama", record.nama_lengkap);
    setValueForm("username", record.username);
    setValueForm("email", record.email);
    setValueForm("nomor_telepon", record.nomor_telepon);

    setSelectedRole(record.role_user);
    setSelectedStatus(record.status);

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(undefined);
    setSelectedRole(undefined);
    setSelectedStatus("");

    setIsAddData(false);

    setErrorRole("");
    setErrorStatus("");

    setPreviewImage(null);
    setImage(undefined);

    resetForm();
  };

  const handleFileChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return false;
    }
    // setValue("photo", [file]);
    setPreviewImage(URL.createObjectURL(file));
    setImage(file);
    return false;
  };

  const getUserAccounts = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page,
      per_page: pageSize,
      nama: getValuesForm("nama_search"),
      username: getValuesForm("username_search"),
      role: getValuesForm("role_search"),
      status: searchStatus,
    };

    const promise = getServiceUserAccounts(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setUserAccount(res.data.data.data);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: res.data.data.total,
          });
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getRoleAndPermission = (): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: false,
    };

    const promise = getServiceUserManagement(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setRoleAndPermissions(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedRole) {
      setErrorRole("Role harus diisi!");
      return;
    }

    if (!selectedStatus) {
      setErrorStatus("Status harus diisi!");
      return;
    }

    if (data.password !== data.password_confirmation) {
      toast.error("Password dan Password Confirmation tidak cocok!");
      return;
    }

    if (data.password && data.password !== "") {
      if (data.password.length < 8) {
        toast.error("Password minimal 8 karakter!");
        return;
      }
    }

    setIsLoading(true);

    const payload = {
      avatar: image ?? null,
      nip: data.nip,
      nama_lengkap: data.nama,
      username: data.username,
      password: data.password && data.password !== "" ? data.password : null,
      password_confirmation:
        data.password && data.password !== "" ? data.password : null,
      email: data.email,
      nomor_telepon: data.nomor_telepon,
      roles_id: selectedRole.id,
      status: selectedStatus,
    };

    console.log(payload);

    if (isAddData) {
      await createUserAccountService(payload)
        .then((res) => {
          setIsLoading(false);
          if (res.status === 200 || res.status === 201) {
            setIsLoading(false);
            toast.success(res.data.message);
            getUserAccounts(pagination.current, pagination.pageSize);
            resetForm();
            handleModalClose();
          } else {
            setIsLoading(false);
            toast.error("Failed to submit data");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err", err);
        });
    } else {
      await updateUserAccountService(
        payload,
        selectedRecord?.id.toString() ?? ""
      )
        .then((res) => {
          setIsLoading(false);
          if (res.status === 200 || res.status === 201) {
            setIsLoading(false);
            toast.success(res.data.message);
            getUserAccounts(pagination.current, pagination.pageSize);
            resetForm();
            handleModalClose();
          } else {
            setIsLoading(false);
            toast.error("Failed to edit data");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("err", err);
        });
    }
  };

  useEffect(() => {
    getUserAccounts(1, pagination.pageSize);
    getRoleAndPermission();
  }, [searchStatus]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <MyBreadcrumb pageName="User Accounts" />
        <PrimaryButton
          onClick={() => {
            setIsAddData(true);
            setIsModalOpen(true);
          }}
        >
          Add Data
        </PrimaryButton>
      </div>
      <TableApp
        dataSource={userAccount}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page: number, size: number) =>
          getUserAccounts(page, size)
        }
      />
      <Spin spinning={isLoadingModal} fullscreen />

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          title={
            <>
              <h4>{isAddData ? "Add Account" : "Edit Account"}</h4>
              <div className="flex gap-4 justify-end px-5">
                <PrimaryButton
                  onClick={handleSubmitForm(onSubmit)}
                  isLoading={isLoading}
                >
                  Save
                </PrimaryButton>
              </div>
            </>
          }
          onOk={handleSubmitForm(onSubmit)}
          onCancel={handleModalClose}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          width={800}
          styles={{
            body: {
              maxHeight: "70vh",
              overflowY: "auto",
              minHeight: "30vh",
            },
          }}
        >
          <>
            <form
              onSubmit={handleSubmitForm(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                <div className="md:col-span-2">
                  <label className="block mb-2">Avatar</label>
                  <div className="flex items-center gap-4">
                    {(previewImage || selectedRecord?.avatar_path) && (
                      <img
                        src={previewImage || selectedRecord?.avatar_path}
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                    )}
                    <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded border border-gray-300 hover:bg-gray-200">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileChange(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <InputField
                  label="Nip"
                  id="nip"
                  type="text"
                  defaultValue={isAddData ? "" : selectedRecord?.nip}
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Nip wajib diisi!",
                  }}
                />
                <InputField
                  label="Nama"
                  id="nama"
                  type="text"
                  defaultValue={isAddData ? "" : selectedRecord?.nama_lengkap}
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Nama wajib diisi!",
                  }}
                />
                <InputField
                  label="Username"
                  id="username"
                  type="text"
                  defaultValue={isAddData ? "" : selectedRecord?.username}
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Username wajib diisi!",
                  }}
                />

                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  defaultValue={isAddData ? "" : selectedRecord?.email}
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Email wajib diisi!",
                  }}
                />
                <InputField
                  label="Nomor Telepon"
                  id="nomor_telepon"
                  type="text"
                  defaultValue={isAddData ? "" : selectedRecord?.nomor_telepon}
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Nomor telepon wajib diisi!",
                  }}
                />
                <SelectGroupField
                  label="Role"
                  options={roleAndPermissions}
                  value={selectedRole}
                  error={errorRole}
                  allowClear={false}
                  onChange={(value: IRoleAndPermission) =>
                    setSelectedRole(value)
                  }
                />
                <SelectGroupField
                  label="Status"
                  options={["Active", "Inactive"]}
                  value={selectedStatus}
                  allowClear={false}
                  error={errorStatus}
                  onChange={(value: string) => setSelectedStatus(value)}
                />
              </div>
              <div className="md:col-span-2">
                <hr className="my-4" />
                <p className="mt-1 mb-6 font-medium leading-6 text-gray-900">
                  Ubah Password
                </p>
              </div>
              <InputField
                label="Password"
                id="password"
                type="password"
                register={registerForm}
                errors={errorsForm}
                validationSchema={
                  isAddData
                    ? {
                        required: "Password wajib diisi!",
                      }
                    : {}
                }
              />
              <div className="mt-5"></div>
              <InputField
                label="Password Confirmation"
                id="password_confirmation"
                type="password"
                register={registerForm}
                errors={errorsForm}
                validationSchema={
                  isAddData
                    ? {
                        required: "Password Confirmation wajib diisi!",
                      }
                    : {}
                }
              />
            </form>
          </>
        </Modal>
      )}
    </>
  );
};

export default UserAccounts;
