import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { getCurrency } from "../../../../api/Accounting/services/currencyService";
import {
  getServiceExchangeRate,
  postServiceExchangeRate,
} from "../../../../api/Accounting/services/exchangeRateServiceKMK";
import type { ICurrency } from "../../../../api/Accounting/types/currency.interface";
import type { IExchangeRateKMK } from "../../../../api/Accounting/types/exchageRateKMK.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
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

const ExchangeRateKMK: React.FC = () => {
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

  const canCreate = hasPermission("exchange-rate-create");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tanggal Awal Periode",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValueForm("tanggal_awal_search", date);
                getExchangeRate(pagination.current, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_awal",
          align: "right",
          key: "tanggal_awal",
          render: (tanggal_awal) =>
            tanggal_awal ? formatDate(tanggal_awal) : "-",
        },
      ],
      align: "center",
      sorter: (a, b) => a.tanggal_awal.localeCompare(b.tanggal_awal),
    },
    {
      title: "Tanggal Akhir Periode",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValueForm("tanggal_akhir_search", date);
                getExchangeRate(pagination.current, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_akhir",
          align: "right",
          render: (tanggal_akhir) =>
            tanggal_akhir ? formatDate(tanggal_akhir) : "-",
        },
      ],
      align: "center",
      sorter: (a, b) => a.tanggal_akhir.localeCompare(b.tanggal_akhir),
    },
    {
      title: "Kurs Jual",
      children: [
        {
          title: (
            <InputField
              id="kurs_jual_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getExchangeRate(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "kurs_jual",
          key: "kurs_jual",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
                {formatCurrency(record.kurs_jual)}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.kurs_jual.replace(/,/g, "")) -
        parseFloat(b.kurs_jual.replace(/,/g, "")),
    },
    {
      title: "Kurs Beli",
      children: [
        {
          title: (
            <InputField
              id="kurs_beli_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getExchangeRate(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "kurs_beli",
          key: "kurs_beli",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
                {formatCurrency(record.kurs_beli)}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.kurs_beli.replace(/,/g, "")) -
        parseFloat(b.kurs_beli.replace(/,/g, "")),
    },
    {
      title: "Kurs Tengah",
      children: [
        {
          title: (
            <InputField
              id="kurs_tengah_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              style={{ textAlign: "right" }}
              onSearch={(_) =>
                getExchangeRate(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "kurs_tengah",
          key: "kurs_tengah",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
                {formatCurrency(record.kurs_tengah)}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.kurs_tengah.replace(/,/g, "")) -
        parseFloat(b.kurs_tengah.replace(/,/g, "")),
    },
  ];

  const [exchangRate, setExchangRate] = useState<IExchangeRateKMK[]>([]);
  const [currency, setCurrency] = useState<ICurrency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency>();
  const [selectedTanggalAwal, setSelectedTanggalAwal] = useState<string>("");
  const [selectedTanggalAkhir, setSelectedTanggalAkhir] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalWarningOpen, setIsModalWarningOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorTanggalAwal, setErrorTanggalAwal] = useState<string>("");
  const [errorTanggalAkhir, setErrorTanggalAkhir] = useState<string>("");

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTanggalAwal("");
    setSelectedTanggalAkhir("");
    resetForm();
    setErrorTanggalAwal("");
    setErrorTanggalAkhir("");
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedTanggalAwal) {
      setErrorTanggalAwal("Tanggal Awal harus diisi!");
      return;
    }

    if (!selectedTanggalAkhir) {
      setErrorTanggalAkhir("Tanggal Akhir harus diisi!");
      return;
    }

    // validasi urutan tanggal
    const awal = new Date(selectedTanggalAwal);
    const akhir = new Date(selectedTanggalAkhir);

    if (awal >= akhir) {
      setErrorTanggalAwal("Tanggal Awal harus sebelum dari Tanggal Akhir!");
      return;
    }

    setIsLoading(true);

    const payload = {
      currency_id: selectedCurrency?.id,
      tanggal_awal: selectedTanggalAwal,
      tanggal_akhir: selectedTanggalAkhir,
      kurs_jual: data.kurs_jual.replace(/,/g, ""),
      kurs_beli: data.kurs_beli.replace(/,/g, ""),
      kurs_tengah: data.kurs_tengah.replace(/,/g, ""),
    };

    await postServiceExchangeRate(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          toast.success(res.data.message);
          getExchangeRate(pagination.current, pagination.pageSize);
          resetForm();
          setIsModalWarningOpen(false);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error("Failed to submit data");
        }
      })
      .catch((_) => {
        setIsLoading(false);
        toast.error("Terjadi kesalahan saat mensubmit data");
      });
  };

  const getExchangeRate = (
    page: number,
    pageSize: number,
    currency_id?: number
  ): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page,
      per_page: pageSize,
      tanggal_awal:
        getValuesForm("tanggal_awal_search")?.replace(/,/g, "") || "",
      tanggal_akhir:
        getValuesForm("tanggal_akhir_search")?.replace(/,/g, "") || "",
      kurs_jual: getValuesForm("kurs_jual_search")?.replace(/,/g, "") || "",
      kurs_beli: getValuesForm("kurs_beli_search")?.replace(/,/g, "") || "",
      kurs_tengah: getValuesForm("kurs_tengah_search")?.replace(/,/g, "") || "",
      currency_id: currency_id || selectedCurrency?.id,
    };

    const promise = getServiceExchangeRate(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setExchangRate(res.data.data.data);
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
        toast.error(
          err?.response?.data?.message || "Gagal memuat Exchange Rate!"
        );
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
        console.log("err", err, isLoading);
        toast.error(err?.response?.data?.message || "Gagal memuat currency!");
      });
  };

  useEffect(() => {
    getCurrencys();
  }, []);

  return (
    <>
      <MyBreadcrumb pageName="Exchange Rate" />
      <SelectGroupField
        label="Currency"
        options={currency}
        value={selectedCurrency}
        className="w-1/3"
        onChange={(value: ICurrency) => {
          setSelectedCurrency(value);
          getExchangeRate(1, pagination.pageSize, Number(value.id));
        }}
      />

      {selectedCurrency && (
        <div className="mt-4">
          {canCreate && (
            <PrimaryButton
              className="mb-4"
              onClick={() => setIsModalOpen(true)}
            >
              Tambah Data
            </PrimaryButton>
          )}
          <TableApp
            dataSource={exchangRate}
            columns={columns}
            pagination={pagination}
            onPaginationChange={(page: number, size: number) =>
              getExchangeRate(page, size)
            }
          />
        </div>
      )}
      <Spin spinning={isLoadingModal} fullscreen />

      {isModalOpen && (
        <Modal
          title={
            <>
              <>Edit Currency Setup</>
              <div className="flex gap-4 justify-end mt-5">
                <PrimaryButton onClick={() => setIsModalWarningOpen(true)}>
                  Submit
                </PrimaryButton>
              </div>
            </>
          }
          open={isModalOpen}
          onOk={handleSubmitForm(onSubmit)}
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
            <form
              onSubmit={handleSubmitForm(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6 ">
                    <SelectDatePicker
                      label="Tanggal Awal Periode"
                      errors={errorTanggalAwal}
                      onChange={(e) => {
                        setSelectedTanggalAwal(e);
                        setErrorTanggalAwal("");
                      }}
                      required
                    />
                    <SelectDatePicker
                      label="Tanggal Akhir Periode"
                      errors={errorTanggalAkhir}
                      onChange={(e) => {
                        setSelectedTanggalAkhir(e);
                        setErrorTanggalAkhir("");
                      }}
                      required
                    />
                    <InputField
                      label="Currency"
                      id="currency"
                      type="text"
                      disabled
                      defaultValue={selectedCurrency?.nama_currency}
                      register={registerForm}
                      errors={errorsForm}
                      validationSchema={{}}
                    />
                  </div>
                </div>
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  <InputField
                    label="Kurs Jual"
                    id="kurs_jual"
                    type="text"
                    register={registerForm}
                    errors={errorsForm}
                    onKeyDown={handleKeyDown}
                    validationSchema={{
                      required: "Kurs Jual harus diisi!",
                    }}
                    style={{
                      textAlign: "right",
                    }}
                    onChange={(e) => {
                      handleInputChange(e);
                      const value = e.target.value.replace(/,/g, "");
                      const kurs_beli = getValuesForm("kurs_beli").replace(
                        /,/g,
                        ""
                      );

                      if (!value || !kurs_beli) {
                        setValueForm("kurs_tengah", 0);
                        return;
                      }

                      const kurs_tengah =
                        (Number(value) + Number(kurs_beli)) / 2;

                      setValueForm("kurs_tengah", formatCurrency(kurs_tengah));
                    }}
                  />
                  <InputField
                    label="Kurs Beli"
                    id="kurs_beli"
                    type="text"
                    register={registerForm}
                    errors={errorsForm}
                    onKeyDown={handleKeyDown}
                    style={{
                      textAlign: "right",
                      direction: "ltr",
                    }}
                    validationSchema={{
                      required: "Kurs Beli harus diisi!",
                    }}
                    onChange={(e) => {
                      handleInputChange(e);
                      const value = e.target.value.replace(/,/g, "");
                      const kurs_jual = getValuesForm("kurs_jual").replace(
                        /,/g,
                        ""
                      );

                      if (!value || !kurs_jual) {
                        setValueForm("kurs_tengah", 0);
                        return;
                      }

                      const kurs_tengah =
                        (Number(value) + Number(kurs_jual)) / 2;

                      setValueForm("kurs_tengah", formatCurrency(kurs_tengah));
                    }}
                  />
                  <InputField
                    label="Kurs Tengah"
                    id="kurs_tengah"
                    type="text"
                    disabled
                    register={registerForm}
                    errors={errorsForm}
                    validationSchema={{}}
                  />
                </div>
              </div>
            </form>
          </>
        </Modal>
      )}

      {isModalWarningOpen && (
        <Modal
          open={isModalWarningOpen}
          onOk={handleSubmitForm(onSubmit)}
          onCancel={() => setIsModalWarningOpen(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          width={600}
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi</h2>
            <p>Apakah Anda yakin ingin menyimpan data ini?</p>
            <div className="flex gap-4 justify-end mt-5">
              <PrimaryButton
                outlined
                onClick={() => setIsModalWarningOpen(false)}
              >
                Batal
              </PrimaryButton>
              <PrimaryButton
                onClick={handleSubmitForm(onSubmit)}
                isLoading={isLoading}
              >
                Ya, Simpan
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ExchangeRateKMK;
