import { EyeIcon } from "@heroicons/react/24/outline";
import { Checkbox, Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  createServiceCashandBankTransaction,
  getServiceCashandBankTransaction,
  getServiceCashandBankTransactionById,
  getServiceCurrencyCashandBankTransaction,
  getServicePaymentSourceCashandBankTransaction,
} from "../../../api/Accounting/services/cashAndBankService";
import type {
  ICashAndBankTransaction,
  ICashAndBankTransactionDetail,
} from "../../../api/Accounting/types/cashAndBank.interface";
import type { ICurrency } from "../../../api/Accounting/types/currency.interface";
import type { IPaymentSources } from "../../../api/Master/types/paymentSources.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputAreaField from "../../../components/Forms/InputAreaField";
import InputField from "../../../components/Forms/InputField";
import SelectDatePicker from "../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";
import { useProfileContext } from "../../../context/profile_context";
import { usePermission } from "../../../hooks/usePermission";
import { formatCurrency } from "../../../utils/format_currency";
import { formatDate } from "../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../utils/InputCurrencyUtils";

const CashandBankTransaction: React.FC = () => {
  const { profile } = useProfileContext();

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

  const { hasPermission } = usePermission();
  const canCreate = hasPermission("cash-bank-transaction-create");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nomor Kas Bank",
      children: [
        {
          title: (
            <InputField
              id="nomor_kas_bank_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getCashAndBank(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nomor_kas_bank",
          key: "nomor_kas_bank",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nomor_kas_bank.localeCompare(b.nomor_kas_bank),
    },
    {
      title: "Tanggal",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValueForm("tanggal_search", date);
                getCashAndBank(pagination.current, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "asset_overview",
          align: "center",
          key: "asset_overview",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
                {record.tanggal ? formatDate(record.tanggal) : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.tanggal.localeCompare(b.tanggal),
    },
    {
      title: "Tipe Transaksi",
      children: [
        {
          title: (
            <InputField
              id="tipe_transaksi_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getCashAndBank(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "tipe_transaksi",
          key: "tipe_transaksi",
        },
      ],
      align: "center",
      sorter: (a, b) => a.tipe_transaksi.localeCompare(b.tipe_transaksi),
    },
    {
      title: "Source",
      children: [
        {
          title: (
            <InputField
              id="source_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getCashAndBank(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "source",
          key: "source",
          render: (_: any, record: any) => {
            return <span>{record.source?.nama_sumber_pembayaran ?? "-"}</span>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) => {
        const sourceA = a.source?.nama_sumber_pembayaran ?? "";
        const sourceB = b.source?.nama_sumber_pembayaran ?? "";

        return sourceA.localeCompare(sourceB);
      },
    },
    {
      title: "Destination",
      children: [
        {
          title: (
            <InputField
              id="destination_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getCashAndBank(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "destination",
          key: "destination",
          render: (_: any, record: any) => {
            return <span>{record.destination?.nama_sumber_pembayaran}</span>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        a.destination.nama_sumber_pembayaran.localeCompare(
          b.destination.nama_sumber_pembayaran
        ),
    },
    {
      title: "Currency",
      children: [
        {
          title: (
            <InputField
              id="currency_code_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getCashAndBank(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "currency",
          key: "currency",
          render: (_: any, record: any) => {
            return <span>{record.currency.nama_currency}</span>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        a.currency.nama_currency.localeCompare(b.currency.nama_currency),
    },
    {
      title: "Nominal",
      children: [
        {
          title: (
            <InputField
              id="nominal_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getCashAndBank(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "nominal",
          key: "nominal",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">{formatCurrency(record.nominal)}</div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal.replace(/,/g, "")) -
        parseFloat(b.nominal.replace(/,/g, "")),
    },
    {
      title: "keterangan",
      children: [
        {
          title: (
            <InputField
              id="keterangan_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getCashAndBank(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "keterangan",
          key: "keterangan",
        },
      ],
      align: "center",
      sorter: (a, b) => a.keterangan.localeCompare(b.keterangan),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record: any) => {
        return (
          <EyeIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              getCashAndBankTransactionById(record.id);
            }}
          />
        );
      },
    },
  ];

  const [cashAndBankTransaction, setCashAndBankTransaction] = useState<
    ICashAndBankTransaction[]
  >([]);
  const [currency, setCurrency] = useState<ICurrency[]>([]);
  const [paymentSource, setPaymentSource] = useState<IPaymentSources[]>([]);

  const [selectedRecord, setSelectedRecord] =
    useState<ICashAndBankTransactionDetail>();

  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency>();
  const [selectedSource, setSelectedSource] = useState<IPaymentSources>();
  const [selectedDestination, setSelectedDestination] =
    useState<IPaymentSources>();
  const [selectedTanggal, setSelectedTanggal] = useState<string>("");

  const [isPenerimaan, setIsPenerimaan] = useState(true);
  const [isPenarikan, setIsPenarikan] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);
  const [isBiayaTransaksi, setIsBiayaTransaksi] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorTanggal, setErrorTanggal] = useState<string>("");
  const [errorCurrency, setErrorCurrency] = useState<string>("");
  const [errorSource, setErrorSource] = useState<string>("");
  const [errorDestination, setErrorDestination] = useState<string>("");

  const handleEdit = (record: ICashAndBankTransactionDetail) => {
    console.log(record);

    setSelectedRecord(record);

    setIsPenerimaan(record.tipe_transaksi === "Penerimaan");
    setIsPenarikan(record.tipe_transaksi === "Penarikan");
    setIsTransfer(record.tipe_transaksi === "Transfer");
    setIsBiayaTransaksi(record.biaya_transaksi !== "0.00");

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);

    setSelectedRecord(undefined);
    setSelectedTanggal("");
    resetForm();
    setErrorTanggal("");
    setErrorCurrency("");
    setErrorSource("");
    setErrorDestination("");
    setSelectedCurrency(undefined);
    setSelectedSource(undefined);
    setSelectedDestination(undefined);
    setIsPenerimaan(true);
    setIsPenarikan(false);
    setIsTransfer(false);
    setIsBiayaTransaksi(false);
  };

  const handleModalAddClose = () => {
    setIsModalAddOpen(false);
    setSelectedTanggal("");
    resetForm();
    setErrorTanggal("");
    setErrorCurrency("");
    setErrorSource("");
    setErrorDestination("");
    setSelectedCurrency(undefined);
    setSelectedSource(undefined);
    setSelectedDestination(undefined);
    setIsPenerimaan(true);
    setIsPenarikan(false);
    setIsTransfer(false);
    setIsBiayaTransaksi(false);
  };

  const getCashAndBank = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page,
      per_page: pageSize,
      tanggal: getValuesForm("tanggal_search"),
      nomor_kas_bank: getValuesForm("nomor_kas_bank_search"),
      source: getValuesForm("source_search"),
      destination: getValuesForm("destination_search"),
      nominal: getValuesForm("nominal_search")?.replace(/,/g, "") || "",
      keterangan: getValuesForm("keterangan_search"),
      currency_code: getValuesForm("currency_code_search"),
    };

    const promise = getServiceCashandBankTransaction(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setCashAndBankTransaction(res.data.data.data);
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

  const getCashAndBankTransactionById = (assetCode: string): void => {
    setIsLoadingModal(true);

    const promise = getServiceCashandBankTransactionById(assetCode);

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

  const getCurrencys = (): void => {
    setIsLoadingModal(true);

    const promise = getServiceCurrencyCashandBankTransaction();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setCurrency(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  const getPaymentSource = (id: string): void => {
    setIsLoadingModal(true);

    const promise = getServicePaymentSourceCashandBankTransaction(id);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setPaymentSource(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedTanggal) {
      setErrorTanggal("Tanggal harus diisi!");
      return;
    }

    if (!selectedCurrency) {
      setErrorCurrency("Currency harus diisi!");
      return;
    }

    if (isPenarikan || isTransfer) {
      if (!selectedSource) {
        setErrorSource("Source harus diisi!");
        return;
      }
    }

    if (isPenerimaan || isTransfer) {
      if (!selectedDestination) {
        setErrorDestination("Destination harus diisi!");
        return;
      }
    }

    setIsLoading(true);

    const payload = {
      tanggal: selectedTanggal,
      tipe_transaksi: isPenerimaan
        ? "penerimaan"
        : isPenarikan
        ? "penarikan"
        : "transfer",
      currency_id: selectedCurrency?.id,
      source_id: isPenarikan || isTransfer ? selectedSource?.id : null,
      destination_id:
        isPenerimaan || isTransfer ? selectedDestination?.id : null,
      nominal: data.nominal.replace(/,/g, ""),
      keterangan: data.keterangan,
      biaya_transaksi: isBiayaTransaksi
        ? data.biaya_transaksi.replace(/,/g, "")
        : null,
    };

    console.log(payload);

    await createServiceCashandBankTransaction(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          toast.success(res.data.message);
          getCashAndBank(pagination.current, pagination.pageSize);
          resetForm();
          handleModalAddClose();
        } else {
          setIsLoading(false);
          toast.error("Failed to submit data");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getCashAndBank(1, 10);
    getCurrencys();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Cash and Bank Transaction" />
        {canCreate && (
          <PrimaryButton onClick={() => setIsModalAddOpen(true)}>
            Add Data
          </PrimaryButton>
        )}
      </div>
      <TableApp
        dataSource={cashAndBankTransaction}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page: number, size: number) =>
          getCashAndBank(page, size)
        }
      />
      <Spin spinning={isLoadingModal} fullscreen />

      {isModalOpen && selectedRecord && (
        <Modal
          key={selectedRecord?.id}
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
          <>
            <form>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6 ">
                    <InputField
                      label="Nomor Kas Bank"
                      id="nomor_kas_bank"
                      disabled
                      type="text"
                      defaultValue={selectedRecord.nomor_kas_bank}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                    <InputField
                      label="Tanggal"
                      id="tanggal"
                      type="text"
                      disabled
                      defaultValue={formatDate(selectedRecord.tanggal)}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                    <InputField
                      label="Currency"
                      id="currency"
                      type="text"
                      disabled
                      defaultValue={selectedRecord.currency.nama_currency}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsPenerimaan(value.target.checked);
                      }}
                      disabled
                      defaultChecked={isPenerimaan}
                      className="custom-checkbox"
                    >
                      {"Penerimaan"}
                    </Checkbox>
                  </div>
                  <div></div>
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsPenarikan(value.target.checked);
                      }}
                      disabled
                      defaultChecked={isPenarikan}
                      className="custom-checkbox"
                    >
                      {"Penarikan"}
                    </Checkbox>
                  </div>
                  <div></div>
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsTransfer(value.target.checked);
                      }}
                      disabled
                      defaultChecked={isTransfer}
                      className="custom-checkbox"
                    >
                      {"Transfer"}
                    </Checkbox>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="p-5">
                <InputAreaField
                  label="Keterangan"
                  id="keterangan"
                  register={registerForm}
                  errors={errorsForm}
                  defaultValue={selectedRecord.keterangan}
                  disabled
                  validationSchema={{}}
                />
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6 ">
                    {/* Always render Source InputField, but hide with invisible if not needed */}
                    <InputField
                      label="Source"
                      id="source"
                      type="text"
                      defaultValue={
                        selectedRecord.source?.nama_sumber_pembayaran
                      }
                      disabled
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                      className={`${
                        isPenarikan || isTransfer ? "" : "invisible"
                      }`}
                    />
                    <InputField
                      label="Nominal"
                      id="nominal"
                      type="text"
                      disabled
                      style={{ textAlign: "right" }}
                      defaultValue={formatCurrency(selectedRecord.nominal)}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  {(isPenerimaan || isTransfer) && (
                    <InputField
                      label="Destination"
                      id="destination"
                      type="text"
                      defaultValue={
                        selectedRecord.destination?.nama_sumber_pembayaran
                      }
                      disabled
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex gap-4">
                  <Checkbox
                    className="custom-checkbox"
                    checked={isBiayaTransaksi}
                    disabled
                    onChange={(e) => {
                      setIsBiayaTransaksi(e.target.checked);
                      if (e.target.checked === false) {
                        setValueForm("transfer", "");
                      }
                    }}
                  />
                  <InputField
                    id="biaya_transaksi"
                    type="text"
                    label="Biaya Transaksi"
                    disabled
                    defaultValue={formatCurrency(
                      selectedRecord.biaya_transaksi
                    )}
                    onKeyDown={handleKeyDown}
                    onInput={handleInputChange}
                    style={{ textAlign: "right" }}
                    register={registerForm}
                    errors={errorsForm}
                    validationSchema={
                      isBiayaTransaksi
                        ? { required: "Biaya Transaksi harus diisi!" }
                        : {}
                    }
                  />
                </div>
              </div>
            </form>
          </>
        </Modal>
      )}

      {isModalAddOpen && (
        <Modal
          title={
            <>
              <div className="flex gap-4 justify-end px-5">
                <PrimaryButton outlined onClick={handleModalClose}>
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  onClick={handleSubmitForm(onSubmit)}
                  isLoading={isLoading}
                >
                  Submit
                </PrimaryButton>
              </div>
            </>
          }
          open={isModalAddOpen}
          onCancel={handleModalAddClose}
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
            <form onSubmit={handleSubmitForm(onSubmit)}>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6">
                    <InputField
                      label="Nomor Kas Bank"
                      id="nomor_kas_bank"
                      disabled
                      type="text"
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                    <SelectDatePicker
                      label="Tanggal"
                      backDate={Number(profile?.role?.backdate_limit)}
                      errors={errorTanggal}
                      onChange={(date) => {
                        setSelectedTanggal(date);
                        setErrorTanggal("");
                      }}
                    />
                    <SelectGroupField
                      label="Currency"
                      value={selectedCurrency}
                      options={currency}
                      error={errorCurrency}
                      onChange={(value: ICurrency) => {
                        setSelectedCurrency(value);
                        getPaymentSource(value.id.toString());
                      }}
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsPenerimaan(value.target.checked);

                        setIsPenarikan(false);
                        setIsTransfer(false);
                      }}
                      defaultChecked={isPenerimaan}
                      checked={isPenerimaan}
                      className="custom-checkbox"
                    >
                      {"Penerimaan"}
                    </Checkbox>
                  </div>
                  <div></div>
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsPenarikan(value.target.checked);

                        setIsPenerimaan(false);
                        setIsTransfer(false);
                      }}
                      defaultChecked={isPenarikan}
                      checked={isPenarikan}
                      className="custom-checkbox"
                    >
                      {"Penarikan"}
                    </Checkbox>
                  </div>
                  <div></div>
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsTransfer(value.target.checked);

                        setIsPenerimaan(false);
                        setIsPenarikan(false);
                      }}
                      defaultChecked={isTransfer}
                      checked={isTransfer}
                      className="custom-checkbox"
                    >
                      {"Transfer"}
                    </Checkbox>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="p-5">
                <InputAreaField
                  label="Keterangan"
                  id="keterangan"
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Keterangan harus diisi!",
                  }}
                />
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6 ">
                    <SelectGroupField
                      label="Source"
                      options={paymentSource}
                      value={selectedSource}
                      error={errorSource}
                      onChange={(value: IPaymentSources) => {
                        setSelectedSource(value);
                      }}
                      className={`${
                        isPenarikan || isTransfer ? "" : "invisible"
                      }`}
                    />
                    <InputField
                      label="Nominal"
                      id="nominal"
                      type="text"
                      style={{ textAlign: "right" }}
                      onKeyDown={handleKeyDown}
                      onInput={handleInputChange}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{
                        required: "Nominal harus diisi!",
                      }}
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  {(isPenerimaan || isTransfer) && (
                    <SelectGroupField
                      label="Destination"
                      options={paymentSource}
                      value={selectedDestination}
                      error={errorDestination}
                      onChange={(value: IPaymentSources) => {
                        setSelectedDestination(value);
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex gap-4">
                  <Checkbox
                    className="custom-checkbox"
                    checked={isBiayaTransaksi}
                    onChange={(e) => {
                      setIsBiayaTransaksi(e.target.checked);
                      if (e.target.checked === false) {
                        setValueForm("biaya_transaksi", "");
                      }
                    }}
                  />
                  <InputField
                    id="biaya_transaksi"
                    type="text"
                    label="Biaya Transaksi"
                    disabled={!isBiayaTransaksi}
                    onKeyDown={handleKeyDown}
                    onInput={handleInputChange}
                    style={{ textAlign: "right" }}
                    register={registerForm}
                    errors={errorsForm}
                    validationSchema={{
                      required: isBiayaTransaksi
                        ? "Biaya Transaksi harus diisi!"
                        : false,
                    }}
                  />
                </div>
              </div>
            </form>
          </>
        </Modal>
      )}
    </>
  );
};

export default CashandBankTransaction;
