import { Checkbox, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createServiceValutaAsingTransaksi,
  getServicePaymentSourceValutaAsingTransaksi,
} from "../../../../api/Accounting/services/valutaAsingService";
import type { IPaymentSources } from "../../../../api/Master/types/paymentSources.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputAreaField from "../../../../components/Forms/InputAreaField";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../components/Tables/TableApp";
import { formatCurrency } from "../../../../utils/format_currency";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";

const ForeignExchangeTransactionForm: React.FC = () => {
  const columnNominal: ColumnsType<any> = [
    {
      title: "Nominal VA",
      align: "center",
      dataIndex: "nominal_asing",
      key: "nominal_asing",
      render: (_: any) => {
        return (
          <InputField
            id="nominal_asing"
            type="text"
            errors={errorsForm}
            register={registerForm}
            onKeyDown={handleKeyDown}
            style={{ textAlign: "right" }}
            validationSchema={{}}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setNominalAsing(value);
              handleInputChange(e);

              const rupiah = Number(value) * Number(kurs);

              setNominalRupiah(rupiah.toString());
            }}
          />
        );
      },
    },
    {
      title: "Kurs",
      align: "center",
      dataIndex: "kurs",
      key: "kurs",
      render: (_: any) => {
        return (
          <InputField
            id="kurs"
            type="text"
            errors={errorsForm}
            register={registerForm}
            onKeyDown={handleKeyDown}
            style={{ textAlign: "right" }}
            validationSchema={{}}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setKurs(value);
              handleInputChange(e);

              const rupiah = Number(value) * Number(nominalAsing);

              setNominalRupiah(rupiah.toString());
            }}
          />
        );
      },
    },
    {
      title: "Nominal Rupiah",
      align: "center",
      dataIndex: "nominal_rupiah",
      key: "nominal_rupiah",
      render: (_: any) => {
        return <span>{formatCurrency(nominalRupiah)}</span>;
      },
    },
  ];
  const navigate = useNavigate();

  const [isPencairan, setIsPencairan] = useState(true);
  const [isPembelian, setIsPembelian] = useState(false);
  const [isBiayaTransaksi, setIsBiayaTransaksi] = useState(false);

  const [paymentSourceAsing, setPaymentSourceAsing] = useState<
    IPaymentSources[]
  >([]);
  const [paymentSourceRupiah, setPaymentSourceRupiah] = useState<
    IPaymentSources[]
  >([]);

  const [selectedSource, setSelectedSource] = useState<IPaymentSources>();
  const [selectedDestination, setSelectedDestination] =
    useState<IPaymentSources>();

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nominalAsing, setNominalAsing] = useState<string>("");
  const [nominalRupiah, setNominalRupiah] = useState<string>("0");
  const [kurs, setKurs] = useState<string>("");

  const [errorSource, setErrorSource] = useState<string>("");
  const [errorDestination, setErrorDestination] = useState<string>("");

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    setValue: setValueForm,
    formState: { errors: errorsForm },
  } = useForm({});

  const getPaymentSource = (): void => {
    setIsLoadingModal(true);

    const promise = getServicePaymentSourceValutaAsingTransaksi();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          const rupiahSource = res.data.data.filter(
            (item: any) => item.status_rupiah
          );
          const asingSource = res.data.data.filter(
            (item: any) => !item.status_rupiah
          );

          setPaymentSourceRupiah(rupiahSource);
          setPaymentSourceAsing(asingSource);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoadingModal);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedSource) {
      setErrorSource("Source harus dipilih!");
      return;
    }

    if (!selectedDestination) {
      setErrorDestination("Destination harus dipilih!");
      return;
    }

    if (!nominalAsing || nominalAsing === "0") {
      toast.error("Nominal Asing harus diisi!");
      return;
    }

    if (!kurs || kurs === "0") {
      toast.error("Kurs harus diisi!");
      return;
    }

    setIsLoading(true);

    const payload = {
      transaction_type: isPencairan ? "pencairan" : "pembelian",
      source_id: selectedSource?.id,
      destination_id: selectedDestination?.id,
      nominal_asing: nominalAsing,
      kurs: kurs,
      nominal_rupiah: nominalRupiah,
      keterangan: data.keterangan,
      tanggal_transaksi: new Date().toISOString().split("T")[0],
      biaya_transaksi: isBiayaTransaksi
        ? data.biaya_transaksi.replace(/,/g, "")
        : null,
    };

    console.log(payload);

    const promise = createServiceValutaAsingTransaksi(payload);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          navigate("/accounting/cash-transaction/foreign-exchange-transaction");
          toast.success(res.data.message || "Berhasil Mensubmit Valuta Asing!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getPaymentSource();
  }, []);
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb
          pageName="Foreign Exchange Transaction"
          link="/accounting/cash-transaction/foreign-exchange-transaction"
          session="Tambah Data"
        />
        <PrimaryButton
          onClick={handleSubmitForm(onSubmit)}
          isLoading={isLoading}
        >
          Submit
        </PrimaryButton>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form
          onSubmit={handleSubmitForm(onSubmit)}
          encType="multipart/form-data"
        >
          <div className="flex flex-col md:flex-row">
            {/* Section 1 */}
            <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6 ">
                <InputField
                  label="Status"
                  id="status"
                  disabled
                  type="text"
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{}}
                />
                <InputField
                  label="Nomor Transaksi"
                  id="nomor_transaksi"
                  disabled
                  type="text"
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{}}
                />
                <InputField
                  label="Tanggal Submit"
                  id="tanggal_submit"
                  type="text"
                  disabled
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
                    register={registerForm}
                    errors={errorsForm}
                    validationSchema={{}}
                  />
                )}
              </div>
            </div>
            {/* Divider */}
            <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
            {/* Section 2 */}
            <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
              <div>
                <Checkbox
                  onChange={(value) => {
                    setIsPencairan(value.target.checked);
                    setIsPembelian(false);

                    setSelectedSource(undefined);
                    setSelectedDestination(undefined);
                  }}
                  defaultChecked={isPencairan}
                  checked={isPencairan}
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
                    setIsPencairan(false);

                    setSelectedSource(undefined);
                    setSelectedDestination(undefined);
                  }}
                  defaultChecked={isPembelian}
                  checked={isPembelian}
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
                  options={
                    isPencairan ? paymentSourceAsing : paymentSourceRupiah
                  }
                  value={selectedSource}
                  error={errorSource}
                  onChange={(value: IPaymentSources) => {
                    setSelectedSource(value);
                    setErrorSource("");
                    setValueForm(
                      "currency_source",
                      value?.currency.nama_currency
                    );
                  }}
                />
              </div>
            </div>
            <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
            <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
              <SelectGroupField
                label="Destination"
                options={isPencairan ? paymentSourceRupiah : paymentSourceAsing}
                value={selectedDestination}
                error={errorDestination}
                onChange={(value: IPaymentSources) => {
                  setSelectedDestination(value);
                  setErrorDestination("");
                  setValueForm(
                    "currency_destination",
                    value?.currency.nama_currency
                  );
                }}
              />
            </div>
          </div>
          <div className="p-5 mt-4 flex justify-between items-start">
            <TableApp
              dataSource={[
                {
                  nominal_asing: nominalAsing,
                  kurs: kurs,
                  nominal_rupiah: nominalRupiah,
                },
              ]}
              columns={columnNominal}
              scroll={{ x: 500 }}
              pagination={false}
            />
            <div className="flex gap-4 items-center">
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
        <Spin spinning={isLoadingModal} fullscreen />
      </div>
    </>
  );
};

export default ForeignExchangeTransactionForm;
