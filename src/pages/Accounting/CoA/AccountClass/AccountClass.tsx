import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import TableApp from "../../../../components/Tables/TableApp";

import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  editAccountCoa,
  getAccountCoa,
  getAccountCoaById,
} from "../../../../api/Accounting/services/coaSevice";
import type {
  ICoa,
  ICoaDetail,
} from "../../../../api/Accounting/types/coa.interface";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import { usePermission } from "../../../../hooks/usePermission";

const AccountClass: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchKategori, setSearchKategori] = useState<string>();
  const [searchStatus, setSearchStatus] = useState<string>();

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("account-class-create");
  const canUpdate = hasPermission("account-class-update");

  const columns: ColumnsType<any> = [
    {
      title: "Kode Class",
      children: [
        {
          title: (
            <InputField
              id="kode_akun_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getCoa(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "kode_akun",
          key: "kode_akun",
        },
      ],
      align: "center",
      sorter: (a, b) => a.kode_akun.localeCompare(b.kode_akun),
    },
    {
      title: "Nama Class",
      children: [
        {
          title: (
            <InputField
              id="nama_akun_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getCoa(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nama_akun",
          key: "nama_akun",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nama_akun.localeCompare(b.nama_akun),
    },
    {
      title: "Kategori",
      dataIndex: "kategori",
      key: "kategori",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              options={["Asset", "Equity", "Liability", "Revenue", "Cost"]}
              value={searchKategori}
              onChange={(value: string) => setSearchKategori(value)}
            />
          ),
          align: "center",
          dataIndex: "kategori",
          key: "kategori",
        },
      ],
      align: "center",
      sorter: (a, b) => a.kategori.localeCompare(b.kategori),
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
          dataIndex: "is_active",
          key: "is_active",
          render: (isActive: string) => {
            return (
              <span
                className={`px-2 py-1 rounded-md text-xs text-white ${
                  isActive == "1" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {isActive == "1" ? "Active" : "Inactive"}
              </span>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    },
    {
      title: "Action",
      dataIndex: "",
      align: "center",
      key: "x",
      render: (_: any, record: any) => {
        if (!canUpdate) {
          return (
            <EyeIcon
              className="h-5 w-5 "
              onClick={() => {
                getCoaById(record.id.toString());
              }}
            />
          );
        }
        return (
          <PencilSquareIcon
            className="h-5 w-5 "
            onClick={() => {
              getCoaById(record.id.toString());
            }}
          />
        );
      },
    },
  ];

  const statusOptions = ["Active", "Inactive"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ICoaDetail | null>(null);

  const getCoa = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      kode: getValues("kode_akun_search") ?? "",
      nama: getValues("nama_akun_search") ?? "",
      kategori: searchKategori ?? "",
      status:
        searchStatus === "Active"
          ? "1"
          : searchStatus === "Inactive"
          ? "0"
          : "",
    };

    // get by level : 1
    const promise = getAccountCoa(1, params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          const data = res.data.data.data.map((item: ICoa) => {
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
          setCoa(data);
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

  const getCoaById = (id: string): void => {
    setIsLoadingModal(true);
    console.log("id", id);
    const promise = getAccountCoaById(id);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          handleEdit(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const handleEdit = (record: ICoaDetail) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
    setSelectedStatus(record.is_active == "1" ? "Active" : "Inactive");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedStatus(undefined);
    reset();
  };

  const onSubmit = (data: any) => {
    console.log("data", selectedStatus);
    setIsLoading(true);

    if (!selectedRecord) {
      setIsLoading(false);
      return;
    }

    if (!selectedStatus) {
      setSelectedStatus(
        selectedRecord.is_active == "1" ? "Active" : "Inactive"
      );
    }

    if (
      selectedStatus ===
      (selectedRecord.is_active == "1" ? "Active" : "Inactive")
    ) {
      setIsLoading(false);
      toast.error("Data belum ada perubahan");
      return;
    }

    const payload = {
      ...data,
      id: selectedRecord?.id,
      is_active: selectedStatus === "Active" ? "1" : "0",
    };

    editAccountCoa(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getCoa(pagination.current, pagination.pageSize);
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah Account!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (coa.length === 0 || !coa) {
      navigate("/accounting/coa/account-class/add");
    } else {
      const existingCodes = coa.map((item) => parseInt(item.kode_akun, 10)); // Ambil semua kode sebagai angka

      // Cari angka terkecil dalam range 1-9 yang belum ada
      let newData = "99"; // Default ke 9 jika semua angka 1-9 sudah ada
      for (let i = 1; i <= 9; i++) {
        if (!existingCodes.includes(i)) {
          newData = i.toString();
          break; // Keluar dari loop saat menemukan angka yang hilang pertama
        }
      }

      navigate("/accounting/coa/account-class/add", {
        state: { newData },
      });
    }
  };

  useEffect(() => {
    getCoa(1, pagination.pageSize);
  }, []);

  useEffect(() => {
    getCoa(1, pagination.pageSize);
  }, [searchKategori, searchStatus]);

  useEffect(() => {
    if (selectedRecord) console.log("selectedRecord", selectedRecord);
  }, [selectedRecord]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Account Class" />
        {canCreate && (
          <PrimaryButton className="ms-auto  " onClick={handleNavigate}>
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <TableApp
        dataSource={coa}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page, pageSize) => getCoa(page, pageSize)}
      />
      <Spin spinning={isLoadingModal} fullscreen />
      {isModalOpen && selectedRecord && (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                {canUpdate ? <>Edit Account Class</> : <>View Account Class</>}
                {canUpdate && (
                  <div className="flex pr-5 justify-end">
                    <PrimaryButton
                      onClick={handleSubmit(onSubmit)}
                      isLoading={isLoading}
                    >
                      Simpan
                    </PrimaryButton>
                  </div>
                )}
              </>
            }
            open={isModalOpen}
            onOk={handleSubmit(onSubmit)}
            onCancel={handleModalClose}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            width={1000}
            styles={{
              body: {
                maxHeight: "70vh",
                overflowY: "auto",
                minHeight: "30vh",
              },
            }}
          >
            <div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 mt-3 p-5">
                <InputField
                  label="Kode Class"
                  defaultValue={selectedRecord.kode_akun}
                  id="kode_akun"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Nama Class"
                  defaultValue={selectedRecord.nama_akun}
                  id="nama_akun"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Kategori"
                  defaultValue={selectedRecord.kategori}
                  id="kategori"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <SelectGroupField
                  label="Status"
                  options={statusOptions}
                  disabled={!canUpdate}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e)}
                />
              </div>

              {selectedRecord.audit_trail &&
                selectedRecord.audit_trail.length > 0 && (
                  <div className="rounded-sm border border-stroke bg-white shadow-defaultp-5 mt-5">
                    <p className="text-title-s font-semibold text-black">
                      Audit Trail
                    </p>

                    <div className="audit-trail-list mt-5">
                      {selectedRecord.audit_trail
                        .slice()
                        .reverse()
                        .map((audit, index) => (
                          <div
                            key={index}
                            className="rounded-sm border border-stroke bg-white shadow-default mb-4"
                          >
                            <div className="user-info flex items-center mb-2 p-2">
                              <div>
                                <h3 className="font-semibold">
                                  {audit.user} {audit.event} {"at "}
                                  {audit.table_name
                                    .replace(/_/g, " ")
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(audit.updated_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {audit.event !== "created" && (
                              <div className="mx-4 mb-4">
                                <ul className="text-sm">
                                  {Object.entries(audit?.new_data ?? {}).map(
                                    ([key, value]) => {
                                      if (key === "id") return null;
                                      if (key === "updated_at") return null;
                                      if (key === "updated_by") return null;
                                      let displayValue = value.toString();
                                      let oldValue =
                                        (audit.old_data as Record<string, any>)[
                                          key
                                        ] ?? "-";

                                      let displayKey = key
                                        .replace(/_/g, " ")
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
                                      if (key === "is_active") {
                                        displayValue =
                                          value == "1" ? "Active" : "Inactive";
                                        oldValue =
                                          oldValue == "1"
                                            ? "Active"
                                            : "Inactive";
                                        displayKey = "Status";
                                      }

                                      return (
                                        <li
                                          key={key}
                                          className={
                                            displayValue === "Active"
                                              ? "text-green-600"
                                              : displayValue === "Inactive"
                                              ? "text-red-600"
                                              : ""
                                          }
                                        >
                                          <span
                                            key={key}
                                            className={
                                              oldValue === "Active"
                                                ? "text-green-600"
                                                : oldValue === "Inactive"
                                                ? "text-red-600"
                                                : ""
                                            }
                                          >
                                            {oldValue}
                                          </span>
                                          <span className="text-gray-500">
                                            {" > "}
                                          </span>
                                          {displayValue}{" "}
                                          <span className="text-gray-500">
                                            ({displayKey})
                                          </span>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </Modal>
        </form>
      )}
    </>
  );
};

export default AccountClass;
