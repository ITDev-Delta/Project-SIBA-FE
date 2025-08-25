import { EyeIcon } from "@heroicons/react/24/outline";
import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getServicePettyCashById,
  getServicePettyCashByStatus,
} from "../../../../api/Accounting/services/pettyCashService";
import { getSettingPettyCash } from "../../../../api/Accounting/services/settingPettiCashService";
import type {
  IPettyCash,
  IPettyCashDeetail,
} from "../../../../api/Accounting/types/pettyCash.interface";
import type { ISettingPettyCash } from "../../../../api/Accounting/types/settingPettyCash.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../components/Tables/TableApp";
import { usePettyCashPermission } from "../../../../hooks/usePettyCash";
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

const PettyCashRealize: React.FC = () => {
  const {
    register,
    getValues,
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
                  getPettyCashByStatus(
                    1,
                    pagination.pageSize,
                    selectedPettyCash?.id.toString()
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
                  getPettyCashByStatus(
                    1,
                    pagination.pageSize,
                    selectedPettyCash?.id.toString()
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
      title: "Tanggal Realisasi",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_realize_search", date);
                if (selectedPettyCash)
                  getPettyCashByStatus(
                    1,
                    pagination.pageSize,
                    selectedPettyCash?.id.toString()
                  );
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
      sorter: (a, b) =>
        (a.tanggal_realize ?? "")
          .toString()
          .localeCompare((b.tanggal_realize ?? "").toString()),
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
                if (selectedPettyCash)
                  getPettyCashByStatus(
                    1,
                    pagination.pageSize,
                    selectedPettyCash?.id.toString()
                  );
              }}
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "pemohon",
          key: "pemohon",
        },
      ],
      align: "center",
      sorter: (a, b) => a.pemohon.localeCompare(b.pemohon),
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
                  getPettyCashByStatus(
                    1,
                    pagination.pageSize,
                    selectedPettyCash?.id.toString()
                  );
              }}
              validationSchema={{}}
            />
          ),
          dataIndex: "nominal_pengajuan",
          align: "center",
          key: "nominal_pengajuan",
          render: (nominal_pengajuan: string) => (
            <div className="text-right">
              {nominal_pengajuan == null || nominal_pengajuan === "0"
                ? "-"
                : formatCurrency(nominal_pengajuan)}
            </div>
          ),
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal_pengajuan?.replace(/,/g, "") || "0") -
        parseFloat(b.nominal_pengajuan?.replace(/,/g, "") || "0"),
    },
    {
      title: "Realisasi",
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
                if (selectedPettyCash)
                  getPettyCashByStatus(
                    1,
                    pagination.pageSize,
                    selectedPettyCash?.id.toString()
                  );
              }}
              validationSchema={{}}
            />
          ),
          dataIndex: "nominal_realisasi",
          align: "center",
          key: "nominal_realisasi",
          render: (nominal_realisasi: string) => (
            <div className="text-right">
              {formatCurrency(nominal_realisasi)}
            </div>
          ),
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal_realisasi?.replace(/,/g, "") || "0") -
        parseFloat(b.nominal_realisasi?.replace(/,/g, "") || "0"),
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
                    : status === "Realized"
                    ? "bg-green-100 text-green-600"
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
              getPettyCashById(record.id);
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
        return <div className="text-right">{debit}</div>;
      },
    },
    {
      title: "Kredit",
      align: "center",
      dataIndex: "kredit",
      key: "kredit",
      render: (kredit: string) => {
        return <div className="text-right">{formatCurrency(kredit)}</div>;
      },
    },
  ];

  const columnRealisasi: ColumnsType<any> = [
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
        return <div className="text-right">{debit}</div>;
      },
    },
    {
      title: "Kredit",
      align: "center",
      dataIndex: "kredit",
      key: "kredit",
      render: () => (
        <div className="text-right">
          {formatCurrency(selectedRecord?.nominal_realisasi ?? "0")}
        </div>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<IPettyCashDeetail | null>(null);

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const [settingPettyCash, setsettingPettyCash] = useState<ISettingPettyCash[]>(
    []
  );
  const [pettyCash, setPettyCash] = useState<IPettyCash[]>([]);
  const [selectedPettyCash, setSelectedPettyCash] =
    useState<ISettingPettyCash>();

  const { filterPettyCash } = usePettyCashPermission();

  const permittedPettyCash = filterPettyCash(settingPettyCash);

  const pengejuanTransaksi = [
    {
      id: 1,
      coa_account: selectedPettyCash?.coa_account,
      deskripsi: selectedRecord?.deskripsi ?? "-",
      debit: `${formatCurrency(selectedRecord?.nominal_pengajuan)}`,
      kredit: "0",
    },
  ];

  const realisasiTransaksi = [
    {
      id: 1,
      coa_account: selectedPettyCash?.coa_account,
      deskripsi: selectedRecord?.deskripsi ?? "-",
      debit: "0",
      kredit: `${formatCurrency(
        selectedRecord?.nominal_realisasi?.toString() ?? ""
      )}`,
    },
  ];

  const handleView = (record: any) => {
    console.log(record);

    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    reset();
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
        console.log("err", err, isLoadingModal);
      });
  };

  const getPettyCashByStatus = (
    page: number,
    pageSize: number,
    id: string
  ): void => {
    setIsLoadingModal(true);

    const nominalPengajuan = getValues("nominal_realisasi_search") ?? "";
    const nominalRealisasi = getValues("nominal_realisasi_search") ?? "";
    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      tanggal_journal: getValues("tanggal_journal_search"),
      tanggal_realize: getValues("tanggal_realize_search"),
      nomor_journal: getValues("nomor_journal_search"),
      pemohon: getValues("pemohon_search"),
      nominal_pengajuan: nominalPengajuan.replace(/,/g, ""),
      nominal_realisasi: nominalRealisasi.replace(/,/g, ""),
      status_filter: searchStatus ?? "",
      petty_cash_setting_id: id,
      is_ralize_petty_cash: true,
    };
    const promise = getServicePettyCashByStatus(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setPettyCash(
            // res.data.data.data.filter((item: any) => item.status !== "Pending")
            res.data.data.data
          );
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

  useEffect(() => {
    getSettingPettyCashs();
  }, []);

  useEffect(() => {
    if (selectedPettyCash) {
      getPettyCashByStatus(
        1,
        pagination.pageSize,
        selectedPettyCash.id.toString()
      );
    }
  }, [searchStatus]);

  return (
    <>
      <div className="mb-8">
        <MyBreadcrumb pageName="Realize Petty Cash" />
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
        <SelectGroupField
          label={"Petty Cash"}
          options={permittedPettyCash}
          value={selectedPettyCash}
          onChange={(value: any) => {
            setSelectedPettyCash(value);
            if (value) {
              getPettyCashByStatus(1, pagination.pageSize, value.id.toString());
            }
          }}
        />
        {selectedPettyCash && (
          <div className="mt-10">
            <TableApp
              columns={columns}
              dataSource={pettyCash}
              pagination={pagination}
              onPaginationChange={(page: number, size: number) =>
                getPettyCashByStatus(
                  page,
                  size,
                  selectedPettyCash.id.toString()
                )
              }
            />
          </div>
        )}
        {isModalOpen && selectedRecord && (
          <Modal
            key={selectedRecord?.id}
            title={`Realized Petty Cash - ${selectedRecord.nomor_journal}`}
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
                  defaultValue={
                    selectedRecord.petty_cash_setting.nama_petty_cash
                  }
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
                  validationSchema={{}}
                />
                <InputField
                  label="Durasi Jatuh Tempo (Hari)"
                  id="durasiJatuhTempo"
                  defaultValue={calculateDaysDifference(
                    selectedRecord.tanggal_jatuh_tempo
                  )}
                  disabled
                  type="text"
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Set Reminder (Hari)"
                  id="setReminder"
                  defaultValue={getDateDifference(
                    selectedRecord.tanggal_jatuh_tempo,
                    selectedRecord.tanggal_reminder
                  )}
                  disabled
                  type="text"
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
                  validationSchema={{}}
                />
              </div>
              <div className="rounded-sm border border-stroke bg-white shadow-default p-5 ">
                <p className="text-title-s font-semibold text-black mb-5">
                  Detail Pengajuan
                </p>
                <TableApp
                  columns={columnDetail}
                  dataSource={pengejuanTransaksi}
                  pagination={false}
                />
                <p className="text-title-s font-semibold text-black my-5">
                  Detail Realisasi
                </p>
                <TableApp
                  columns={columnRealisasi}
                  dataSource={realisasiTransaksi}
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
        <Spin spinning={isLoadingModal} fullscreen />
      </div>
    </>
  );
};

export default PettyCashRealize;
