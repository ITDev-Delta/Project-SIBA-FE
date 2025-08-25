import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import TableApp from "../../../components/Tables/TableApp";

import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { ColumnsType } from "antd/es/table";
import { getCoaTransaction } from "../../../api/Accounting/services/coaSevice";
import type { ICoa } from "../../../api/Accounting/types/coa.interface";
import {
  editMasterPaymentSources,
  getMasterPaymentSources,
  getMasterPaymentSourcesById,
} from "../../../api/Master/services/paymentSourcesService";
import type {
  IPaymentSources,
  IPaymentSourcesDetail,
} from "../../../api/Master/types/paymentSources.interface";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import { usePermission } from "../../../hooks/usePermission";
import { toPascalCase } from "../../../utils/format_text";

const CashAndBank: React.FC = () => {
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

  const [searchStatus, setSearchStatus] = useState<string>();

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("master-cash-bank-create");
  const canUpdate = hasPermission("master-cash-bank-update");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nama Kas & Bank",
      children: [
        {
          title: (
            <InputField
              id="nama_sumber_pembayaran_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getPaymentSourcess(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "nama_sumber_pembayaran",
          key: "nama_sumber_pembayaran",
        },
      ],
      align: "center",
      sorter: (a, b) =>
        a.nama_sumber_pembayaran.localeCompare(b.nama_sumber_pembayaran),
    },
    {
      title: "Kode",
      children: [
        {
          title: (
            <InputField
              id="kode_sumber_pembayaran_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getPaymentSourcess(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "kode_sumber_pembayaran",
          key: "kode_sumber_pembayaran",
        },
      ],
      align: "center",
      sorter: (a, b) =>
        a.kode_sumber_pembayaran.localeCompare(b.kode_sumber_pembayaran),
    },
    {
      title: "Currency",
      children: [
        {
          title: (
            <InputField
              id="currency_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getPaymentSourcess(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "currency",
          key: "currency",
          render: (currency: any) => {
            return currency?.nama_currency || "-";
          },
        },
      ],
      align: "center",
      sorter: (a, b) => {
        return a.currency?.nama_currency?.localeCompare(
          b.currency?.nama_currency
        );
      },
    },
    {
      title: "Atas Nama",
      children: [
        {
          title: (
            <InputField
              id="atas_nama_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getPaymentSourcess(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "atas_nama",
          key: "atas_nama",
          render: (string: string) => string ?? "-",
        },
      ],
      align: "center",
      sorter: (a, b) => a.atas_nama.localeCompare(b.atas_nama),
    },
    {
      title: "Akun",
      children: [
        {
          title: (
            <InputField
              id="coa_account_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getPaymentSourcess(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "coa_account",
          key: "coa_account",
        },
      ],
      align: "center",
      sorter: (a, b) => a.coa_account.localeCompare(b.coa_account),
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
          render: (isActive: string) => {
            return (
              <span
                className={`px-2 py-1 rounded-md text-xs text-white ${
                  isActive == "active" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {toPascalCase(isActive)}
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
      align: "center",
      render: (_: any, record: IPaymentSources) => {
        if (!canUpdate)
          return (
            <EyeIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => getPaymentSourcesById(record.id.toString())}
            />
          );
        return (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => getPaymentSourcesById(record.id.toString())}
          />
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [selectedCoa, setSelectedCoa] = useState<Partial<ICoa>>();
  const [error, setError] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [paymentSources, setPaymentSources] = useState<IPaymentSources[]>([]);

  const [selectedRecord, setSelectedRecord] =
    useState<IPaymentSourcesDetail | null>(null);

  const getPaymentSourcess = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      page: page,
      per_page: pageSize,
      is_pagination: true,
      nama_sumber_pembayaran: getValues("nama_sumber_pembayaran_search"),
      kode_sumber_pembayaran: getValues("kode_sumber_pembayaran_search"),
      nama_currency: getValues("currency_search"),
      coa_account: getValues("coa_account_search"),
      atas_nama: getValues("atas_nama_search"),
      status: searchStatus,
    };

    const promise = getMasterPaymentSources(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setPaymentSources(res.data.data.data);
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

  //get payment sources by id
  const getPaymentSourcesById = (id: string): void => {
    setIsLoadingModal(true);
    console.log("id", id);
    const promise = getMasterPaymentSourcesById(id);

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

  const handleEdit = (record: IPaymentSourcesDetail) => {
    setSelectedRecord(record);
    setSelectedStatus(toPascalCase(record.payment_sources.status));
    setSelectedCoa({
      id: Number(record.payment_sources.coa_id),
      full_account_name: record.payment_sources.coa_account ?? "",
    });

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedCoa(undefined);
    setSelectedStatus(undefined);
    setError(undefined);
    reset();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedRecord) return;
    if (!selectedCoa) {
      return;
    }

    if (!selectedStatus) {
      setSelectedStatus(toPascalCase(selectedRecord.payment_sources.status));
    }
    setIsLoading(true);

    if (
      data.nama_sumber_pembayaran ===
        selectedRecord.payment_sources.nama_sumber_pembayaran &&
      data.kode_sumber_pembayaran ===
        selectedRecord.payment_sources.kode_sumber_pembayaran &&
      selectedStatus === toPascalCase(selectedRecord.payment_sources.status) &&
      selectedCoa.id === Number(selectedRecord.payment_sources.coa_id) &&
      data.atas_nama === selectedRecord.payment_sources.atas_nama &&
      data.no_rekening === selectedRecord.payment_sources.no_rekening
    ) {
      setIsLoading(false);
      toast.error("Data belum ada perubahan");
      return;
    }

    const payload = {
      id: selectedRecord?.payment_sources.id,
      nama_sumber_pembayaran: data?.nama_sumber_pembayaran,
      kode_sumber_pembayaran: data?.kode_sumber_pembayaran,
      atas_nama: data?.atas_nama,
      no_rekening: data?.no_rekening,
      currency_id: selectedRecord.payment_sources.currency?.id,
      coa_id: (selectedCoa.id ?? 0).toString(),
      status: selectedStatus!.toLowerCase(),
    };

    console.log("payload", payload);

    editMasterPaymentSources(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getPaymentSourcess(pagination.current, pagination.pageSize);
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah kas / bank!");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
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
  }, []);

  useEffect(() => {
    getPaymentSourcess(1, pagination.pageSize);
  }, [searchStatus]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Master Cash & Bank" />
        {canCreate && (
          <PrimaryButton
            to={"/master/master-cash-bank/add"}
            className="ms-auto  "
          >
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <TableApp
        dataSource={paymentSources}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page, pageSize) =>
          getPaymentSourcess(page, pageSize)
        }
      />
      <Spin spinning={isLoadingModal} fullscreen />
      {isModalOpen && selectedRecord && (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Modal
            key={selectedRecord?.payment_sources.id}
            title={
              <>
                {canUpdate ? <>Edit Cash & Bank</> : <>View Cash & Bank</>}
                {canUpdate && (
                  <div className="flex mr-5 justify-end">
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
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 px-6 pt-6">
                <InputField
                  label="Nama Kas & Bank"
                  defaultValue={
                    selectedRecord.payment_sources.nama_sumber_pembayaran
                  }
                  id="nama_sumber_pembayaran"
                  type="text"
                  register={register}
                  errors={errors}
                  disabled={!canUpdate}
                  validationSchema={{
                    required: "Nama Kas & Bank harus diisi!",
                  }}
                />
                <InputField
                  label="Kode Kas & Bank"
                  defaultValue={
                    selectedRecord.payment_sources.kode_sumber_pembayaran
                  }
                  id="kode_sumber_pembayaran"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Kode Kas & Bank harus diisi!",
                  }}
                />
                <InputField
                  label="Currency"
                  defaultValue={
                    selectedRecord.payment_sources.currency?.nama_currency
                  }
                  id="currency"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Atas Nama"
                  id="atas_nama"
                  type="text"
                  defaultValue={selectedRecord.payment_sources.atas_nama}
                  disabled={!canUpdate}
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
                  defaultValue={selectedRecord.payment_sources.no_rekening}
                  disabled={!canUpdate}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "No. Rekening harus diisi!",
                  }}
                />
                <SelectGroupField
                  label="Status"
                  options={["Active", "Inactive"]}
                  disabled={!canUpdate}
                  value={
                    selectedStatus ??
                    toPascalCase(selectedRecord.payment_sources.status)
                  }
                  onChange={(value: string) => {
                    setSelectedStatus(value);
                  }}
                />
              </div>
              <div className="px-5 mb-10 mt-3 ">
                <SelectGroupField
                  label="Akun"
                  options={coa}
                  disabled
                  value={selectedCoa}
                  onChange={(value: ICoa) => {
                    setSelectedCoa(value);
                  }}
                  error={error}
                />
              </div>

              {selectedRecord.payment_sources.audit_trail &&
                selectedRecord.payment_sources.audit_trail.length > 0 && (
                  <div className="rounded-sm border border-stroke bg-white shadow-default p-5 mt-5">
                    <p className="text-title-s font-semibold text-black">
                      Audit Trail
                    </p>

                    <div className="audit-trail-list mt-5">
                      {selectedRecord.payment_sources.audit_trail
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
                                      if (key === "status") {
                                        displayValue =
                                          value === "active"
                                            ? "Active"
                                            : "Inactive";
                                        oldValue =
                                          oldValue === "active"
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

export default CashAndBank;
