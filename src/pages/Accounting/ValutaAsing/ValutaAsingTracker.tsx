import { Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCurrency } from "../../../api/Accounting/services/currencyService";
import { getServiceValutaAsingTracker } from "../../../api/Accounting/services/valutaAsingService";
import type { ICurrency } from "../../../api/Accounting/types/currency.interface";
import type { IValutaAsingTracker } from "../../../api/Accounting/types/valutaAsing.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import InputField from "../../../components/Forms/InputField";
import SelectDatePicker from "../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";
import { formatCurrency } from "../../../utils/format_currency";
import { formatDate } from "../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../utils/InputCurrencyUtils";

const ValutaAsingTracker: React.FC = () => {
  const {
    setValue: setValueForm,
    getValues: getValuesForm,
    register: registerForm,
    formState: { errors: errorsForm },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Tanggal",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValueForm("tanggal_search", date);
                getValutaAsingTracker(pagination.current, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_transaksi",
          align: "center",
          key: "tanggal_transaksi",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
                {record.tanggal_transaksi
                  ? formatDate(record.tanggal_transaksi)
                  : "-"}
              </div>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.tanggal_transaksi.localeCompare(b.tanggal_transaksi),
    },
    {
      title: "Tipe",
      children: [
        {
          title: (
            <InputField
              id="tipe_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingTracker(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
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
    {
      title: "In / Out",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["In", "Out"]}
              value={""}
              onChange={(value: string) => {
                setValueForm("activity_type_search", value);
                getValutaAsingTracker(pagination.current, pagination.pageSize);
              }}
            />
          ),
          align: "center",
          dataIndex: "activity_type",
          key: "activity_type",
        },
      ],
      align: "center",
      sorter: (a, b) => a.activity_type.localeCompare(b.activity_type),
    },
    {
      title: "Kas / Bank",
      children: [
        {
          title: (
            <InputField
              id="coa_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingTracker(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "source",
          key: "source",
          render: (_: any, record: any) => {
            return <span>{record.coa.nama_akun}</span>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.coa.nama_akun.localeCompare(b.coa.nama_akun),
    },
    {
      title: "Nominal VA",
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
                getValutaAsingTracker(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nominal_asing",
          key: "nominal_asing",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
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
                getValutaAsingTracker(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "kurs",
          key: "kurs",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">{formatCurrency(record.kurs)}</div>
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
                getValutaAsingTracker(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "nominal_rupiah",
          key: "nominal_rupiah",
          render: (_: any, record: any) => {
            return (
              <div className="text-right">
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
      title: "Nomor Reference",
      children: [
        {
          title: (
            <InputField
              id="reference_document_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getValutaAsingTracker(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "reference_document",
          key: "reference_document",
        },
      ],
      align: "center",
      sorter: (a, b) =>
        a.reference_document.localeCompare(b.reference_document),
    },
  ];

  const [valutaAsingTransaksi, setvalutaAsingTransaksi] = useState<
    IValutaAsingTracker[]
  >([]);
  const [currency, setCurrency] = useState<ICurrency[]>([]);

  const [filterCurrency, setFilterCurrency] = useState<ICurrency>();
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const getValutaAsingTracker = (
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
      tanggal: getValuesForm("tanggal_search"),
      jenis_transaksi: getValuesForm("tipe_search"),
      activity_type: getValuesForm("activity_type_search"),
      coa: getValuesForm("coa_search"),
      nominal_asing:
        getValuesForm("nominal_asing_search")?.replace(/,/g, "") || "",
      kurs: getValuesForm("kurs_search")?.replace(/,/g, "") || "",
      nominal_rupiah:
        getValuesForm("nominal_rupiah_search")?.replace(/,/g, "") || "",
      reference_document: getValuesForm("reference_document_search"),
    };

    const promise = getServiceValutaAsingTracker(params);

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
    getValutaAsingTracker(1, 10);
    getCurrencys();
  }, []);

  return (
    <>
      <div className="mb-4">
        <MyBreadcrumb pageName="Ledger" />
      </div>
      <div className="mb-8">
        <SelectGroupField
          label="Currency"
          options={currency}
          value={filterCurrency}
          className="w-1/3"
          onChange={(value: ICurrency) => {
            setFilterCurrency(value);
            getValutaAsingTracker(1, 10, value.kode_currency);
          }}
        />
      </div>
      {filterCurrency && (
        <TableApp
          dataSource={valutaAsingTransaksi}
          columns={columns}
          pagination={pagination}
          onPaginationChange={(page: number, size: number) =>
            getValutaAsingTracker(page, size)
          }
        />
      )}
      <Spin spinning={isLoadingModal} fullscreen />
    </>
  );
};

export default ValutaAsingTracker;
