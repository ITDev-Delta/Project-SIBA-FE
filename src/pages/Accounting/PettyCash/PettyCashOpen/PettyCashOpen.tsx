import { EyeIcon } from "@heroicons/react/24/outline";
import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  addServicePetttyCash,
  editPettyCash,
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
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputAreaField from "../../../../components/Forms/InputAreaField";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../components/Tables/TableApp";
import { PettyCashEnum } from "../../../../constant/petty_cash_enum";
import { usePermission } from "../../../../hooks/usePermission";
import { usePettyCashPermission } from "../../../../hooks/usePettyCash";
import { formatCurrency } from "../../../../utils/format_currency";
import {
  calculateDaysDifference,
  dateDifference,
  formatDate,
  getDateDifference,
} from "../../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";

const PettyCashOpen: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("petty-cash-open-create");
  const canUpdate = hasPermission("petty-cash-open-update");

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
      sorter: (a, b) =>
        (a.tanggal_journal ?? "")
          .toString()
          .localeCompare((b.tanggal_journal ?? "").toString()),
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
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
      title: "Usia Kasbon",
      children: [
        {
          title: (
            <InputField
              id="usia_kasbon_search"
              type="number"
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
          dataIndex: "tanggal_journal",
          align: "center",
          key: "tanggal_journal",
          render: (usia_kasbon: string) => {
            return <span>{dateDifference(usia_kasbon).toString()} Hari</span>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        dateDifference(a.tanggal_journal)
          .toString()
          .localeCompare(dateDifference(b.tanggal_journal).toString()),
    },
    {
      title: "Status",
      dataIndex: "tanggal_journal",
      key: "tanggal_journal",
      render: (status: string, record: any) => {
        const daysDifference = dateDifference(status);
        const reminderDays = calculateDaysDifference(
          record.tanggal_reminder.toString()
        );
        const dueDays = calculateDaysDifference(
          record.tanggal_jatuh_tempo.toString()
        );

        let statusText = "";
        let statusClass = "";

        if (daysDifference < reminderDays) {
          statusText = "On Time";
          statusClass = "bg-green-100 text-green-800";
        } else if (
          daysDifference >= reminderDays &&
          daysDifference <= dueDays
        ) {
          statusText = "Due Soon";
          statusClass = "bg-yellow-100 text-yellow-800";
        } else if (daysDifference > dueDays) {
          statusText = "Overdue";
          statusClass = "bg-red-100 text-red-800";
        }

        return (
          <span
            className={`text-xs font-semibold inline-flex items-center justify-center px-2 py-1 rounded-full ${statusClass}`}
          >
            {statusText}
          </span>
        );
      },
      align: "center",
      sorter: (a, b) =>
        dateDifference(a.tanggal_journal) - dateDifference(b.tanggal_journal),
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

  const columnAddData: ColumnsType<any> = [
    {
      title: "Account",
      align: "center",
      render: () => {
        return (
          <div className="text-left">{selectedPettyCash?.coa_account}</div>
        );
      },
    },
    {
      title: "Deskripsi",
      align: "center",
      dataIndex: "deskripsi",
      key: "deskripsi",
      render: () => {
        return <div className="text-left">{deskripsi}</div>;
      },
    },
    {
      title: "Debit",
      align: "center",
      render: () => {
        return <div className="text-right">0.00</div>;
      },
    },
    {
      title: "Kredit",
      render: () => {
        return (
          <span>
            <InputField
              style={{
                height: 40,
                width: 120,
                textAlign: "right",
                direction: "ltr",
              }}
              id="kredit"
              type="text"
              register={register}
              errors={errors}
              onChange={(e) => {
                handleInputChange(e);
                setNominalPengajuan(e.target.value);
              }}
              validationSchema={{}}
              onKeyDown={handleKeyDown}
            />
          </span>
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
      render: (coa_account: string) => {
        return <div className="text-left">{coa_account}</div>;
      },
    },
    {
      title: "Deskripsi",
      align: "center",
      dataIndex: "deskripsi",
      key: "deskripsi",
      render: (deskripsi: string) => {
        return <div className="text-left">{deskripsi}</div>;
      },
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
        return <div className="text-right">{kredit}</div>;
      },
    },
  ];

  const columnRealisasi: ColumnsType<any> = [
    {
      title: "Account",
      align: "center",
      dataIndex: "coa_account",
      key: "coa_account",
      render: (coa_account: string) => {
        return <div className="text-left">{coa_account}</div>;
      },
    },
    {
      title: "Deskripsi",
      align: "center",
      dataIndex: "deskripsi",
      key: "deskripsi",
      render: (deskripsi: string) => {
        return <div className="text-left">{deskripsi}</div>;
      },
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
      width: "20%",
      render: () => (
        <InputField
          style={{
            // height: 40,
            // width: 120,
            textAlign: "right",
            direction: "ltr",
          }}
          id="kredit"
          type="text"
          register={register}
          errors={errors}
          disabled={!canUpdate}
          onChange={(e) => {
            setRealisasi(e.target.value);
            handleInputChange(e);
          }}
          onKeyDown={handleKeyDown}
          validationSchema={{}}
        />
      ),
    },
  ];

  const [settingPettyCash, setsettingPettyCash] = useState<ISettingPettyCash[]>(
    []
  );
  const [pettyCash, setPettyCash] = useState<IPettyCash[]>([]);

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedPettyCash, setSelectedPettyCash] =
    useState<ISettingPettyCash>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAddData, setIsModalOpenAddData] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] =
    useState<IPettyCashDeetail | null>(null);
  const [realisasi, setRealisasi] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [nominalPengajuan, setNominalPengajuan] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { filterPettyCash } = usePettyCashPermission();

  const permittedPettyCash = filterPettyCash(settingPettyCash);

  const handleView = (record: IPettyCashDeetail) => {
    console.log(record);

    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    reset();
  };

  const getSettingPettyCashs = (after_update?: boolean): void => {
    setIsLoadingModal(true);

    const params = {
      status: "Active",
    };

    const promise = getSettingPettyCash(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setsettingPettyCash(res.data.data);
          if (after_update) {
            res.data.data.map((item: ISettingPettyCash) => {
              if (item.id === selectedPettyCash?.id) {
                setSelectedPettyCash(item);
              }
            });
          }
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  const getPettyCashByStatus = (
    page: number,
    pageSize: number,
    id: string
  ): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      tanggal_journal: getValues("tanggal_journal_search"),
      nomor_journal: getValues("nomor_journal_search"),
      pemohon: getValues("pemohon_search"),
      nominal_pengajuan: (getValues("nominal_pengajuan_search") ?? "").replace(
        /,/g,
        ""
      ),
      usia_kasbon: getValues("usia_kasbon_search"),
      status: "Pending",
      petty_cash_setting_id: id,
    };

    const promise = getServicePettyCashByStatus(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setPettyCash(res.data.data.data);
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

  const handleViewRequest = () => {
    setIsModalOpenAddData(true);
  };

  const handleModalCloseRequest = () => {
    setIsModalOpenAddData(false);
    setIsSubmitted(false);
    setDeskripsi("");
    reset();
  };

  const onSubmit = async (status: string) => {
    if (status === PettyCashEnum.Realized && realisasi === "") {
      toast.error("Nominal realisasi transaksi harus diisi!");
      return;
    }

    if (
      (Number(realisasi) === 0 || Number(realisasi) < 0) &&
      status === PettyCashEnum.Realized
    ) {
      toast.error("Nominal realisasi transaksi tidak boleh kurang dari 0!");
      return;
    }
    setIsLoading(true);
    const payload = {
      id: selectedRecord?.id,
      deskripsi: selectedRecord?.deskripsi ?? "",
      nominal_realisasi:
        status === PettyCashEnum.Realized ? realisasi.replace(/\,/g, "") : "0",
      status: status,
    };

    console.log(payload);

    editPettyCash(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          if (selectedPettyCash) {
            getSettingPettyCashs(true);
            getPettyCashByStatus(
              pagination.current,
              pagination.pageSize,
              selectedPettyCash.id.toString()
            );
          }
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
      });
  };

  const onSubmitAddData: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (!selectedPettyCash) return;

    if (nominalPengajuan === "") {
      toast.error("Nominal pengajuan transaksi harus diisi!");
      setIsLoading(false);
      return;
    }

    if (Number(data.tanggal_jatuh_tempo) < 1) {
      toast.error("Durasi jatuh tempo harus lebih dari 0 hari!");
      setIsLoading(false);
      return;
    }

    if (Number(data.tanggal_reminder) < 1) {
      toast.error("Set reminder harus lebih dari 0 hari!");
      setIsLoading(false);
      return;
    }

    if (Number(data.tanggal_reminder) > Number(data.tanggal_jatuh_tempo)) {
      toast.error("Set reminder tidak boleh lebih dari durasi jatuh tempo!");
      setIsLoading(false);
      return;
    }

    const dateTargetfromNow = new Date();
    dateTargetfromNow.setDate(
      dateTargetfromNow.getDate() + parseInt(data.tanggal_jatuh_tempo)
    );
    const formattedJatuhTempo = dateTargetfromNow.toISOString().split("T")[0];

    const dateReminderfromNow = new Date();
    dateReminderfromNow.setDate(
      dateReminderfromNow.getDate() +
        (Number(data.tanggal_jatuh_tempo) - Number(data.tanggal_reminder))
    );
    const formattedReminder = dateReminderfromNow.toISOString().split("T")[0];

    // const nominal_pengajuan: any =
    //   Number(selectedPettyCash?.saldo_maksimum || 0) -
    //   (selectedPettyCash?.saldo_akhir || 0) -
    //   Number(selectedPettyCash?.maksimum_transaksi || 0);

    // if (nominal_pengajuan < selectedPettyCash?.maksimum_transaksi) {
    //   toast.error(
    //     "Nominal pengajuan/debit tidak boleh kurang dari limit transaksi!"
    //   );
    //   setIsLoading(false);
    //   return;
    // }
    if (
      Number(nominalPengajuan.replace(/\,/g, "")) >
      Number(selectedPettyCash.maksimum_transaksi)
    ) {
      toast.error(
        "Nominal pengajuan/kredit tidak boleh lebih dari limit transaksi!"
      );
      setIsLoading(false);
      return;
    }

    if (
      Number(nominalPengajuan.replace(/\,/g, "")) >
      selectedPettyCash.saldo_akhir
    ) {
      toast.error("Saldo tidak mencukupi!");
      setIsLoading(false);
      return;
    }

    const payload = {
      petty_cash_setting_id: selectedPettyCash?.id.toString(),
      tanggal_jatuh_tempo: formattedJatuhTempo,
      tanggal_reminder: formattedReminder,
      pemohon: data.pemohon,
      nominal_pengajuan: nominalPengajuan.replace(/\,/g, ""),
      deskripsi: deskripsi,
    };

    // console.log(payload);

    addServicePetttyCash(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getSettingPettyCashs(true);
          getPettyCashByStatus(
            pagination.current,
            pagination.pageSize,
            selectedPettyCash.id.toString()
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

  const pengejuanTransaksi = [
    {
      id: 1,
      coa_account: selectedPettyCash?.coa_account,
      deskripsi: selectedRecord?.deskripsi ?? "-",
      debit: "0",
      kredit: formatCurrency(selectedRecord?.nominal_pengajuan),
    },
  ];

  const realisasiTransaksi = [
    {
      id: 1,
      coa_account: selectedPettyCash?.coa_account,
      deskripsi: selectedRecord?.deskripsi ?? "-",
      debit: "0",
      kredit: formatCurrency(selectedRecord?.nominal_pengajuan),
    },
  ];

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
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Open Petty Cash" />
        {canCreate && (
          <PrimaryButton
            disabled={!selectedPettyCash}
            onClick={handleViewRequest}
          >
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
        <SelectGroupField
          label={"Petty Cash"}
          options={permittedPettyCash}
          value={selectedPettyCash ?? ""}
          onChange={(value: any) => {
            setSelectedPettyCash(value);
            if (value) {
              getPettyCashByStatus(1, pagination.pageSize, value.id);
            }
            // getKasbons();
            // getRequestSaldoByPettyCash(value.id);
          }}
        />
        {selectedPettyCash && (
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
          </>
        )}
        {isModalOpenAddData && (
          <Modal
            key={selectedPettyCash?.id}
            title={
              <>
                <>Open Petty Cash</>
                {!isSubmitted && (
                  <div className="flex gap-4 justify-end px-5">
                    <PrimaryButton onClick={handleModalCloseRequest} outlined>
                      Close
                    </PrimaryButton>
                    <PrimaryButton
                      onClick={() => {
                        const isFormValid = () => {
                          const fields = [
                            "pemohon",
                            "tanggal_jatuh_tempo",
                            "tanggal_reminder",
                            "deskripsi",
                          ];
                          for (const field of fields) {
                            if (!watch(field)) {
                              toast.error(
                                `${field.replace(/_/g, " ")} harus diisi!`
                              );
                              return false;
                            }
                          }
                          return true;
                        };

                        if (isFormValid()) {
                          setIsSubmitted(true);
                        }
                      }}
                      isLoading={isLoading}
                    >
                      Submit
                    </PrimaryButton>
                  </div>
                )}
                {isSubmitted && (
                  <div className="flex gap-4 justify-end px-5">
                    <PrimaryButton
                      onClick={() => handleSubmit(onSubmitAddData)()}
                      isLoading={isLoading}
                    >
                      Submit
                    </PrimaryButton>
                  </div>
                )}
              </>
            }
            open={isModalOpenAddData}
            // onOk={handleSubmit(onSubmit)}
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
              onSubmit={handleSubmit(onSubmitAddData)}
              encType="multipart/form-data"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-5">
                <InputField
                  label="Petty Cash"
                  id="petty_cash"
                  type="text"
                  defaultValue={selectedPettyCash?.nama_petty_cash}
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Pemohon"
                  id="pemohon"
                  type="text"
                  disabled={isSubmitted}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Pemohon harus diisi!",
                  }}
                />
                {/* <InputField
                  label="Nominal Pengajuan"
                  id="nominal_pengajuan"
                  type="number"
                  disabled={isSubmitted}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Nominal pengajuan harus diisi!",
                  }}
                /> */}
                <InputField
                  label="Durasi Jatuh Tempo (Hari)"
                  id="tanggal_jatuh_tempo"
                  type="number"
                  style={{ textAlign: "right" }}
                  disabled={isSubmitted}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Durasi jatuh tempo harus diisi!",
                  }}
                />
                <InputField
                  label="Set Reminder (Hari)"
                  id="tanggal_reminder"
                  type="number"
                  style={{ textAlign: "right" }}
                  disabled={isSubmitted}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Set reminder harus diisi!",
                  }}
                />
                <InputAreaField
                  label="Deskripsi"
                  id="deskripsi"
                  disabled={isSubmitted}
                  register={register}
                  errors={errors}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  validationSchema={{
                    required: "Deskripsi harus diisi!",
                  }}
                />
              </div>
              {isSubmitted && (
                <div className="p-5">
                  <TableApp
                    columns={columnAddData}
                    dataSource={defaultTransaksi}
                    pagination={false}
                  />
                </div>
              )}
            </form>
          </Modal>
        )}
        {isModalOpen && selectedRecord && (
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                <>Open Petty Cash</>
                {canUpdate && (
                  <div className="flex gap-4 justify-end px-5">
                    <PrimaryButton
                      onClick={handleSubmit(() => {
                        onSubmit(PettyCashEnum.Rejected);
                      })}
                      isLoading={isLoading}
                      className="bg-red-500"
                    >
                      Reject
                    </PrimaryButton>
                    <PrimaryButton
                      onClick={handleSubmit(() => {
                        onSubmit(PettyCashEnum.Realized);
                      })}
                      isLoading={isLoading}
                    >
                      Realize
                    </PrimaryButton>
                  </div>
                )}
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 my-8">
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
              <div className="rounded-sm border border-stroke bg-white shadow-defaultp-5 ">
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

export default PettyCashOpen;
