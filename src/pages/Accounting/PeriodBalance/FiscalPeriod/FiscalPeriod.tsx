import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import TableApp from "../../../../components/Tables/TableApp";

import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import {
  editFiscalPeriod,
  getFiscalPeriod,
  getFiscalPeriodById,
} from "../../../../api/Accounting/services/periodService";
import type {
  IPeriod,
  IPeriodDetail,
} from "../../../../api/Accounting/types/period.interface";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import { EnumPeriod } from "../../../../constant/period_enum";
import { usePermission } from "../../../../hooks/usePermission";
import { formatDate } from "../../../../utils/format_date";

const FiscalPeriod: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });

  const [searchStatus, setSearchStatus] = useState<string>();

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("fiscal-period-create");
  const canUpdate = hasPermission("fiscal-period-update");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nama Periode",
      children: [
        {
          title: (
            <InputField
              id="nama_periode_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getPeriod(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "nama_periode",
          key: "nama_periode",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nama_periode.localeCompare(b.nama_periode),
    },
    {
      title: "Tanggal Mulai",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_mulai_search", date);
                getPeriod(1, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_mulai",
          key: "tanggal_mulai",
          align: "right",
          render: (tanggal_mulai: string) => {
            return formatDate(tanggal_mulai);
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        String(a.tanggal_mulai || "").localeCompare(
          String(b.tanggal_mulai || "")
        ),
    },
    {
      title: "Tanggal Berakhir",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_berakhir_search", date);
                getPeriod(1, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_berakhir",
          key: "tanggal_berakhir",
          align: "right",
          render: (tanggal_berakhir: string) => {
            return formatDate(tanggal_berakhir);
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        String(a.tanggal_berakhir || "").localeCompare(
          String(b.tanggal_berakhir || "")
        ),
    },
    {
      title: "Status",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Active", "Inactive", "Locked", "Closed"]}
              value={searchStatus}
              onChange={(value: string) => setSearchStatus(value)}
            />
          ),
          align: "center",
          dataIndex: "status",
          key: "status",
          render: (status: string) => {
            let statusClass = "bg-red-600";
            if (status === EnumPeriod.Active) {
              statusClass = "bg-green-600";
            } else if (status === EnumPeriod.Inactive) {
              statusClass = "bg-gray-500";
            } else if (status === EnumPeriod.Locked) {
              statusClass = "bg-amber-500";
            }
            return (
              <span
                className={`px-2 py-1 rounded-md text-xs text-white ${statusClass}`}
              >
                {status}
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
      align: "center",
      key: "x",
      render: (_: any, record: IPeriod) => {
        if (record.status !== EnumPeriod.Closed && canUpdate) {
          return (
            <PencilSquareIcon
              className="h-5 w-5 "
              onClick={() => {
                getPeriodById(record.id.toString());
              }}
            />
          );
        }
        return (
          <EyeIcon
            className="h-5 w-5 "
            onClick={() => {
              getPeriodById(record.id.toString());
            }}
          />
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenLockModal, setIsOpenLockModal] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<EnumPeriod>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [periods, setPeriods] = useState<IPeriod[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<IPeriodDetail | null>(
    null
  );
  const [tanggalMulai, setTanggalMulai] = useState<string>();
  const [tanggalBerakhir, setTanggalBerakhir] = useState<string>();
  const [errorMulai, setErrorMulai] = useState<string>();
  const [errorBerakhir, setErrorBerakhir] = useState<string>();

  const getPeriod = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      nama_periode: getValues("nama_periode_search"),
      tanggal_mulai: getValues("tanggal_mulai_search"),
      tanggal_berakhir: getValues("tanggal_berakhir_search"),
      status: searchStatus,
    };

    // get by level : 1
    const promise = getFiscalPeriod(params);
    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setPeriods(res.data.data.data);
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

  const getPeriodById = (id: string): void => {
    setIsLoadingModal(true);
    const promise = getFiscalPeriodById(id);
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

  const handleEdit = (record: IPeriodDetail) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
    setTanggalMulai(record.tanggal_mulai);
    setTanggalBerakhir(record.tanggal_berakhir);
    setSelectedStatus(record.status as EnumPeriod);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedStatus(undefined);
    reset();
  };

  const onLock = async (data: FieldValues, status: string) => {
    if (!selectedRecord) return;
    setIsLoading(true);
    const payload = {
      ...data,
      id: selectedRecord?.id,
      nama_periode: data?.nama_periode,
      tanggal_mulai: selectedRecord?.tanggal_mulai,
      tanggal_berakhir: selectedRecord?.tanggal_berakhir,
      status: status,
    };

    editFiscalPeriod(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getPeriod(pagination.current, pagination.pageSize);
          setIsLoading(false);
          setIsOpenLockModal(false);
          handleModalClose();
          toast.success(res.data.message);
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah Period!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  const onSubmit = (data: any, status: string) => {
    if (!tanggalMulai) {
      setErrorMulai("Tanggal Mulai harus diisi!");
      return;
    }
    if (!tanggalBerakhir) {
      setErrorBerakhir("Tanggal Berakhir harus diisi!");
      return;
    }
    setIsLoading(true);

    if (!selectedRecord) {
      setIsLoading(false);
      return;
    }

    if (!selectedStatus) {
      setSelectedStatus(selectedRecord.status as EnumPeriod);
    }

    const dataTanggalMulai = new Date(tanggalMulai).toISOString().split("T")[0];
    const dataTanggalBerakhir = new Date(tanggalBerakhir)
      .toISOString()
      .split("T")[0];

    if (dataTanggalMulai === dataTanggalBerakhir) {
      setIsLoading(false);
      toast.error("Tanggal Mulai dan Tanggal Berakhir tidak boleh sama");
      return;
    }

    if (
      data.nama_periode === selectedRecord.nama_periode &&
      dataTanggalMulai === selectedRecord.tanggal_mulai &&
      dataTanggalBerakhir === selectedRecord.tanggal_berakhir &&
      status === selectedRecord.status
    ) {
      setIsLoading(false);
      toast.error("Data belum ada perubahan");
      return;
    }

    if (status === EnumPeriod.Active) {
      const listPeriodActiveandLocked = periods.filter(
        (period) =>
          period.status === EnumPeriod.Active ||
          period.status === EnumPeriod.Locked
      );
      if (listPeriodActiveandLocked.length > 1) {
        setIsLoading(false);
        toast.error(
          "Tidak dapat mengaktifkan periode baru, karena melampaui batas periode aktif dan terkunci"
        );
        return;
      }
    }

    const payload = {
      ...data,
      id: selectedRecord?.id,
      tanggal_mulai: dataTanggalMulai,
      tanggal_berakhir: dataTanggalBerakhir,
      status: status,
    };

    editFiscalPeriod(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getPeriod(pagination.current, pagination.pageSize);
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah Period!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getPeriod(1, pagination.pageSize);
  }, []);

  useEffect(() => {
    getPeriod(1, pagination.pageSize);
  }, [searchStatus]);

  useEffect(() => {
    // if (selectedRecord) console.log("selectedRecord", selectedRecord);
  }, [selectedRecord]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Fiscal Period" />
        {canCreate && (
          <PrimaryButton to={"/accounting/period-balance/fiscal-period/add"}>
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <TableApp
        dataSource={periods}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page, pageSize) => getPeriod(page, pageSize)}
      />
      <Spin spinning={isLoadingModal} fullscreen />
      {isModalOpen && selectedRecord && (
        <form encType="multipart/form-data">
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                {canUpdate ? <>Edit Fiscal Period</> : <>View Fiscal Period</>}
                {canUpdate &&
                  (selectedRecord.status === EnumPeriod.Active ||
                    selectedRecord.status === EnumPeriod.Locked) && (
                    <div className="flex pr-5 justify-end ">
                      <PrimaryButton onClick={() => setIsOpenLockModal(true)}>
                        {selectedRecord?.status === EnumPeriod.Active
                          ? "Lock"
                          : "Unlock"}{" "}
                        Period
                      </PrimaryButton>
                    </div>
                  )}
                {canUpdate && selectedRecord.status === EnumPeriod.Inactive && (
                  <div className="flex gap-3 justify-end pr-5 ">
                    <PrimaryButton
                      onClick={handleSubmit((data) =>
                        onSubmit(data, EnumPeriod.Active)
                      )}
                      color="green-600"
                      isLoading={isLoading}
                    >
                      Aktifkan
                    </PrimaryButton>
                    <PrimaryButton
                      onClick={handleSubmit((data) =>
                        onSubmit(data, EnumPeriod.Inactive)
                      )}
                      isLoading={isLoading}
                    >
                      Simpan
                    </PrimaryButton>
                  </div>
                )}
              </>
            }
            open={isModalOpen}
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
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 mt-3 px-5">
                <InputField
                  label="Nama Periode"
                  id="nama_periode"
                  type="text"
                  disabled={
                    selectedRecord.status !== EnumPeriod.Inactive || !canUpdate
                  }
                  defaultValue={selectedRecord.nama_periode}
                  register={register}
                  errors={errors}
                  validationSchema={
                    selectedRecord.status !== EnumPeriod.Inactive
                      ? { required: "Nama Periode harus diisi!" }
                      : {}
                  }
                />
                <SelectDatePicker
                  label="Tanggal Mulai"
                  defaultValue={tanggalMulai}
                  required={!!errorMulai}
                  errors={errorMulai}
                  disabled={
                    selectedRecord.status !== EnumPeriod.Inactive || !canUpdate
                  }
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
                  disabled={
                    selectedRecord.status !== EnumPeriod.Inactive || !canUpdate
                  }
                  onChange={(date) => {
                    if (date !== "") {
                      setErrorBerakhir(undefined);
                    }
                    setTanggalBerakhir(date);
                  }}
                />
                <InputField
                  label="Status"
                  id="status"
                  type="text"
                  disabled
                  defaultValue={selectedRecord.status}
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
              </div>

              {isOpenLockModal && (
                <Modal
                  key={selectedRecord?.id}
                  title={`${
                    selectedRecord?.status === EnumPeriod.Active
                      ? "Lock"
                      : "Unlock"
                  } Period`}
                  centered
                  onCancel={() => setIsOpenLockModal(false)}
                  open={isOpenLockModal}
                  okButtonProps={{ hidden: true }}
                  cancelButtonProps={{ hidden: true }}
                >
                  <p className="text-center text-lg mt-10">
                    Apakah Anda yakin untuk{" "}
                    {selectedRecord?.status === EnumPeriod.Active
                      ? "mengunci"
                      : "membuka"}{" "}
                    periode ini?
                  </p>
                  <div className="flex justify-end gap-3 mt-10">
                    <PrimaryButton
                      onClick={() => setIsOpenLockModal(false)}
                      outlined
                    >
                      Tidak
                    </PrimaryButton>
                    <PrimaryButton
                      type="submit"
                      isLoading={isLoading}
                      onClick={handleSubmit((data) =>
                        onLock(
                          data,
                          selectedRecord?.status === EnumPeriod.Active
                            ? "Locked"
                            : "Active"
                        )
                      )}
                    >
                      {selectedRecord?.status === EnumPeriod.Active
                        ? "Lock"
                        : "Unlock"}{" "}
                      Period
                    </PrimaryButton>
                  </div>
                </Modal>
              )}

              {selectedRecord.audit_trail &&
                selectedRecord.audit_trail.length > 0 && (
                  <div className="rounded-sm border border-stroke bg-white shadow-default p-5 mt-5">
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

                                      return (
                                        <li
                                          key={key}
                                          className={(() => {
                                            if (
                                              displayValue === EnumPeriod.Active
                                            )
                                              return "text-green-600";
                                            if (
                                              displayValue === EnumPeriod.Closed
                                            )
                                              return "text-red-600";
                                            if (
                                              displayValue ===
                                              EnumPeriod.Inactive
                                            )
                                              return "text-gray-500";
                                            if (
                                              displayValue === EnumPeriod.Locked
                                            )
                                              return "text-amber-500";
                                            return "";
                                          })()}
                                        >
                                          <span
                                            key={key}
                                            className={(() => {
                                              if (
                                                oldValue === EnumPeriod.Active
                                              )
                                                return "text-green-600";
                                              if (
                                                oldValue === EnumPeriod.Closed
                                              )
                                                return "text-red-600";
                                              if (
                                                oldValue === EnumPeriod.Inactive
                                              )
                                                return "text-gray-500";
                                              if (
                                                oldValue === EnumPeriod.Locked
                                              )
                                                return "text-amber-500";
                                              return "";
                                            })()}
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

export default FiscalPeriod;
