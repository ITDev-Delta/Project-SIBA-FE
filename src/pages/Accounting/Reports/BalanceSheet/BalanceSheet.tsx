import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { getBalanceSheet } from "../../../../api/Accounting/services/balanceSheetService";
import { getFiscalPeriod } from "../../../../api/Accounting/services/periodService";
import type {
  IBalanceSheet,
  IBalanceSheetResponse,
} from "../../../../api/Accounting/types/balanceSheet.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import SelectMonthPicker from "../../../../components/Forms/SelectMonthPicker";
import SelectYearPicker from "../../../../components/Forms/SelectYearPicker";
import TableApp from "../../../../components/Tables/TableApp";
import { EnumReport } from "../../../../constant/report_enum";
import { formatCurrency } from "../../../../utils/format_currency";
import { toPascalCase } from "../../../../utils/format_text";

const BalanceSheet: React.FC = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);

  const [periods, setPeriods] = useState<string[]>([]);

  const [balanceSheet, setBalanceSheet] = useState<IBalanceSheetResponse>();
  const [balanceSheetData, setBalanceSheetData] = useState<any[]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [tableKey, setTableKey] = useState<number>(0);
  const [generatedAt, setGeneratedAt] = useState<string>();

  const [selectedBulan, setSelectedBulan] = useState<any>();
  const [selectedTahun, setSelectedTahun] = useState<string>();
  const [tahunAwal, setTahunAwal] = useState<string>();
  const [tahunAkhir, setTahunAkhir] = useState<string>();
  const [bulanAwal, setBulanAwal] = useState<any>();
  const [bulanAkhir, setBulanAkhir] = useState<any>();

  const [errorBulan, setErrorBulan] = useState<string>();
  const [errorTahun, setErrorTahun] = useState<string>();
  const [errorBulanAwal, setErrorBulanAwal] = useState<string>();
  const [errorBulanAkhir, setErrorBulanAkhir] = useState<string>();
  const [errorTahunAwal, setErrorTahunAwal] = useState<string>();
  const [errorTahunAkhir, setErrorTahunAkhir] = useState<string>();

  const [selectedReport, setSelectedReport] = useState<EnumReport>();

  const reports = [
    EnumReport.SingleMonth,
    EnumReport.ComparativeMonth,
    EnumReport.ComparativeYear,
  ];

  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedRowKeys((prev) => {
      if (expanded) {
        return [...prev, record.id];
      } else {
        return prev.filter((key) => key !== record.id);
      }
    });
  };

  const handleToggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedRowKeys([]);
    } else {
      const allKeys: React.Key[] = [];

      const collectKeys = (nodes: any[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.id);
          if (node.children && node.children.length > 0) {
            collectKeys(node.children);
          }
        });
      };

      collectKeys(balanceSheetData ?? []);
      setExpandedRowKeys(allKeys);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const getPeriod = (): void => {
    setIsLoadingModal(true);
    // get by level : 1
    const promise = getFiscalPeriod();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          // filter period yang status === "Inactive"
          const period = res.data.data.filter(
            (item: any) => item.status !== "Inactive"
          );

          const getYearsInRange = (
            startDate: Date,
            endDate: Date
          ): number[] => {
            const years = [];
            let currentYear = startDate.getFullYear();
            const endYear = endDate.getFullYear();

            while (currentYear <= endYear) {
              years.push(currentYear);
              currentYear++;
            }
            return years;
          };

          const periodTahun = period.flatMap((item: any) => {
            const start = new Date(item.tanggal_mulai);
            const end = new Date(item.tanggal_berakhir);
            return getYearsInRange(start, end);
          });

          const tahunUnik = Array.from(
            new Set(periodTahun.map((year: number) => year.toString()))
          );

          setPeriods(tahunUnik as string[]);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getBalanceSheetTable = (): void => {
    setIsLoading(true);
    const promise = getBalanceSheet(
      (selectedReport as string).toLowerCase().replace(/ /g, "_"),
      selectedBulan?.kode ?? null,
      selectedTahun,
      bulanAwal?.kode ?? null,
      bulanAkhir?.kode ?? null,
      tahunAwal,
      tahunAkhir
    );

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          setBalanceSheet(res.data.data);
          setBalanceSheetData(buildTableData(res.data.data));
          setGeneratedAt(
            new Date().toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
          );
          setTableKey((prev) => prev + 1);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  const buildTableData = (data: IBalanceSheetResponse) => {
    const tableData: any[] = [];

    data.balance_sheet.forEach((value, index) => {
      tableData.push({
        id: `kategori-${value.kategori}-${index}`,
        nama_akun: value.kategori,
        isParent: true,
      });
      const proceed = value.data.map((item: IBalanceSheet) => {
        const removeEmptyChildren = (item: IBalanceSheet) => {
          if (item.children?.length === 0) {
            delete item.children;
          } else {
            item.children = item.children?.map(removeEmptyChildren);
          }
          return item;
        };

        return removeEmptyChildren(item);
      });

      proceed.forEach((parent: any) => {
        const traverse = (node: any, reverse: boolean) => {
          if (reverse === true) {
            tableData.push({
              id: `parent-${node.id}`,
              nama_akun: `${node.kode_akun} - ${node.nama_akun}`,
              kode_akun: node.kode_akun,
              level: node.level,
              isParent: true,
            });

            node.children?.forEach((child: any) => {
              tableData.push(child);
              traverse(child, false);
            });
          }

          return tableData[tableData.length - 1];
        };

        traverse(parent, true);

        parent.children?.forEach((parent2: any) => {
          tableData.push({
            id: `summary-${parent2.id}`,
            nama_akun: `Total ${parent2.kode_akun} - ${parent2.nama_akun}`,
            kode_akun: parent2.kode_akun,
            saldo_awal: null,
            total_debit: null,
            total_kredit: null,
            saldo_akhir: parent2.saldo_akhir,
            periode: parent2.periode,
            isSummary: true,
          });
        });

        // Menambahkan summary total untuk setiap akun level 1
        tableData.push({
          id: `summary-${parent.id}`,
          nama_akun: `Total  ${parent.kode_akun} - ${parent.nama_akun}`,
          saldo_awal: null,
          kode_akun: parent.kode_akun,
          total_debit: null,
          total_kredit: null,
          saldo_akhir: parent.saldo_akhir,
          periode: parent.periode,
          isSummary: true,
        });
      });
      tableData.push({
        id: `summary-${value.kategori}-${index}`,
        nama_akun: `Total ${value.kategori}`,
        saldo_awal: null,
        total_debit: null,
        total_kredit: null,
        saldo_akhir: value.saldo_akhir ?? value.data[index].saldo_akhir,
        periode: value.periode ?? value.data[index].periode,
        isSummary: true,
      });
    });

    return tableData;
  };

  const columnsBalanceSheet = (
    expandedRowKeys: React.Key[],
    dataPL: IBalanceSheetResponse
  ): ColumnsType<any> => [
    {
      title: "Account",
      dataIndex: "nama_akun",
      key: "nama_akun",
      align: "center",
      width: dataPL.type === "single_month" ? undefined : "40%",
      render: (text: any, record: any) => (
        <p
          style={
            record.isSummary ||
            record.level === "1" ||
            record.level === "2" ||
            record.level === "3" ||
            record.isParent
              ? { fontWeight: "bold" }
              : {}
          }
          className={record.isSummary ? "flex justify-end mr-10" : "text-left"}
        >
          {record.isSummary || record.isParent
            ? text
            : `${record.kode_akun} - ${text}`}
        </p>
      ),
    },
    {
      title: "Saldo Akhir",
      align: "center",
      className: "text-center",
      children: (dataPL.periode.list_periode ?? [""]).map(
        (date: string, idx1) => ({
          title: (
            <div className="text-center">
              {getMonthRange(
                dataPL.periode.tahun.length > 1
                  ? Number(dataPL.periode.tahun[idx1])
                  : Number(dataPL.periode.tahun[0]),
                [date.replace(/[0-9\s]/g, "")],
                true
              )}
            </div>
          ),
          className: "text-center",
          dataIndex: "saldo_akhir",
          key: `saldo_akhir`,
          render: (value: number[], record: any) => {
            if (record.isParent) {
              return null;
            }

            // Avoid rendering for parent node with children
            if (
              expandedRowKeys.includes(record.id) &&
              record.children &&
              record.children.length > 0
            ) {
              return null;
            }

            const data = ((record.periode as string[]) ?? []).map(
              (item, idx) => {
                if (date.includes(item)) {
                  return (
                    <div className="text-right">
                      {formatCurrency(value[idx], true)}
                    </div>
                  );
                }
                return null;
              }
            );

            return data;
          },
        })
      ),
    },
  ];

  const getMonthRange = (
    year: number,
    months: string[],
    isTitle?: boolean,
    years?: string[]
  ): string => {
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Cek apakah tahun kabisat
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    // Jumlah hari dalam setiap bulan
    const daysInMonth = [
      31,
      isLeapYear ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];

    const monthNamesWithoutYear = months.map((month) =>
      month.replace(/[0-9\s]/g, "")
    );

    // Konversi nama bulan ke indeks angka
    const monthIndexes = monthNamesWithoutYear
      .map((month) => monthNames.indexOf(month) + 1)
      .sort((a, b) => a - b);

    if (monthIndexes.includes(0)) {
      throw new Error("Nama bulan tidak valid");
    }

    const lastMonth = monthIndexes[monthIndexes.length - 1];

    if (isTitle === true) {
      if (monthNames[lastMonth - 1] === "Januari") {
        return `1 - 31 Januari ${year}`;
      }
      return `1 Januari - ${daysInMonth[lastMonth - 1]} ${
        monthNames[lastMonth - 1] + " " + year
      }`;
    }

    if (years && years.length > 1) {
      return `1 Januari ${years[0]} - ${daysInMonth[lastMonth - 1]} ${
        monthNames[lastMonth - 1] + " " + year
      }`;
    }

    return `1 Januari - ${daysInMonth[lastMonth - 1]} ${
      monthNames[lastMonth - 1] + " " + year
    }`;
  };

  useEffect(() => {
    getPeriod();
  }, []);

  return (
    <>
      <MyBreadcrumb pageName="Balance Sheet" />
      <div className="mb-10"></div>
      <div className="rounded-sm border border-stroke bg-white shadow-default  p-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-5 ">
          <SelectGroupField
            label="Report Type"
            options={reports}
            value={selectedReport as string}
            onChange={(value: string) => {
              setSelectedReport(value as EnumReport);
            }}
          />
          {selectedReport && (
            <>
              {!(
                selectedReport === EnumReport.CumulativeYear ||
                selectedReport === EnumReport.ComparativeYear
              ) && (
                <SelectYearPicker
                  label="Tahun"
                  placeholder="Pilih Tahun"
                  required={!!errorTahun}
                  defaultValue={selectedTahun}
                  yearOptions={periods}
                  errors={errorTahun}
                  onChange={(value: string) => {
                    errorTahun && setErrorTahun(undefined);
                    setSelectedTahun(value);
                  }}
                />
              )}
              {(selectedReport === EnumReport.CumulativeYear ||
                selectedReport === EnumReport.ComparativeYear) && (
                <>
                  <SelectYearPicker
                    label="Tahun Awal"
                    placeholder="Pilih Tahun"
                    required={!!errorTahunAwal}
                    defaultValue={tahunAwal}
                    yearOptions={periods}
                    errors={errorTahunAwal}
                    onChange={(value: string) => {
                      errorTahunAwal && setErrorTahunAwal(undefined);
                      setTahunAwal(value);
                    }}
                  />

                  <SelectYearPicker
                    label="Tahun Akhir"
                    placeholder="Pilih Tahun"
                    required={!!errorTahunAkhir}
                    defaultValue={tahunAkhir}
                    yearOptions={periods}
                    errors={errorTahunAkhir}
                    onChange={(value: string) => {
                      errorTahunAkhir && setErrorTahunAkhir(undefined);
                      setTahunAkhir(value);
                    }}
                  />
                </>
              )}
              {selectedReport !== EnumReport.ComparativeMonth && (
                <SelectMonthPicker
                  label="Bulan"
                  placeholder="Pilih Bulan"
                  required={!!errorBulan}
                  defaultValue={selectedBulan?.nama}
                  onChange={(value: string) => {
                    errorBulan && setErrorBulan(undefined);
                    setSelectedBulan(value);
                  }}
                  errors={errorBulan}
                />
              )}
              {selectedReport === EnumReport.ComparativeMonth && (
                <>
                  <SelectMonthPicker
                    label="Bulan Awal"
                    placeholder="Pilih Bulan"
                    required={!!errorBulanAwal}
                    defaultValue={bulanAwal?.nama}
                    onChange={(value: string) => {
                      errorBulanAwal && setErrorBulanAwal(undefined);
                      setBulanAwal(value);
                    }}
                    errors={errorBulanAwal}
                  />
                  <SelectMonthPicker
                    label="Bulan Akhir"
                    placeholder="Pilih Bulan"
                    required={!!errorBulanAkhir}
                    defaultValue={bulanAkhir?.nama}
                    onChange={(value: string) => {
                      errorBulanAkhir && setErrorBulanAkhir(undefined);
                      setBulanAkhir(value);
                    }}
                    errors={errorBulanAkhir}
                  />
                </>
              )}
            </>
          )}
        </div>
        {selectedReport && (
          <div className="flex justify-end my-10">
            <PrimaryButton
              className="mb-10"
              onClick={() => {
                let hasError = false;

                if (!selectedReport) {
                  toast.error("Report Type is required");
                  hasError = true;
                }

                if (
                  selectedReport !== EnumReport.CumulativeYear &&
                  selectedReport !== EnumReport.ComparativeYear &&
                  !selectedTahun
                ) {
                  setErrorTahun("Tahun is required");
                  hasError = true;
                }

                if (
                  (selectedReport === EnumReport.CumulativeYear ||
                    selectedReport === EnumReport.ComparativeYear) &&
                  !tahunAwal
                ) {
                  setErrorTahunAwal("Tahun Awal is required");
                  hasError = true;
                }

                if (
                  (selectedReport === EnumReport.CumulativeYear ||
                    selectedReport === EnumReport.ComparativeYear) &&
                  !tahunAkhir
                ) {
                  setErrorTahunAkhir("Tahun Akhir is required");
                  hasError = true;
                }

                if (
                  selectedReport !== EnumReport.ComparativeMonth &&
                  !selectedBulan
                ) {
                  setErrorBulan("Bulan is required");
                  hasError = true;
                }

                if (
                  selectedReport === EnumReport.ComparativeMonth &&
                  !bulanAwal
                ) {
                  setErrorBulanAwal("Bulan Awal is required");
                  hasError = true;
                }

                if (
                  selectedReport === EnumReport.ComparativeMonth &&
                  !bulanAkhir
                ) {
                  setErrorBulanAkhir("Bulan Akhir is required");
                  hasError = true;
                }

                if (!hasError) {
                  getBalanceSheetTable();
                }
              }}
              icon={<ArrowPathIcon className="w-5 h-5" />}
              isLoading={isLoading}
            >
              Generate
            </PrimaryButton>
          </div>
        )}
        <Spin spinning={isLoadingModal} fullscreen />
        {balanceSheet && balanceSheetData && (
          <>
            <div className="flex justify-between mb-10 ">
              <PrimaryButton onClick={handleToggleExpandAll}>
                {isAllExpanded ? "Collapse All" : "Expand All"}
              </PrimaryButton>
              <div className="flex gap-2 ">
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
                    console.log("Balance Sheet");

                    const exportToExcel = () => {
                      const worksheet =
                        XLSX.utils.json_to_sheet(balanceSheetData);
                      const workbook = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(
                        workbook,
                        worksheet,
                        "Balance Sheet"
                      );
                      XLSX.writeFile(
                        workbook,
                        `BalanceSheet  ${generatedAt
                          ?.split(",")[0]
                          .trim()}.xlsx`
                      );
                    };

                    exportToExcel();
                  }}
                >
                  Export
                </PrimaryButton>
              </div>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                Balance Sheet
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                {toPascalCase(balanceSheet.type.replace(/_/g, " "))}
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                {getMonthRange(
                  Number(
                    balanceSheet.periode.tahun[
                      balanceSheet.periode.tahun.length - 1
                    ]
                  ),
                  balanceSheet.periode.bulan,
                  undefined,
                  balanceSheet.periode.tahun
                )}
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-5 ">
                Generated at {generatedAt}
              </p>
              <TableApp
                key={tableKey}
                dataSource={balanceSheetData}
                columns={columnsBalanceSheet(expandedRowKeys, balanceSheet)}
                rowKey="id"
                expandable={{
                  expandedRowKeys,
                  onExpand: handleExpand,
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BalanceSheet;
