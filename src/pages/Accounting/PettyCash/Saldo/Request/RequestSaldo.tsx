import { EyeIcon } from "@heroicons/react/24/outline";
import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  addRequestSaldo,
  getRequestSaldoServicebyId,
  getRequestSaldoServiceByPettyCash,
} from "../../../../../api/Accounting/services/requestSaldoService";
import { getSettingPettyCash } from "../../../../../api/Accounting/services/settingPettiCashService";
import type { IRequestSaldoDetail } from "../../../../../api/Accounting/types/requestSaldo.interface";
import type { ISettingPettyCash } from "../../../../../api/Accounting/types/settingPettyCash.interface";
import MyBreadcrumb from "../../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../../components/Button/PrimaryButton";
import InputAreaField from "../../../../../components/Forms/InputAreaField";
import InputField from "../../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../../components/Tables/TableApp";
import { usePermission } from "../../../../../hooks/usePermission";
import { usePettyCashPermission } from "../../../../../hooks/usePettyCash";
import { formatCurrency } from "../../../../../utils/format_currency";
import { formatDate, getTodayDate } from "../../../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../../utils/InputCurrencyUtils";

const RequestSaldo: React.FC = () => {
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
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

  const canCreate = hasPermission("request-saldo-create");

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
              onSearch={(_) => {
                if (selectedPettyCash)
                  getRequestSaldoByPettyCash(
                    selectedPettyCash?.id.toString(),
                    1,
                    pagination.pageSize
                  );
              }}
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
                if (selectedPettyCash)
                  getRequestSaldoByPettyCash(
                    selectedPettyCash?.id.toString(),
                    1,
                    pagination.pageSize
                  );
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
              onSearch={(_) => {
                if (selectedPettyCash)
                  getRequestSaldoByPettyCash(
                    selectedPettyCash?.id.toString(),
                    1,
                    pagination.pageSize
                  );
              }}
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
        return (
          <EyeIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              getRequestSaldoById(record.id.toString());
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

  const columnRequest: ColumnsType<any> = [
    {
      title: "Account",
      align: "center",
      render: () => {
        return <span>{selectedPettyCash?.coa_account}</span>;
      },
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
      render: () => {
        return (
          <span>{`Request saldo ${
            selectedPettyCash?.nama_petty_cash
          } Tgl ${getTodayDate()}`}</span>
        );
      },
    },
    {
      title: "Debit",
      align: "center",
      render: () => {
        const nominal_pengajuan: any =
          Number(selectedPettyCash?.saldo_maksimum || 0) -
          (selectedPettyCash?.saldo_akhir || 0) -
          Number(selectedPettyCash?.saldo_ongoing || 0);
        return (
          <div className="text-right">
            Rp {formatCurrency(nominal_pengajuan.toString())}
          </div>
        );
      },
    },
    {
      title: "Kredit",
      align: "center",
      render: () => {
        return <div className="text-right">Rp {formatCurrency("0")}</div>;
      },
    },
  ];

  const [settingPettyCash, setsettingPettyCash] = useState<ISettingPettyCash[]>(
    []
  );
  const [requestSaldo, setRequestSaldo] = useState<ISettingPettyCash[]>([]);
  const [selectedPettyCash, setSelectedPettyCash] =
    useState<ISettingPettyCash>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenRequest, setIsModalOpenRequest] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] =
    useState<IRequestSaldoDetail | null>(null);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { filterPettyCash } = usePettyCashPermission();

  const permittedPettyCash = filterPettyCash(settingPettyCash);

  const handleEdit = (record: IRequestSaldoDetail) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    reset();
  };

  const handleViewRequest = () => {
    setIsModalOpenRequest(true);
  };

  const handleModalCloseRequest = () => {
    setIsModalOpenRequest(false);
    reset();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (_) => {
    handleModalClose();
  };

  const onSubmitRequest: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (!selectedPettyCash) return;

    const today = new Date().toISOString().split("T")[0];

    if (
      Number(selectedPettyCash.saldo_akhir) >
      Number(selectedPettyCash.saldo_maksimum)
    ) {
      toast.error("Saldo akhir tidak boleh melebihi saldo maksimum!");
      setIsLoading(false);
      return;
    }

    const nominal_pengajuan: any =
      Number(selectedPettyCash?.saldo_maksimum || 0) -
      (selectedPettyCash?.saldo_akhir || 0) -
      Number(selectedPettyCash?.saldo_ongoing || 0);

    if (nominal_pengajuan < 0) {
      toast.error("Nominal pengajuan/debit tidak boleh kurang dari 0!");
      setIsLoading(false);
      return;
    }

    if (nominal_pengajuan === 0) {
      toast.error("Nominal pengajuan/debit tidak boleh 0!");
      setIsLoading(false);
      return;
    }

    const payload = {
      petty_cash_setting_id: selectedPettyCash?.id,
      tanggal_journal: today,
      deskripsi: data.deskripsi,
      nominal_pengajuan: nominal_pengajuan,
    };

    console.log(payload);

    addRequestSaldo(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getRequestSaldoByPettyCash(
            selectedPettyCash.id.toString(),
            pagination.current,
            pagination.pageSize
          );
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalCloseRequest();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
      });
  };

  const getSettingPettyCashs = (): void => {
    setIsLoadingModal(true);
    const promise = getSettingPettyCash({ status: "Active" });

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setsettingPettyCash(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  const getRequestSaldoByPettyCash = (
    id: string,
    page: number,
    pageSize: number
  ): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      petty_cash_setting_id: id,
      nomor_journal: getValues("nomor_journal_search"),
      tanggal_journal: getValues("tanggal_journal_search"),
      nominal_pengajuan: (getValues("nominal_pengajuan_search") || "").replace(
        /,/g,
        ""
      ),
      status_filter: searchStatus,
    };

    const promise = getRequestSaldoServiceByPettyCash(params);

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
          handleEdit(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const defaultTransaksi = [
    {
      id: 1,
      coa_account: selectedPettyCash?.coa_account,
      deskripsi: "",
      debit: null,
      kredit: null,
    },
  ];

  useEffect(() => {
    getSettingPettyCashs();
    if (selectedPettyCash) {
      getRequestSaldoByPettyCash(
        selectedPettyCash.id.toString(),
        1,
        pagination.pageSize
      );
    }
  }, [searchStatus]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <MyBreadcrumb pageName="Request Saldo Petty Cash" />
        {canCreate && (
          <PrimaryButton
            disabled={!selectedPettyCash}
            onClick={() => {
              handleViewRequest();
            }}
          >
            Tambah Request Saldo
          </PrimaryButton>
        )}
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
        <SelectGroupField
          label={"Petty Cash"}
          options={permittedPettyCash}
          value={selectedPettyCash}
          onChange={(value: any) => {
            setSelectedPettyCash(value);
            getRequestSaldoByPettyCash(value.id, 1, pagination.pageSize);
          }}
        />
        {selectedPettyCash && requestSaldo && (
          <>
            <ul className="list-none my-4">
              <li className="flex mt-5">
                <span className="text-body-s text-gray-500 w-35">
                  Saldo Transaksi
                </span>
                <span className="text-body-s text-black">
                  :{" "}
                  {formatCurrency(selectedPettyCash.saldo_akhir.toString()) +
                    " / " +
                    formatCurrency(selectedPettyCash.saldo_maksimum.toString())}
                </span>
              </li>
              <li className="flex mt-5">
                <span className="text-body-s text-gray-500 w-35">
                  Ongoing Kasbon
                </span>
                <span className="text-body-s text-black">
                  : {formatCurrency(selectedPettyCash.saldo_ongoing.toString())}
                </span>
              </li>
              <li className="flex mt-5">
                <span className="text-body-s text-gray-500 w-35">Limit</span>
                <span className="text-body-s text-black">
                  :{" "}
                  {formatCurrency(
                    selectedPettyCash.maksimum_transaksi.toString()
                  )}
                </span>
              </li>
            </ul>
            <TableApp
              columns={columns}
              dataSource={requestSaldo}
              pagination={pagination}
              onPaginationChange={(page: number, size: number) => {
                getRequestSaldoByPettyCash("", page, size);
              }}
            />
          </>
        )}
        {isModalOpenRequest && (
          <Modal
            key={selectedPettyCash?.id}
            title={
              <>
                <>Request Saldo Petty Cash</>
                <div className="flex gap-4 justify-end px-5">
                  <PrimaryButton onClick={handleModalCloseRequest} outlined>
                    Close
                  </PrimaryButton>
                  <PrimaryButton
                    type="submit"
                    onClick={handleSubmit(onSubmitRequest)}
                    isLoading={isLoading}
                  >
                    Submit
                  </PrimaryButton>
                </div>
              </>
            }
            open={isModalOpenRequest}
            onCancel={handleModalCloseRequest}
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
            <form
              onSubmit={handleSubmit(onSubmitRequest)}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-10">
                <InputField
                  label="Nomor Jurnal"
                  id="nomorJurnal"
                  // defaultValue={selectedPettyCash?.coa_account}
                  disabled
                  type="text"
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Petty Cash"
                  id="pettyCash"
                  type="text"
                  defaultValue={selectedPettyCash?.nama_petty_cash}
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputAreaField
                  label="Deskripsi"
                  id="deskripsi"
                  defaultValue={`Request saldo ${
                    selectedPettyCash?.nama_petty_cash
                  } Tgl ${getTodayDate()}`}
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Deskripsi harus diisi!",
                  }}
                />
              </div>
              <TableApp
                columns={columnRequest}
                dataSource={defaultTransaksi}
                pagination={false}
              />
            </form>
          </Modal>
        )}

        {isModalOpen && selectedRecord && (
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold">Request Saldo Petty Cash</h2>
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
              </>
            }
            open={isModalOpen}
            onOk={handleSubmit(onSubmit)}
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
                  id="nomorJurnal"
                  defaultValue={selectedRecord.nomor_journal}
                  disabled
                  type="text"
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Petty Cash"
                  id="pettyCash"
                  type="text"
                  defaultValue="Petty Cash HRD"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Submitted Date"
                  id="tanggal_journal"
                  type="text"
                  defaultValue={formatDate(selectedRecord.tanggal_journal)}
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Tanggal Approve"
                  id="tanggal_approve"
                  type="text"
                  defaultValue={formatDate(
                    selectedRecord.tanggal_approve || ""
                  )}
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Deskripsi"
                  id="deskripsi"
                  defaultValue={
                    selectedRecord.petty_cash_setting.nama_petty_cash
                  }
                  disabled
                  type="text"
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
              </div>
              <div className="rounded-sm border border-stroke bg-white shadow-default p-5 ">
                <TableApp
                  columns={columnDetail}
                  dataSource={selectedRecord.transactions}
                  pagination={false}
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
      <Spin spinning={isLoadingModal} fullscreen />
    </>
  );
};

export default RequestSaldo;
