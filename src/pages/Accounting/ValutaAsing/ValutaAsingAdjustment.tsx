import { EyeIcon } from "@heroicons/react/24/outline";
import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { getCurrency } from "../../../api/Accounting/services/currencyService";
import {
  createServiceValutaAsingAdjustment,
  getServiceValutaAsingAdjustment,
  getServiceValutaAsingAdjustmentById,
  getServiceValutaAsingAdjustmentHistory,
} from "../../../api/Accounting/services/valutaAsingService";
import type { ICurrency } from "../../../api/Accounting/types/currency.interface";
import type {
  IValutaAsingAdjustment,
  IValutaAsingAdjustmentDetail,
  IValutaAsingAdjustmentHistory,
} from "../../../api/Accounting/types/valutaAsingAdjustment.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputAreaField from "../../../components/Forms/InputAreaField";
import InputField from "../../../components/Forms/InputField";
import SelectDatePicker from "../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";
import { usePermission } from "../../../hooks/usePermission";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../utils/InputCurrencyUtils";
import { formatCurrency } from "../../../utils/format_currency";
import { formatDate } from "../../../utils/format_date";

const ValutaAsingAdjustment: React.FC = () => {
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

  const [paginationHistory, setPaginationHistory] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("exchange-rate-adjustment-create");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Kas / Bank",
      children: [
        {
          title: (
            <InputField
              id="kas_bank_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingAdjustment(
                  pagination.current,
                  pagination.pageSize
                )
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "source",
          key: "source",
          render: (_: any, record: any) => {
            return <span>{record.source.nama_sumber_pembayaran}</span>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        a.source.nama_sumber_pembayaran.localeCompare(
          b.source.nama_sumber_pembayaran
        ),
    },
    {
      title: "Saldo VA",
      children: [
        {
          title: (
            <InputField
              id="saldo_va_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getValutaAsingAdjustment(
                  pagination.current,
                  pagination.pageSize
                )
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "saldo_va",
          align: "center",
          key: "saldo_va",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
                {record.saldo_va ? formatCurrency(record.saldo_va) : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.saldo_va.localeCompare(b.saldo_va),
    },
    {
      title: "Saldo Rupiah",
      children: [
        {
          title: (
            <InputField
              id="saldo_rupiah_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getValutaAsingAdjustment(
                  pagination.current,
                  pagination.pageSize
                )
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "saldo_rupiah",
          align: "center",
          key: "saldo_rupiah",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
                {record.saldo_rupiah
                  ? formatCurrency(record.saldo_rupiah)
                  : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.saldo_rupiah.localeCompare(b.saldo_rupiah),
    },
    {
      title: "Action",
      align: "center",
      dataIndex: "",
      key: "x",
      render: (record: any) => {
        return (
          <EyeIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              setselectedRecord(record);
              getValutaAsingAdjustmentById(record.coa_id.toString());
            }}
          />
        );
      },
    },
  ];

  const columnNominal: ColumnsType<any> = [
    {
      title: "Saldo VA",
      align: "center",
      dataIndex: "nominal_sisa",
      key: "nominal_sisa",
      render: (_: any, record: any) => {
        return (
          <div className="text-right">
            {formatCurrency(record.nominal_sisa)}
          </div>
        );
      },
    },
    {
      title: "Kurs",
      align: "center",
      dataIndex: "kurs",
      key: "kurs",
      render: (_: any, record: any) => {
        return <div className="text-right">{formatCurrency(record.kurs)}</div>;
      },
    },
    {
      title: "Nominal Rupiah",
      align: "center",
      dataIndex: "nominal_rupiah",
      key: "nominal_rupiah",
      render: (_: any, record: any) => {
        return (
          <div className="text-right">
            {formatCurrency(record.nominal_rupiah)}
          </div>
        );
      },
    },
  ];

  const columnTransaksiAdjustment: ColumnsType<any> = [
    {
      title: "Kas / Bank",
      align: "center",
      dataIndex: "source",
      key: "source",
      render: (_: any, record: any) => {
        return <span>{record.source.nama_sumber_pembayaran}</span>;
      },
    },
    {
      title: "Saldo VA",
      align: "center",
      dataIndex: "saldo_va",
      key: "saldo_va",
      render: (_: any, record: any) => {
        return (
          <div className="text-right">{`${
            record.currency.kode_currency
          } ${formatCurrency(record.saldo_va)}`}</div>
        );
      },
    },
    {
      title: "Saldo Rupiah (Lama)",
      align: "center",
      dataIndex: "saldo_rupiah_lama",
      key: "saldo_rupiah_lama",
      render: (_: any, record: any) => {
        return (
          <div className="text-right">
            {record.saldo_rupiah
              ? formatCurrency(record.saldo_rupiah)
              : formatCurrency(record.saldo_rupiah_lama)}
          </div>
        );
      },
    },
    {
      title: "Saldo Rupiah (Baru)",
      align: "center",
      dataIndex: "saldo_rupiah_baru",
      key: "saldo_rupiah_baru",
      render: (_: any, record: any) => {
        return (
          <div className="text-right">
            {formatCurrency(record.saldo_rupiah_baru)}
          </div>
        );
      },
    },
    {
      title: "Selisih Saldo Rupiah",
      align: "center",
      dataIndex: "selisih_saldo_rupiah",
      key: "selisih_saldo_rupiah",
      render: (_: any, record: any) => {
        return (
          <div className="text-right">
            {formatCurrency(record.selisih_saldo_rupiah)}
          </div>
        );
      },
    },
  ];

  const columnHistory: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (paginationHistory.current - 1) * paginationHistory.pageSize +
        index +
        1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nomor Penyesuaian",
      children: [
        {
          title: (
            <InputField
              id="nomor_transaksi_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingAdjustmentHistory(1, paginationHistory.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nomor_transaksi",
          key: "nomor_transaksi",
          render: (_: any, record: any) => {
            return <span>{record.nomor_transaksi}</span>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.nomor_transaksi.localeCompare(b.nomor_transaksi),
    },
    {
      title: "Tangal Penyesuaian",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValueForm("tanggal_adjust_search", date);
                getValutaAsingAdjustmentHistory(1, paginationHistory.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_adjust",
          align: "center",
          key: "tanggal_adjust",
          render: (tanggal_adjust: string) => {
            return (
              <div className="text-right">
                {tanggal_adjust ? formatDate(tanggal_adjust) : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.tanggal_submit.localeCompare(b.tanggal_submit),
    },
    {
      title: "Action",
      align: "center",
      dataIndex: "",
      key: "x",
      render: (record: any) => {
        return (
          <div className="flex justify-center">
            <EyeIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                handleViewHistory(record);
              }}
            />
          </div>
        );
      },
    },
  ];

  const [valutaAsingAdjustment, setvalutaAsingAdjustment] = useState<
    IValutaAsingAdjustment[]
  >([]);
  const [detailAdjustment, setDetailAdjustment] = useState<
    IValutaAsingAdjustmentDetail[]
  >([]);
  const [currency, setCurrency] = useState<ICurrency[]>([]);
  const [transaksiAdjustment, setTransaksiAdjustment] = useState<any[]>([]);
  const [historyAdjustment, setHistoryAdjustment] = useState<
    IValutaAsingAdjustmentHistory[]
  >([]);

  const [selectedRecord, setselectedRecord] =
    useState<IValutaAsingAdjustment>();
  const [selectedRecordHistory, setSelectedRecordHistory] =
    useState<IValutaAsingAdjustmentHistory>();

  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAdjustmentOpen, setIsModalAdjustmentOpen] = useState(false);
  const [isModalHistoryOpen, setIsModalHistoryOpen] = useState(false);
  const [isModalHistoryDetailOpen, setIsModalHistoryDetailOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const handleViewHistory = (record: IValutaAsingAdjustmentHistory) => {
    console.log(record);

    setSelectedRecordHistory(record);

    setIsModalHistoryDetailOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);

    setDetailAdjustment([]);

    resetForm();
  };

  const handleModalAdjustmentClose = () => {
    setIsModalAdjustmentOpen(false);

    transaksiAdjustment.forEach((item) => {
      item.saldo_rupiah_baru = "0";
      item.selisih_saldo_rupiah = "0";
    });

    resetForm();
  };

  const handleModalHistoryClose = () => {
    setIsModalHistoryOpen(false);

    resetForm();
  };

  const handleModalDetailHistoryClose = () => {
    setIsModalHistoryDetailOpen(false);

    resetForm();
  };

  const getValutaAsingAdjustment = (
    page: number,
    pageSize: number,
    currency_id?: number
  ): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page,
      per_page: pageSize,
      currency_id: currency_id || selectedCurrency?.id,
      source: getValuesForm("kas_bank_search"),
      saldo_va: getValuesForm("saldo_va_search")?.replace(/,/g, "") || "",
      saldo_rupiah:
        getValuesForm("saldo_rupiah_search")?.replace(/,/g, "") || "",
    };

    const promise = getServiceValutaAsingAdjustment(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setvalutaAsingAdjustment(res.data.data.data);
          setTransaksiAdjustment(res.data.data.data);
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

  const getValutaAsingAdjustmentById = (id: string): void => {
    setIsLoadingModal(true);

    const promise = getServiceValutaAsingAdjustmentById(id);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setDetailAdjustment(res.data.data);
          setIsModalOpen(true);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getValutaAsingAdjustmentHistory = (
    page: number,
    pageSize: number,
    currency_id?: number
  ): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page,
      per_page: pageSize,
      currency_id: currency_id || selectedCurrency?.id,
      nomor_transaksi: getValuesForm("nomor_transaksi_search"),
      tanggal_adjust: getValuesForm("tanggal_adjust_search"),
    };

    const promise = getServiceValutaAsingAdjustmentHistory(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setHistoryAdjustment(res.data.data.data);
          setIsModalHistoryOpen(true);
          setPaginationHistory({
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

  const getCurrencys = (): void => {
    setIsLoadingModal(true);

    const params = {
      is_active: "1",
    };

    const promise = getCurrency(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setCurrency(
            res.data.data.filter((item: ICurrency) => item.is_default !== "1")
          );
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoadingModal);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const payload = {
      currency_id: selectedCurrency?.id,
      keterangan: data.keterangan,
      tanggal_adjust: new Date().toISOString().split("T")[0],
      kurs: data.kurs_penyesuaian.replace(/[^0-9.]/g, ""),
      list: transaksiAdjustment.map((item) => ({
        source_id: item.source.id,
        coa_source_id: item.coa_id,
        saldo_va: Number(item.saldo_va),
        saldo_rupiah_lama: Number(item.saldo_rupiah),
        saldo_rupiah_baru: Number(item.saldo_rupiah_baru),
        selisih_saldo_rupiah: Number(item.selisih_saldo_rupiah),
      })),
    };

    console.log(payload);

    const promise = createServiceValutaAsingAdjustment(payload);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          toast.success(res.data.message || "Berhasil Mensubmit Adjustment!");
          getValutaAsingAdjustment(1, 10, Number(selectedCurrency?.id));
          handleModalAdjustmentClose();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getCurrencys();
  }, []);

  return (
    <>
      <div className="mb-8">
        <MyBreadcrumb pageName="Exchange Rate Adjustment" />
      </div>
      <div className="mb-4 flex items-center gap-4">
        {canCreate && (
          <PrimaryButton
            onClick={() => setIsModalAdjustmentOpen(true)}
            disabled={!selectedCurrency}
          >
            Adjustment
          </PrimaryButton>
        )}
        <PrimaryButton
          outlined
          disabled={!selectedCurrency}
          onClick={() =>
            getValutaAsingAdjustmentHistory(
              1,
              paginationHistory.pageSize,
              Number(selectedCurrency?.id)
            )
          }
        >
          View History
        </PrimaryButton>
      </div>
      <SelectGroupField
        label="Currency"
        options={currency}
        value={selectedCurrency}
        className="w-1/3 mb-4"
        allowClear={false}
        onChange={(value: ICurrency) => {
          setSelectedCurrency(value);
          setValueForm("currency", value.nama_currency);
          setValueForm(
            "keterangan",
            `Penyesuaian Valuta Asing (${value.nama_currency})`
          );
          getValutaAsingAdjustment(1, pagination.pageSize, Number(value.id));
        }}
      />
      {selectedCurrency && (
        <TableApp
          dataSource={valutaAsingAdjustment}
          columns={columns}
          pagination={pagination}
          onPaginationChange={(page: number, size: number) =>
            getValutaAsingAdjustment(page, size)
          }
        />
      )}
      <Spin spinning={isLoadingModal} fullscreen />

      {isModalOpen && (
        <Modal
          key={selectedRecord?.coa_id}
          open={isModalOpen}
          onCancel={handleModalClose}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          width={1000}
          title={`Valuta Asing Adjustment - ${selectedRecord?.source.nama_sumber_pembayaran}`}
          styles={{
            body: {
              maxHeight: "70vh",
              overflowY: "auto",
            },
          }}
        >
          <>
            <div className="my-10">
              <TableApp
                dataSource={detailAdjustment}
                columns={columnNominal}
                pagination={false}
                scroll={{ x: 300 }}
              />
            </div>
          </>
        </Modal>
      )}

      {isModalAdjustmentOpen && selectedCurrency && (
        <Modal
          title={
            <>
              <div className="flex justify-end gap-4 px-5">
                <PrimaryButton outlined onClick={handleModalAdjustmentClose}>
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  isLoading={isLoading}
                  onClick={() => handleSubmitForm(onSubmit)()}
                >
                  Submit
                </PrimaryButton>
              </div>
            </>
          }
          open={isModalAdjustmentOpen}
          onCancel={handleModalAdjustmentClose}
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
            <form
              onSubmit={handleSubmitForm(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6">
                    <InputField
                      label="Nomor Penyesuaian"
                      id="nomor_penyesuaian"
                      disabled
                      type="text"
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                    <InputField
                      label="Tanggal Submit"
                      id="tanggal_submit"
                      disabled
                      type="text"
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  <InputField
                    label="Currency"
                    id="currency"
                    defaultValue={selectedCurrency.nama_currency}
                    disabled
                    type="text"
                    register={registerForm}
                    errors={errorsForm}
                    validationSchema={{}}
                  />
                </div>
              </div>
              <div className="p-5">
                <InputAreaField
                  label="Keterangan"
                  id="keterangan"
                  defaultValue={`Penyesuaian Valuta Asing (${selectedCurrency.nama_currency})`}
                  register={registerForm}
                  errors={errorsForm}
                  disabled
                  validationSchema={{
                    required: "Keterangan harus diisi!",
                  }}
                />
                <br />
                <InputField
                  label="Kurs Penyesuaian"
                  id="kurs_penyesuaian"
                  type="text"
                  style={{ textAlign: "right" }}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, "");
                    if (!value) value = "0";

                    transaksiAdjustment.forEach((item) => {
                      item.saldo_rupiah_baru = (
                        Number(item.saldo_va) * Number(value)
                      ).toString();
                      item.selisih_saldo_rupiah =
                        value === "0"
                          ? "0"
                          : (
                              Number(item.saldo_rupiah_baru) -
                              Number(item.saldo_rupiah)
                            ).toString();
                    });
                    setTransaksiAdjustment([...transaksiAdjustment]);

                    handleInputChange(e);
                  }}
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Kurs Penyesuaian harus diisi!",
                  }}
                />
              </div>
              <div className="p-5">
                <TableApp
                  dataSource={transaksiAdjustment}
                  columns={columnTransaksiAdjustment}
                  pagination={false}
                  scroll={{ x: 300 }}
                />
              </div>
            </form>
          </>
        </Modal>
      )}

      {isModalHistoryOpen && (
        <Modal
          title={`Adjustment Valuta Asing History (${selectedCurrency?.nama_currency})`}
          open={isModalHistoryOpen}
          onCancel={handleModalHistoryClose}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          width={1100}
          styles={{
            body: {
              maxHeight: "70vh",
              overflowY: "auto",
              minHeight: "30vh",
            },
          }}
        >
          <>
            <TableApp
              dataSource={historyAdjustment}
              columns={columnHistory}
              pagination={paginationHistory}
              onPaginationChange={(page: number, size: number) =>
                getValutaAsingAdjustmentHistory(
                  page,
                  size,
                  Number(selectedCurrency?.id)
                )
              }
              scroll={{ x: 1000, y: 300 }}
            />
          </>
        </Modal>
      )}

      {isModalHistoryDetailOpen && selectedRecordHistory && (
        <Modal
          open={isModalHistoryDetailOpen}
          onCancel={handleModalDetailHistoryClose}
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
            <form
              onSubmit={handleSubmitForm(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6">
                    <InputField
                      label="Nomor Penyesuaian"
                      id="nomor_penyesuaian"
                      disabled
                      type="text"
                      register={registerForm}
                      errors={errorsForm}
                      defaultValue={selectedRecordHistory.nomor_transaksi}
                      validationSchema={{}}
                    />
                    <InputField
                      label="Tanggal Submit"
                      id="tanggal_submit"
                      disabled
                      type="text"
                      register={registerForm}
                      errors={errorsForm}
                      defaultValue={formatDate(
                        selectedRecordHistory.tanggal_adjust
                      )}
                      validationSchema={{}}
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  <InputField
                    label="Currency"
                    id="currency"
                    defaultValue={selectedRecordHistory.currency.nama_currency}
                    disabled
                    type="text"
                    register={registerForm}
                    errors={errorsForm}
                    validationSchema={{}}
                  />
                </div>
              </div>
              <div className="p-5">
                <InputAreaField
                  label="Keterangan"
                  id="keterangan_history"
                  defaultValue={selectedRecordHistory.keterangan}
                  register={registerForm}
                  errors={errorsForm}
                  disabled
                  validationSchema={{
                    required: "Keterangan harus diisi!",
                  }}
                />
                <br />
                <InputField
                  label="Kurs Penyesuaian"
                  id="kurs_penyesuaian"
                  type="text"
                  onKeyDown={handleKeyDown}
                  register={registerForm}
                  errors={errorsForm}
                  style={{ textAlign: "right" }}
                  defaultValue={formatCurrency(
                    selectedRecordHistory.transactions[0]?.kurs
                  )}
                  disabled
                  validationSchema={{}}
                />
              </div>
              <div className="p-5">
                <TableApp
                  dataSource={selectedRecordHistory.transactions}
                  columns={columnTransaksiAdjustment}
                  pagination={false}
                  scroll={{ x: 300 }}
                />
              </div>
            </form>
          </>
        </Modal>
      )}
    </>
  );
};

export default ValutaAsingAdjustment;
