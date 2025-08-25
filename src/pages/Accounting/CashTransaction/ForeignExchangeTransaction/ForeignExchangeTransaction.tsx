import { EyeIcon } from "@heroicons/react/24/outline";
import { Checkbox, Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getCurrency } from "../../../../api/Accounting/services/currencyService";
import {
  getServiceValutaAsingTransaksi,
  getServiceValutaAsingTransaksiById,
} from "../../../../api/Accounting/services/valutaAsingService";
import type { ICurrency } from "../../../../api/Accounting/types/currency.interface";
import type {
  IValutaAsingTransaksi,
  IValutaAsingTransaksiDetail,
} from "../../../../api/Accounting/types/valutaAsing.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputAreaField from "../../../../components/Forms/InputAreaField";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../components/Tables/TableApp";
import { usePermission } from "../../../../hooks/usePermission";
import { formatCurrency } from "../../../../utils/format_currency";
import { formatDate } from "../../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";

const ForeignExchangeTransaction: React.FC = () => {
  const {
    setValue: setValueForm,
    getValues: getValuesForm,
    register: registerForm,
    // handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    // reset: resetForm,
  } = useForm({});

  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchStatus, setSearchStatus] = useState<string>();

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("foreign-exchange-transaction-create");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nomor Transaksi",
      children: [
        {
          title: (
            <InputField
              id="nomor_transaksi_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingTransaksi(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nomor_transaksi",
          key: "nomor_transaksi",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nomor_transaksi.localeCompare(b.nomor_transaksi),
    },
    {
      title: "Tanggal Submit",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValueForm("tanggal_submit_search", date);
                getValutaAsingTransaksi(
                  pagination.current,
                  pagination.pageSize
                );
              }}
            />
          ),
          dataIndex: "tanggal_transaksi",
          align: "center",
          key: "tanggal_transaksi",
          render: (_: any, record: any) => {
            return (
              <div className="text-center">
                {record.tanggal_transaksi
                  ? formatDate(record.tanggal_transaksi)
                  : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        (a.tanggal_transaksi ?? "")
          .toString()
          .localeCompare((b.tanggal_transaksi ?? "").toString()),
    },
    {
      title: "Tanggal Approve",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValueForm("tanggal_approve_search", date);
                getValutaAsingTransaksi(
                  pagination.current,
                  pagination.pageSize
                );
              }}
            />
          ),
          dataIndex: "tanggal_approve",
          align: "center",
          key: "tanggal_approve",
          render: (_: any, record: any) => {
            return (
              <div className="text-center">
                {record.tanggal_approve
                  ? formatDate(record.tanggal_approve)
                  : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        (a.tanggal_approve ?? "")
          .toString()
          .localeCompare((b.tanggal_approve ?? "").toString()),
    },
    {
      title: "Tipe",
      children: [
        {
          title: (
            // <InputField
            //   id="tipe_search"
            //   type="text"
            //   register={registerForm}
            //   errors={errorsForm}
            //   onSearch={(_) =>
            //     getValutaAsingTransaksi(pagination.current, pagination.pageSize)
            //   }
            //   validationSchema={{}}
            // />

            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Pembelian", "Pencairan"]}
              value={searchStatus}
              onChange={(value: string) => {
                setValueForm("tipe_search", value);
                getValutaAsingTransaksi(
                  pagination.current,
                  pagination.pageSize
                );
              }}
            />
          ),
          align: "center",
          dataIndex: "transaction_type",
          key: "transaction_type",
        },
      ],
      align: "center",
      sorter: (a, b) => a.transaction_type.localeCompare(b.transaction_type),
    },
    // {
    //   title: "Currency",
    //   children: [
    //     {
    //       title: (
    //         <InputField
    //           id="currency_search"
    //           type="text"
    //           register={registerForm}
    //           errors={errorsForm}
    //           onSearch={(_) =>
    //             getValutaAsingTransaksi(pagination.current, pagination.pageSize)
    //           }
    //           validationSchema={{}}
    //         />
    //       ),
    //       align: "center",
    //       dataIndex: "currency",
    //       key: "currency",
    //       render: (_: any, record: any) => {
    //         return (
    //           <span>
    //             {record.currency ? record.currency.nama_currency : "-"}
    //           </span>
    //         );
    //       },
    //     },
    //   ],
    //   align: "center",
    //   sorter: (a, b) => a.currency.nama_currency.localeCompare(b.currency.nama_currency),
    // },
    {
      title: "Source Bank",
      children: [
        {
          title: (
            <InputField
              id="source_bank_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingTransaksi(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "source",
          key: "source",
          render: (_: any, record: any) => {
            return <span>{record.source?.nama_sumber_pembayaran}</span>;
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
      title: "Destination Bank",
      children: [
        {
          title: (
            <InputField
              id="destination_bank_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingTransaksi(pagination.current, pagination.pageSize)
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
      title: "Nominal Asing",
      children: [
        {
          title: (
            <InputField
              id="nominal_asing_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getValutaAsingTransaksi(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nominal_asing",
          key: "nominal_asing",
          render: (_: any, record: any) => {
            return (
              <div className="text-center">
                {record.nominal_asing
                  ? formatCurrency(record.nominal_asing)
                  : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal_asing.replace(/,/g, "")) -
        parseFloat(b.nominal_asing.replace(/,/g, "")),
    },
    {
      title: "Kurs",
      children: [
        {
          title: (
            <InputField
              id="kurs_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getValutaAsingTransaksi(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "kurs",
          key: "kurs",
          render: (_: any, record: any) => {
            return (
              <div className="text-center">{formatCurrency(record.kurs)}</div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.kurs.replace(/,/g, "")) -
        parseFloat(b.kurs.replace(/,/g, "")),
    },
    {
      title: "Nominal Rupiah",
      children: [
        {
          title: (
            <InputField
              id="nominal_rupiah_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getValutaAsingTransaksi(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nominal_rupiah",
          key: "nominal_rupiah",
          render: (_: any, record: any) => {
            return (
              <div className="text-center">
                {record.nominal_rupiah
                  ? formatCurrency(record.nominal_rupiah)
                  : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal_rupiah.replace(/,/g, "")) -
        parseFloat(b.nominal_rupiah.replace(/,/g, "")),
    },
    {
      title: "Status",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Submitted", "Approved", "Rejected"]}
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
                className={`px-2 py-1 rounded-md text-xs ${
                  status === "Draft" ? "text-black" : "text-white"
                } ${
                  status === "Approved"
                    ? "bg-green-600"
                    : status === "Rejected"
                    ? "bg-red-600"
                    : "bg-blue-600"
                }`}
              >
                {status === "Approved"
                  ? "Approved"
                  : status === "Rejected"
                  ? "Rejected"
                  : "Submitted"}
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
        return (
          <EyeIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              getValutaAsingTransaksiById(record.id.toString());
            }}
          />
        );
      },
    },
  ];

  const columnNominal: ColumnsType<any> = [
    {
      title: "Nominal VA",
      align: "center",
      dataIndex: "nominal_asing",
      key: "nominal_asing",
      render: (_: any, record: any) => {
        return (
          <div className="text-center">
            {formatCurrency(record.nominal_asing)}
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
        return <div className="text-center">{formatCurrency(record.kurs)}</div>;
      },
    },
    {
      title: "Nominal Rupiah",
      align: "center",
      dataIndex: "nominal_rupiah",
      key: "nominal_rupiah",
      render: (_: any, record: any) => {
        return (
          <div className="text-center">
            {formatCurrency(record.nominal_rupiah)}
          </div>
        );
      },
    },
  ];

  const [valutaAsingTransaksi, setvalutaAsingTransaksi] = useState<
    IValutaAsingTransaksi[]
  >([]);
  const [currency, setCurrency] = useState<ICurrency[]>([]);

  const [selectedRecord, setSelectedRecord] =
    useState<IValutaAsingTransaksiDetail>();

  const [filterCurrency, setFilterCurrency] = useState<ICurrency>();

  const [isPencairan, setIsPencairan] = useState(true);
  const [isPembelian, setIsPembelian] = useState(false);
  const [isBiayaTransaksi, setIsBiayaTransaksi] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const handleEdit = (record: IValutaAsingTransaksiDetail) => {
    console.log(record);

    setSelectedRecord(record);
    setIsPencairan(record.transaction_type === "Pencairan");
    setIsPembelian(record.transaction_type === "Pembelian");

    setValueForm(
      "currency_source",
      record.source?.currency?.nama_currency || ""
    );
    setValueForm(
      "currency_destination",
      record.destination?.currency?.nama_currency || ""
    );
    setValueForm("source", record.source?.nama_sumber_pembayaran || "");
    setValueForm(
      "destination",
      record.destination?.nama_sumber_pembayaran || ""
    );
    setIsBiayaTransaksi(record.biaya_transaksi !== "0.00");

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedRecord(undefined);

    setIsPencairan(false);
    setIsPembelian(false);

    setValueForm("currency_source", "");
    setValueForm("currency_destination", "");
    setValueForm("source", "");
    setValueForm("destination", "");

    setIsModalOpen(false);
  };

  const getValutaAsingTransaksi = (
    page: number,
    pageSize: number,
    currency_id?: number | string
  ): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page,
      per_page: pageSize,
      currency_filter: currency_id || filterCurrency?.kode_currency,
      nomor_transaksi: getValuesForm("nomor_transaksi_search"),
      tanggal_submit: getValuesForm("tanggal_submit_search"),
      tanggal_approve: getValuesForm("tanggal_approve_search"),
      tipe: getValuesForm("tipe_search"),
      currency: getValuesForm("currency_search"),
      source_bank: getValuesForm("source_bank_search"),
      destination_bank: getValuesForm("destination_bank_search"),
      nominal_asing: getValuesForm("nominal_asing_search"),
      kurs: getValuesForm("kurs_search"),
      nominal_rupiah: getValuesForm("nominal_rupiah_search"),
      status: searchStatus,
      //   nominal: getValuesForm("nominal_search")?.replace(/,/g, "") || "",
    };

    const promise = getServiceValutaAsingTransaksi(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setvalutaAsingTransaksi(res.data.data.data);
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

  const getValutaAsingTransaksiById = (id: string): void => {
    setIsLoadingModal(true);

    const promise = getServiceValutaAsingTransaksiById(id);

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

  useEffect(() => {
    getValutaAsingTransaksi(1, 10);
    getCurrencys();
  }, [searchStatus]);

  return (
    <>
      <div className="mb-4">
        <MyBreadcrumb pageName="Foreign Exchange Transaction" />
      </div>
      <div className="mb-8 flex justify-between items-center">
        <SelectGroupField
          label="Currency"
          options={currency}
          value={filterCurrency}
          className="w-1/3"
          onChange={(value: ICurrency) => {
            setFilterCurrency(value);
            getValutaAsingTransaksi(1, 10, value.kode_currency);
          }}
        />
        {canCreate && (
          <PrimaryButton
            onClick={() =>
              navigate(
                "/accounting/cash-transaction/foreign-exchange-transaction/add"
              )
            }
          >
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      {filterCurrency && (
        <TableApp
          dataSource={valutaAsingTransaksi}
          columns={columns}
          pagination={pagination}
          onPaginationChange={(page: number, size: number) =>
            getValutaAsingTransaksi(page, size)
          }
        />
      )}
      <Spin spinning={isLoadingModal} fullscreen />

      {isModalOpen && selectedRecord && (
        <Modal
          title={`Transaksi Valuta Asing - ${selectedRecord.nomor_transaksi}`}
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
                      label="Status"
                      id="status"
                      type="text"
                      disabled
                      defaultValue={selectedRecord.status}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                    <InputField
                      label="Nomor Transaksi"
                      id="nomor_transaksi"
                      disabled
                      type="text"
                      defaultValue={selectedRecord.nomor_transaksi}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                    <InputField
                      label="Tanggal Submit"
                      id="tanggal_submit"
                      type="text"
                      disabled
                      defaultValue={formatDate(
                        selectedRecord.tanggal_transaksi
                      )}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                    {isPencairan && (
                      <InputField
                        label="Currency Source"
                        id="currency_source"
                        disabled
                        type="text"
                        defaultValue={
                          selectedRecord.source?.currency?.nama_currency
                        }
                        register={registerForm}
                        errors={errorsForm}
                        validationSchema={{}}
                      />
                    )}
                    {isPembelian && (
                      <InputField
                        label="Currency Destination"
                        id="currency_destination"
                        disabled
                        type="text"
                        defaultValue={
                          selectedRecord.destination?.currency?.nama_currency
                        }
                        register={registerForm}
                        errors={errorsForm}
                        validationSchema={{}}
                      />
                    )}
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsPencairan(value.target.checked);
                      }}
                      disabled
                      defaultChecked={isPencairan}
                      className="custom-checkbox"
                    >
                      {"Pencairan"}
                    </Checkbox>
                  </div>
                  <div></div>
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsPembelian(value.target.checked);
                      }}
                      disabled
                      defaultChecked={isPembelian}
                      className="custom-checkbox"
                    >
                      {"Pembelian"}
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
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
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
                </div>
              </div>
              <div className="p-5">
                <div className="mt-4 flex justify-between items-start">
                  <TableApp
                    dataSource={selectedRecord ? [selectedRecord] : []}
                    columns={columnNominal}
                    pagination={false}
                    scroll={{ x: 500 }}
                  />
                  <div className="flex gap-4 items-center">
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
              </div>
            </form>
          </>
        </Modal>
      )}
    </>
  );
};

export default ForeignExchangeTransaction;
