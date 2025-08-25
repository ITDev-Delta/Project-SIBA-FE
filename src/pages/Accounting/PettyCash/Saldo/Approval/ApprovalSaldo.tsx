import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import {
  editRequestSaldoStatus,
  getRequestSaldo,
  getRequestSaldoServicebyId,
} from "../../../../../api/Accounting/services/requestSaldoService";
import type {
  IRequestSaldo,
  IRequestSaldoDetail,
} from "../../../../../api/Accounting/types/requestSaldo.interface";
import MyBreadcrumb from "../../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../../components/Button/PrimaryButton";
import InputField from "../../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../../components/Tables/TableApp";
import { ApprovalSaldoEnum } from "../../../../../constant/approval_saldo_enum";
import { usePermission } from "../../../../../hooks/usePermission";
import { formatCurrency } from "../../../../../utils/format_currency";
import { formatDate } from "../../../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../../utils/InputCurrencyUtils";

const ApprovalSaldo: React.FC = () => {
  const {
    register,
    reset,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchStatus, setSearchStatus] = useState<string>();

  const { hasPermission } = usePermission();
  const canUpdate = hasPermission("approval-saldo-update");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nomor Jurnal",
      children: [
        {
          title: (
            <InputField
              id="nomor_journal_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getRequestSaldos(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "nomor_journal",
          key: "nomor_journal",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nomor_journal.localeCompare(b.nomor_journal),
    },
    {
      title: "Tanggal Pengajuan",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_journal_search", date);
                getRequestSaldos(1, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_journal",
          align: "center",
          key: "tanggal_journal",
          render: (tanggal_journal: string) => {
            return (
              <div className="text-right">{formatDate(tanggal_journal)}</div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.tanggal_journal.localeCompare(b.tanggal_journal),
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
      align: "center",
      render: (deskripsi: string) => {
        return <div className="text-left">{deskripsi}</div>;
      },
    },
    {
      title: "Pengajuan",
      children: [
        {
          title: (
            <InputField
              id="nominal_pengajuan_search"
              type="text"
              register={register}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              errors={errors}
              style={{ textAlign: "right" }}
              onSearch={(_) => getRequestSaldos(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "nominal_pengajuan",
          align: "center",
          key: "nominal_pengajuan",
          render: (nominal_pengajuan: string) => {
            return (
              <div className="text-right">
                {formatCurrency(nominal_pengajuan)}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal_pengajuan.replace(/,/g, "")) -
        parseFloat(b.nominal_pengajuan.replace(/,/g, "")),
    },
    {
      title: "Status",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Approved", "Submited", "Rejected"]}
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
                className={`text-xs font-semibold inline-flex items-center justify-center px-2 py-1 rounded-full ${
                  status === "Approved"
                    ? "bg-green-100 text-green-600"
                    : status === "Submited"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
                }`}
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
      key: "x",
      render: (_: any, record: any) => {
        if (record.status === "Submited" && canUpdate) {
          return (
            <PencilSquareIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                getRequestSaldoById(record.id);
              }}
            />
          );
        }
        return (
          <EyeIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              getRequestSaldoById(record.id);
            }}
          />
        );
      },
    },
  ];

  const columnDetail: ColumnsType<any> = [
    {
      title: "Account",
      align: "center",
      dataIndex: "coa_account",
      key: "coa_account",
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
    },
    {
      title: "Debit",
      align: "center",
      dataIndex: "debit",
      key: "debit",
      render: (debit: number) => {
        return (
          <div className="text-right">{formatCurrency(debit.toString())}</div>
        );
      },
    },
    {
      title: "Kredit",
      align: "center",
      dataIndex: "kredit",
      key: "kredit",
      render: (kredit: number) => {
        return (
          <div className="text-right">{formatCurrency(kredit.toString())}</div>
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<IRequestSaldoDetail | null>(null);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [requestSaldo, setRequestSaldo] = useState<IRequestSaldo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleView = (record: IRequestSaldoDetail) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    reset();
  };

  const onSubmit = async (data: FieldValues, status: string) => {
    setIsLoading(true);

    if (!selectedRecord) return;

    const payload = {
      ...data,
      id: selectedRecord?.id,
      deskripsi: data?.deskripsi,
      nominal_pengajuan: selectedRecord.nominal_pengajuan,
      status: status,
    };

    editRequestSaldoStatus(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getRequestSaldos(pagination.current, pagination.pageSize);
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah status!");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
      });
  };

  const getRequestSaldos = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);
    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      nomor_journal: getValues("nomor_journal_search"),
      tanggal_journal: getValues("tanggal_journal_search"),
      nominal_pengajuan: getValues("nominal_pengajuan_search").replace(
        /,/g,
        ""
      ),
      status_filter: searchStatus,
    };
    const promise = getRequestSaldo(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setRequestSaldo(res.data.data.data);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: res.data.data.total,
          });
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  const getRequestSaldoById = (id: string): void => {
    setIsLoadingModal(true);
    const promise = getRequestSaldoServicebyId(id);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          handleView(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  useEffect(() => {
    getRequestSaldos(1, pagination.pageSize);
  }, [searchStatus]);

  return (
    <>
      <div className="mb-8">
        <MyBreadcrumb pageName="Approval Saldo Petty Cash" />
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
        <TableApp
          columns={columns}
          dataSource={requestSaldo}
          pagination={pagination}
          onPaginationChange={(page: number, size: number) =>
            getRequestSaldos(page, size)
          }
        />
        <Spin spinning={isLoadingModal} fullscreen />
        {isModalOpen && selectedRecord && (
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold">Approval Saldo Petty Cash</h2>
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      selectedRecord.status === "Approved"
                        ? "border border-green-600 text-green-600"
                        : selectedRecord.status === "Submited"
                        ? "border border-yellow-600 text-yellow-600"
                        : "border border-red-600 text-red-600"
                    }`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>
                <div className="flex gap-4 justify-end px-10">
                  {selectedRecord.status == "Submited" && canUpdate && (
                    <>
                      <PrimaryButton
                        onClick={handleSubmit((data) => {
                          onSubmit(data, ApprovalSaldoEnum.Rejected);
                        })}
                        className="bg-red-600"
                        isLoading={isLoading}
                      >
                        Reject
                      </PrimaryButton>
                      <PrimaryButton
                        onClick={handleSubmit((data) => {
                          onSubmit(data, ApprovalSaldoEnum.Approved);
                        })}
                        isLoading={isLoading}
                      >
                        Approve
                      </PrimaryButton>
                    </>
                  )}
                </div>
              </>
            }
            open={isModalOpen}
            // onOk={handleSubmit(onSubmit)}
            onCancel={handleModalClose}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            width={1200}
            styles={{
              body: {
                maxHeight: "70vh",
                overflowY: "auto",
                minHeight: "30vh",
              },
            }}
          >
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-10">
                <InputField
                  label="Nomor Jurnal"
                  id="nomor_journal"
                  defaultValue={selectedRecord.nomor_journal}
                  disabled
                  type="text"
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Petty Cash"
                  id="nama_petty_cash"
                  type="text"
                  defaultValue={
                    selectedRecord.petty_cash_setting.nama_petty_cash
                  }
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Deskripsi"
                  id="deskripsi"
                  defaultValue={selectedRecord.deskripsi}
                  disabled
                  type="text"
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Deskripsi harus diisi!",
                  }}
                />
                <InputField
                  label="Submitted date"
                  id="submitted_date"
                  defaultValue={formatDate(selectedRecord.tanggal_journal)}
                  disabled
                  type="text"
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Deskripsi harus diisi!",
                  }}
                />
                {selectedRecord.status === "Approved" && (
                  <InputField
                    label="Approved date"
                    id="approved_date"
                    defaultValue={formatDate(
                      selectedRecord.tanggal_approve ?? Date.now().toString()
                    )}
                    disabled
                    type="text"
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required: "Deskripsi harus diisi!",
                    }}
                  />
                )}
              </div>
              <div className="rounded-sm border border-stroke bg-white shadow-default p-5 ">
                <TableApp
                  columns={columnDetail}
                  dataSource={selectedRecord.transactions}
                  pagination={false}
                  summary={() => {
                    return (
                      <>
                        <Table.Summary.Row>
                          <Table.Summary.Cell
                            index={0}
                            colSpan={1}
                          ></Table.Summary.Cell>
                          <Table.Summary.Cell index={2}>
                            <strong className="flex justify-end mr-10">
                              Total :
                            </strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            <div className="text-right">
                              {formatCurrency(
                                selectedRecord.transactions.reduce(
                                  (acc, item) =>
                                    acc + parseFloat(item.debit ?? "0") || 0,
                                  0
                                )
                              )}
                            </div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>
                            <div className="text-right">
                              {formatCurrency(
                                selectedRecord.transactions.reduce(
                                  (acc, item) =>
                                    acc + parseFloat(item.kredit ?? "0") || 0,
                                  0
                                )
                              )}
                            </div>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                        <Table.Summary.Row>
                          <Table.Summary.Cell
                            index={0}
                            colSpan={1}
                          ></Table.Summary.Cell>
                          <Table.Summary.Cell index={3}>
                            <strong className="flex justify-end mr-10">
                              Out of Balance :
                            </strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4}>
                            <div className="text-right">
                              {formatCurrency(
                                selectedRecord.transactions.reduce(
                                  (acc, item) =>
                                    acc +
                                      parseFloat(
                                        item.debit?.toString() ?? "0"
                                      ) || 0,
                                  0
                                ) -
                                  selectedRecord.transactions.reduce(
                                    (acc, item) =>
                                      acc +
                                        parseFloat(
                                          item.kredit?.toString() ?? "0"
                                        ) || 0,
                                    0
                                  )
                              )}
                            </div>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
                />
              </div>

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
                        .map((audit: any, index: number) => (
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
                                    .replace(/^./, (str: string) =>
                                      str.toUpperCase()
                                    )}
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
                                      let displayValue = (value as string)
                                        .toString()
                                        .toLowerCase()
                                        .replace(/_/g, " ")
                                        .replace(/(^\w|\s\w)/g, (m) =>
                                          m.toUpperCase()
                                        );

                                      let displayKey = key
                                        .replace(/_/g, " ")
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
                                      if (key === "is_active") {
                                        displayValue =
                                          value == "1" ? "Active" : "Inactive";
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
            </>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ApprovalSaldo;
