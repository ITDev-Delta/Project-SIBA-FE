import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import { getCoaTransaction } from "../../../../api/Accounting/services/coaSevice";
import { getGeneralLedger } from "../../../../api/Accounting/services/generalLedgerService";
import type { ICoa } from "../../../../api/Accounting/types/coa.interface";
import type { IGeneralLedger } from "../../../../api/Accounting/types/generalLedger.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import SelectRangePicker from "../../../../components/Forms/SelectRangePicker";
import TableApp from "../../../../components/Tables/TableApp";
import { formatCurrency } from "../../../../utils/format_currency";
import { formatDate } from "../../../../utils/format_date";

const GeneralLedger: React.FC = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm({});

  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 0,
  // });

  const columns: ColumnsType<any> = [
    {
      title: "Bulan",
      dataIndex: "bulan",
      key: "bulan",
      render: (text: string, _: any, index: number) => ({
        children: text,
        props: { rowSpan: getRowSpan(dataGeneralLedger, "bulan", index) },
      }),
      align: "center",
    },
    {
      title: "Tanggal",
      dataIndex: "tanggal_journal",
      key: "tanggal_journal",
      render: (text: string, _: any, index: number) => ({
        children: <div className="text-right">{formatDate(text)}</div>,
        props: {
          rowSpan: getRowSpan(dataGeneralLedger, "tanggal_journal", index),
        },
      }),
      align: "center",
    },
    {
      title: "No. Journal",
      dataIndex: "nomor_journal",
      key: "nomor_journal",
      align: "center",
      render: (text: any) => <div className="text-left">{text ?? "-"}</div>,
    },
    {
      title: "No. Transaksi",
      dataIndex: "nomor_transaksi",
      key: "nomor_transaksi",
      align: "center",
      render: (text: any) => <div className="text-left">{text ?? "-"}</div>,
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      align: "center",
      key: "deskripsi",
      render: (text: any) => <div className="text-left">{text ?? "-"}</div>,
    },
    {
      title: "Debit",
      align: "center",
      dataIndex: "debit",
      key: "debit",
      render: (debit: string) => (
        <div className="text-right">{formatCurrency(debit, true)}</div>
      ),
    },
    {
      title: "Kredit",
      dataIndex: "kredit",
      key: "kredit",
      render: (kredit: string) => (
        <div className="text-right">{formatCurrency(kredit, true)}</div>
      ),
      align: "center",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance: string) => (
        <div className="text-right">{formatCurrency(balance, true)}</div>
      ),
      align: "center",
    },
  ];

  const getRowSpan = (data: any[], field: string, index: number) => {
    if (index === 0 || data[index - 1][field] !== data[index][field]) {
      return data.filter((item) => item[field] === data[index][field]).length;
    }
    return 0;
  };

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableKey, setTableKey] = useState<number>(0);
  const [accounts, setAccounts] = useState<ICoa[]>([]);
  const [dataGeneralLedger, setDataGeneralLedger] = useState<any>();
  const [generalLedger, setGeneralLedger] = useState<IGeneralLedger>();
  const [selectedAccount, setSelectedAccount] = useState<ICoa>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [error, setError] = useState<string>();

  const getGeneralLedgerTable = (
    coa_id: string,
    startDate: string,
    endDate: string
  ): void => {
    setIsLoading(true);
    setIsLoadingModal(true);
    const params = {
      coa_id: coa_id,
      tanggal_mulai: startDate,
      tanggal_akhir: endDate,
      // is_pagination: true,
      // page: page,
      // per_page: pageSize,
    };

    const promise = getGeneralLedger(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          setIsLoadingModal(false);
          setGeneralLedger(res.data.data);
          setTableKey((prev) => prev + 1);
          setValue(
            "saldo_awal",
            Intl.NumberFormat("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(res.data.data.saldo_awal ?? 0))
          );
          setValue(
            "saldo_akhir",
            Intl.NumberFormat("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(res.data.data.saldo_akhir ?? 0))
          );

          handleDataTable(res.data.data);
          // setPagination({
          //   current: page,
          //   pageSize: pageSize,
          //   total: res.data.data.total,
          // });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getCoaTrans = (): void => {
    setIsLoadingModal(true);
    // get by level : 1
    const promise = getCoaTransaction();

    promise
      .then((res) => {
        console.log("res", res);
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          let data = res.data.data as ICoa[];
          data = [
            ...data.filter((item) => item.level != "1" && item.level != "2"),
          ];
          setAccounts(data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const handleDataTable = (transaksiData: IGeneralLedger) => {
    const data = Object.entries(transaksiData.transaksi).flatMap(
      ([bulan, transaksi], index) =>
        transaksi.map((item: any, i: number) => ({
          key: item.nomor_transaksi || `${index}-${i}`,
          bulan, // Menyimpan bulan sebagai field dalam data
          ...item,
        }))
    );
    console.log("🚀 ~ handleDataTable ~ dataGeneral:", data);
    const sortedData = data.sort(
      (a, b) =>
        new Date(a.tanggal_journal).getTime() -
        new Date(b.tanggal_journal).getTime()
    );

    setDataGeneralLedger(sortedData);
    setTableKey((prev) => prev + 1);
  };

  useEffect(() => {
    getCoaTrans();
  }, []);

  useEffect(() => {
    console.log("Updated dataGeneralLedger:", dataGeneralLedger);
  }, [dataGeneralLedger]);

  return (
    <>
      <MyBreadcrumb pageName="General Ledger" />
      <div className="mb-8"></div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
        <div>
          <Spin spinning={isLoadingModal} fullscreen />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2  md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-5 ">
            <SelectGroupField
              label="Account"
              options={accounts}
              value={selectedAccount}
              onChange={(value: ICoa) => {
                console.log("value", value);
                setSelectedAccount(value);
              }}
            />
            <SelectRangePicker
              label="Rentang Tanggal"
              placeholder={["Tanggal Mulai", "Tanggal Akhir"]}
              required
              onChange={(startDate: string, endDate: string) => {
                if (startDate !== "" && endDate !== "") {
                  setError(undefined);
                }
                setStartDate(startDate);
                setEndDate(endDate);
              }}
              errors={error}
            />
            {generalLedger && (
              <>
                <InputField
                  label="Saldo Awal"
                  id="saldo_awal"
                  type="text"
                  placeholder="Saldo Awal"
                  disabled
                  defaultValue={Intl.NumberFormat("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(generalLedger.saldo_awal ?? 0))}
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Saldo Akhir"
                  id="saldo_akhir"
                  type="text"
                  disabled
                  placeholder="Saldo Akhir"
                  defaultValue={Intl.NumberFormat("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(generalLedger.saldo_akhir ?? 0))}
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
              </>
            )}
          </div>
          {selectedAccount && (
            <PrimaryButton
              className="mt-10"
              isLoading={isLoading}
              onClick={() => {
                if (!startDate || !endDate) {
                  setError("Rentang Tanggal harus diisi!");
                  return;
                }
                getGeneralLedgerTable(
                  selectedAccount.id.toString(),
                  startDate,
                  endDate
                );
              }}
              icon={<ArrowPathIcon className="w-5 h-5" />}
            >
              Proses
            </PrimaryButton>
          )}
          {dataGeneralLedger && generalLedger && (
            <>
              <div className="flex gap-2 my-10">
                <PrimaryButton
                  onClick={() => {
                    window.print();
                  }}
                  icon={<PrinterIcon className="w-5 h-5" />}
                >
                  Print
                </PrimaryButton>
                <PrimaryButton
                  outlined
                  icon={<DocumentArrowDownIcon className="w-5 h-5" />}
                  onClick={() => {
                    const exportToExcel = () => {
                      const worksheet =
                        XLSX.utils.json_to_sheet(dataGeneralLedger);
                      const workbook = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(
                        workbook,
                        worksheet,
                        "Genera Ledger"
                      );
                      XLSX.writeFile(workbook, "GeneralLedger.xlsx");
                    };

                    exportToExcel();
                  }}
                >
                  Export
                </PrimaryButton>
              </div>
              <TableApp
                key={tableKey}
                columns={columns}
                dataSource={dataGeneralLedger}
                // pagination={pagination}
                // onPaginationChange={(page: number, size: number) => {
                //   if (selectedAccount && startDate && endDate) {
                //     getGeneralLedgerTable(
                //       selectedAccount.id.toString(),
                //       startDate,
                //       endDate,
                //       page,
                //       size
                //     );
                //   }
                // }}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={3} colSpan={5}>
                      <div className="flex justify-end mr-10">
                        <strong>Total</strong>
                      </div>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <strong>
                        {Number(
                          generalLedger.total_mutasi.debit
                        ).toLocaleString("id-ID")}
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="right">
                      <strong>
                        {Number(
                          generalLedger.total_mutasi.kredit
                        ).toLocaleString("id-ID")}
                      </strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GeneralLedger;
