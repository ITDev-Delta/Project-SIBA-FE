import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getCoaTransaction } from "../../../../api/Accounting/services/coaSevice";
import {
  getServicePettyCashById,
  getServicePettyCashByStatus,
  postPettyCash,
} from "../../../../api/Accounting/services/pettyCashService";
import type { ICoa } from "../../../../api/Accounting/types/coa.interface";
import type {
  IPettyCash,
  IPettyCashDeetail,
} from "../../../../api/Accounting/types/pettyCash.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../components/Tables/TableApp";
import { PettyCashEnum } from "../../../../constant/petty_cash_enum";
import { usePermission } from "../../../../hooks/usePermission";
import { formatCurrency } from "../../../../utils/format_currency";
import {
  calculateDaysDifference,
  formatDate,
  getDateDifference,
} from "../../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";

const PettyCashPosting: React.FC = () => {
  const {
    register,
    getValues,
    setValue,
    reset,
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
  const canUpdate = hasPermission("petty-cash-posting-update");

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
                if (searchStatus) {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, searchStatus);
                } else {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, "Realized");
                  getPettyCashByStatus(1, pagination.pageSize, "Posted");
                }
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
      title: "Tanggal Realisasi",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_realize_search", date);
                if (searchStatus) {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, searchStatus);
                } else {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, "Realized");
                  getPettyCashByStatus(1, pagination.pageSize, "Posted");
                }
              }}
            />
          ),
          dataIndex: "tanggal_realize",
          align: "center",
          key: "tanggal_realize",
          render: (tanggal_realize: string) => {
            return (
              <div className="text-right">{formatDate(tanggal_realize)}</div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.tanggal_realize.localeCompare(b.tanggal_realize),
    },
    {
      title: "Tanggal Posted",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_posting_search", date);
                if (searchStatus) {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, searchStatus);
                } else {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, "Realized");
                  getPettyCashByStatus(1, pagination.pageSize, "Posted");
                }
              }}
            />
          ),
          dataIndex: "tanggal_posting",
          key: "tanggal_posting",
          render: (tanggal_posting: string) => {
            return (
              <div className="text-right">{formatDate(tanggal_posting)}</div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        (a.tanggal_posting ?? "")
          .toString()
          .localeCompare((b.tanggal_posting ?? "").toString()),
    },
    {
      title: "Deskripsi",
      align: "center",
      dataIndex: "deskripsi",
      key: "deskripsi",
      render: (deskripsi: string) => {
        return <div className="text-left">{deskripsi ?? "-"}</div>;
      },
    },
    {
      title: "Pemohon",
      children: [
        {
          title: (
            <InputField
              id="pemohon_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => {
                if (searchStatus) {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, searchStatus);
                } else {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, "Realized");
                  getPettyCashByStatus(1, pagination.pageSize, "Posted");
                }
              }}
              validationSchema={{}}
            />
          ),
          dataIndex: "pemohon",
          key: "pemohon",
          align: "center",
        },
      ],
      align: "center",
      sorter: (a, b) => a.pemohon.localeCompare(b.pemohon),
    },
    {
      title: "Nominal",
      children: [
        {
          title: (
            <InputField
              id="nominal_realisasi_search"
              type="text"
              register={register}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              errors={errors}
              style={{ textAlign: "right" }}
              onSearch={(_) => {
                if (searchStatus) {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, searchStatus);
                } else {
                  setPettyCash([]);
                  getPettyCashByStatus(1, pagination.pageSize, "Realized");
                  getPettyCashByStatus(1, pagination.pageSize, "Posted");
                }
              }}
              validationSchema={{}}
            />
          ),
          dataIndex: "nominal_realisasi",
          align: "center",
          key: "nominal_realisasi",
          render: (nominal_realisasi: string) => {
            return (
              <div className="text-right">
                {formatCurrency(nominal_realisasi)}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal_realisasi.replace(/,/g, "")) -
        parseFloat(b.nominal_realisasi.replace(/,/g, "")),
    },
    {
      title: "Status",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Posted", "Realized"]}
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
                  status === "Posted"
                    ? "bg-primary text-white"
                    : "bg-green-600 text-white"
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
      render: (record: any) => {
        if (record.status === PettyCashEnum.Posted || !canUpdate) {
          return (
            <EyeIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                getPettyCashById(record.id.toString());
              }}
            />
          );
        }
        return (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              getPettyCashById(record.id.toString());
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
      width: "30%",
      render: (_: any, value: any, index: number) => {
        if (index === 0) {
          return <div className="text-left">{value.coa_account}</div>;
        }
        return (
          // <div className="flex items-center justify-start">
          <SelectGroupField
            options={coa}
            value={selectedCoa}
            disabled={selectedRecord?.status === "Posted" || !canUpdate}
            style={{ textAlign: "left" }}
            onChange={(value) => {
              setSelectedCoa(value.id);
            }}
          />
          // </div>
        );
      },
    },
    {
      title: "Deskripsi",
      align: "center",
      dataIndex: "deskripsi",
      key: "deskripsi",
      render: (_: any, value: any, index: number) => {
        if (index === 0) {
          return <div className="text-left">{value.deskripsi}</div>;
        }
        return (
          <InputField
            id="deksripsi"
            register={register}
            disabled={selectedRecord?.status === "Posted" || !canUpdate}
            defaultValue={
              selectedRecord?.status === "Posted"
                ? selectedRecord?.transactions[index].deskripsi
                : ""
            }
            onChange={(event) => {
              setDeskripsi(event.target.value);
            }}
            errors={errors}
            validationSchema={{}}
          />
        );
      },
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

  const [pettyCash, setPettyCash] = useState<IPettyCash[]>([]);
  const [selectedRecord, setSelectedRecord] =
    useState<IPettyCashDeetail | null>(null);
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [selectedCoa, setSelectedCoa] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hasFetched = useRef(false);

  const pengejuanTransaksi = [
    {
      id: 1,
      coa_account: selectedRecord?.petty_cash_setting.coa_account,
      deskripsi: selectedRecord?.deskripsi ?? "-",
      debit: "0.00",
      kredit: `${selectedRecord?.nominal_realisasi?.toLocaleString()}`,
    },
  ];

  const handleView = (record: IPettyCashDeetail) => {
    setSelectedRecord(record);
    if (record.status === "Posted") {
      setSelectedCoa(record.transactions[1].coa_account);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedCoa("");
    setDeskripsi("");
    reset();
  };

  const getPettyCashByStatus = (
    page: number,
    pageSize: number,
    status: string
  ): void => {
    setIsLoadingModal(true);
    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      tanggal_realize: getValues("tanggal_realize_search"),
      tanggal_posting: getValues("tanggal_posting_search"),
      nomor_journal: getValues("nomor_journal_search"),
      pemohon: getValues("pemohon_search"),
      nominal_realisasi: getValues("nominal_realisasi_search").replace(
        /,/g,
        ""
      ),
      status_filter: searchStatus ?? "",
      status: status,
    };
    const promise = getServicePettyCashByStatus(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setPettyCash((prevData) => [...prevData, ...res.data.data.data]);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: res.data.data.total,
          });
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoadingModal);
      });
  };

  const getPettyCashById = (id: string): void => {
    setIsLoadingModal(true);
    const promise = getServicePettyCashById(id);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          handleView(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getCoa = (): void => {
    setIsLoadingModal(true);
    const promise = getCoaTransaction();

    promise
      .then((res) => {
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
        console.log("err", err, isLoading);
      });
  };

  const onSubmit = async () => {
    setIsLoading(true);

    if (selectedCoa === "") {
      setIsLoading(false);
      toast.error("COA harus diisi!");
      return;
    }

    if (deskripsi === "") {
      setIsLoading(false);
      toast.error("Deskripsi harus diisi!");
      return;
    }

    if (
      Number(selectedCoa) === Number(selectedRecord?.petty_cash_setting.coa_id)
    ) {
      setIsLoading(false);
      toast.error("Account tidak boleh sama!");
      return;
    }

    const payload = {
      transactions: [
        //coa asal
        {
          id: selectedRecord?.transactions[0].id.toString(),
          coa_id: selectedRecord?.petty_cash_setting.coa_id,
          deskripsi: selectedRecord?.deskripsi,
        },
        // coa lawan
        {
          id: selectedRecord?.transactions[1].id.toString(),
          coa_id: selectedCoa.toString(),
          deskripsi: deskripsi,
        },
      ],
    };

    console.log(payload);

    if (selectedRecord?.id !== undefined) {
      postPettyCash(selectedRecord.id, payload)
        .then((res) => {
          setIsLoading(false);
          if (res.status === 200 || res.status === 201) {
            setPettyCash([]);
            getPettyCashByStatus(
              pagination.current,
              pagination.pageSize,
              "Realized"
            );
            getPettyCashByStatus(
              pagination.current,
              pagination.pageSize,
              "Posted"
            );
            setIsLoading(false);
            toast.success(res.data.message);
            handleModalClose();
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("err", error);
        });
    } else {
      toast.error("Invalid record ID");
    }
  };

  useEffect(() => {
    if (hasFetched.current) return; // Cegah pemanggilan ulang
    hasFetched.current = true;

    getCoa();
    getPettyCashByStatus(1, pagination.pageSize, "Realized");
    getPettyCashByStatus(1, pagination.pageSize, "Posted");
  }, []);

  useEffect(() => {
    if (searchStatus) {
      setPettyCash([]);
      getPettyCashByStatus(1, pagination.pageSize, searchStatus);
    }
  }, [searchStatus]);

  return (
    <>
      <div className="mb-8">
        <MyBreadcrumb pageName="Posting Petty Cash" />
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
        <div className="mt-5">
          <TableApp
            columns={columns}
            dataSource={pettyCash}
            pagination={pagination}
            onPaginationChange={(page: number, size: number) => {
              if (searchStatus) {
                setPettyCash([]);
                getPettyCashByStatus(page, size, searchStatus);
              } else {
                setPettyCash([]);
                getPettyCashByStatus(page, size, "Realized");
                getPettyCashByStatus(page, size, "Posted");
              }
            }}
          />
        </div>
      </div>
      {isModalOpen && selectedRecord && (
        <Modal
          key={selectedRecord?.id}
          title={
            <>
              <div className="flex items-center gap-3">
                <h2 className="font-semibold">Posting Petty Cash</h2>
                <span
                  className={`px-2 py-1 rounded-md text-xs ${
                    selectedRecord.status === "Posted"
                      ? "border border-primary text-primary"
                      : "border border-green-600 text-green-600"
                  }`}
                >
                  {selectedRecord.status}
                </span>
              </div>
              {canUpdate && (
                <div className="flex gap-4 justify-end px-5">
                  {selectedRecord.status != "Posted" && (
                    <PrimaryButton
                      onClick={handleSubmit(onSubmit)}
                      isLoading={isLoading}
                    >
                      Posting
                    </PrimaryButton>
                  )}
                </div>
              )}
            </>
          }
          open={isModalOpen}
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
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
                defaultValue={selectedRecord.petty_cash_setting.nama_petty_cash}
                disabled
                register={register}
                errors={errors}
                validationSchema={{}}
              />
              <InputField
                label="Pemohon"
                id="pemohon"
                defaultValue={selectedRecord.pemohon}
                disabled
                type="text"
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Pemohon harus diisi!",
                }}
              />
              <InputField
                label="Durasi Jatuh Tempo (Hari)"
                id="durasiJatuhTempo"
                defaultValue={calculateDaysDifference(
                  selectedRecord.tanggal_jatuh_tempo
                )}
                disabled
                type="number"
                register={register}
                errors={errors}
                style={{ textAlign: "right" }}
                validationSchema={{
                  required: "Durasi Jatuh Tempo harus diisi!",
                }}
              />
              <InputField
                label="Set Reminder (Hari)"
                id="setReminder"
                defaultValue={getDateDifference(
                  selectedRecord.tanggal_jatuh_tempo,
                  selectedRecord.tanggal_reminder
                )}
                disabled
                type="number"
                register={register}
                errors={errors}
                style={{ textAlign: "right" }}
                validationSchema={{
                  required: "Set Reminder harus diisi!",
                }}
              />
              <InputField
                label="Deskripsi"
                id="deskripsi"
                defaultValue={selectedRecord.deskripsi}
                disabled
                type="text"
                register={register}
                errors={errors}
                validationSchema={{}}
              />
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default p-5 ">
              <p className="text-title-s font-semibold text-black mb-5">
                Detail Realisasi
              </p>
              <TableApp
                columns={columnDetail}
                dataSource={pengejuanTransaksi}
                pagination={false}
              />
              <p className="text-title-s font-semibold text-black my-5">
                Transaksi
              </p>
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
          </form>
        </Modal>
      )}
      <Spin spinning={isLoadingModal} fullscreen />
    </>
  );
};

export default PettyCashPosting;
