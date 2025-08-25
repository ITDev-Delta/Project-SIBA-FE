import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getFiscalPeriod } from "../../../../api/Accounting/services/periodService";
import { getTrialBalances } from "../../../../api/Accounting/services/trialBalanceService";
import type {
  ITrialBalance,
  ITrialBalanceResponse,
} from "../../../../api/Accounting/types/trialBalance.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import SelectMonthPicker from "../../../../components/Forms/SelectMonthPicker";
import SelectYearPicker from "../../../../components/Forms/SelectYearPicker";
import TableApp from "../../../../components/Tables/TableApp";
import { formatCurrency } from "../../../../utils/format_currency";

const TrialBalance: React.FC = () => {
  const [tahun, setTahun] = useState<string>();
  const [error, setError] = useState<string>();
  const [error2, setError2] = useState<string>();
  const [error3, setError3] = useState<string>();
  const [bulanAwal, setBulanAwal] = useState<any>({
    nama: "",
    kode: "",
  });
  const [bulanAkhir, setBulanAkhir] = useState<any>({
    nama: "",
    kode: "",
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);

  const [periods, setPeriods] = useState<string[]>([]);

  const [trialBalance, setTrialBalance] = useState<ITrialBalanceResponse>();
  const [trialBalanceData, setTrialBalanceData] = useState<any[]>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [tableKey, setTableKey] = useState<number>(0);
  const [generatedAt, setGeneratedAt] = useState<string>();

  const handleExpand = (expanded: boolean, record: any) => {
    console.log("expanded", trialBalanceData);
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

      collectKeys(trialBalanceData ?? []);
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

  const getTrialBalanceTable = (
    tahun: string,
    bulanAwal: string,
    bulanAkhir: string
  ): void => {
    setIsLoading(true);
    const promise = getTrialBalances(tahun, bulanAwal, bulanAkhir);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          setTrialBalance(res.data.data);
          setTrialBalanceData(buildTableData(res.data.data));
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

  // Format angka dengan separator ribuan

  // Fungsi untuk membangun data tabel dari JSON hierarchical
  const buildTableData = (data: ITrialBalanceResponse) => {
    const tableData: any[] = [];

    data.trial_balance.forEach((value, index) => {
      tableData.push({
        id: `kategori-${value.kategori}-${index}`,
        nama_akun: value.kategori,
        isParent: true,
      });
      const proceed = value.data.map((item: ITrialBalance) => {
        const removeEmptyChildren = (item: ITrialBalance) => {
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
          if (reverse) {
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
            total_debit: parent2.total_debit,
            total_kredit: parent2.total_kredit,
            saldo_akhir: null,
            isSummary: true,
          });
        });

        // Menambahkan summary total untuk setiap akun level 1
        tableData.push({
          id: `summary-${parent.id}`,
          nama_akun: `Total  ${parent.kode_akun} - ${parent.nama_akun}`,
          saldo_awal: null,
          kode_akun: parent.kode_akun,
          total_debit: parent.total_debit,
          total_kredit: parent.total_kredit,
          saldo_akhir: null,
          isSummary: true,
        });
      });
      tableData.push({
        id: `summary-${value.kategori}-${index}`,
        nama_akun: `Total ${value.kategori}`,
        saldo_awal: null,
        // kode_akun: parent.kode_akun,
        total_debit: value.total_debit,
        total_kredit: value.total_kredit,
        saldo_akhir: null,
        isSummary: true,
      });
    });
    tableData.push({
      id: `mutasi`,
      nama_akun: `Total Mutasi`,
      saldo_awal: null,
      // kode_akun: parent.kode_akun,
      total_debit: data.total_mutasi.total_debit,
      total_kredit: data.total_mutasi.total_kredit,
      saldo_akhir: null,
      isSummary: true,
    });

    return tableData;
  };

  const columns = (expandedRowKeys: React.Key[]): ColumnsType<any> => [
    {
      title: "Nama Akun",
      dataIndex: "nama_akun",
      key: "nama_akun",
      align: "center",
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
      title: "Saldo Awal",
      dataIndex: "saldo_awal",
      key: "saldo_awal",
      align: "center",
      render: (value: any) => (
        <div className="text-right">{formatCurrency(value ?? 0, true)}</div>
      ),
      children: trialBalance?.tanggal_mulai
        ? [
            {
              title: new Date(trialBalance.tanggal_mulai).toLocaleDateString(
                "id-ID"
              ),
              dataIndex: "saldo_awal",
              key: "saldo_awal",
              align: "center",
              render: (value: number, record: any) => {
                // Avoid rendering for parent node with children
                if (record.isParent || record.isSummary) {
                  return null;
                }

                if (
                  expandedRowKeys.includes(record.id) &&
                  record.children &&
                  record.children.length > 0
                ) {
                  return null;
                }

                return (
                  <div className="text-right">
                    {formatCurrency(value ?? 0, true)}
                  </div>
                );
              },
            },
          ]
        : [],
    },
    {
      title: "Debit",
      dataIndex: "total_debit",
      key: "total_debit",
      align: "center",
      render: (value: number, record: any) => {
        if (record.isParent) {
          return null;
        }
        if (
          expandedRowKeys.includes(record.id) &&
          record.children &&
          record.children.length > 0
        ) {
          return null;
        }

        return (
          <div className="text-right">{formatCurrency(value ?? 0, true)}</div>
        );
      },
    },
    {
      title: "Kredit",
      dataIndex: "total_kredit",
      key: "total_kredit",
      align: "center",
      render: (value: number, record: any) => {
        if (record.isParent) {
          return null;
        }
        if (
          expandedRowKeys.includes(record.id) &&
          record.children &&
          record.children.length > 0
        ) {
          return null;
        }
        return (
          <div className="text-right">{formatCurrency(value ?? 0, true)}</div>
        );
      },
    },
    {
      title: "Saldo Akhir",
      dataIndex: "saldo_akhir",
      key: "saldo_akhir",
      align: "center",
      render: (value: any) => (
        <div className="text-right">{formatCurrency(value ?? 0, true)}</div>
      ),
      children: trialBalance?.tanggal_akhir
        ? [
            {
              title: new Date(trialBalance.tanggal_akhir).toLocaleDateString(
                "id-ID"
              ),
              dataIndex: "saldo_akhir",
              key: "saldo_akhir",
              align: "center",
              render: (value: number, record: any) => {
                if (record.isParent || record.isSummary) {
                  return null;
                }
                if (
                  expandedRowKeys.includes(record.id) &&
                  record.children &&
                  record.children.length > 0
                ) {
                  return null;
                }

                return (
                  <div className="text-right">
                    {formatCurrency(value ?? 0, true)}
                  </div>
                );
              },
            },
          ]
        : [],
    },
  ];

  useEffect(() => {
    getPeriod();
  }, []);

  return (
    <>
      <MyBreadcrumb pageName="Trial Balance" />
      <div className="mb-8"></div>
      <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
        <SelectYearPicker
          label="Tahun"
          placeholder="Pilih Tahun"
          required={!!error}
          defaultValue={tahun}
          yearOptions={periods}
          errors={error}
          onChange={(value: string) => {
            error && setError(undefined);
            setTahun(value);
          }}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-5 ">
          <SelectMonthPicker
            label="Bulan Awal"
            placeholder="Pilih Bulan"
            required={!!error2}
            defaultValue={bulanAwal?.nama}
            onChange={(value: string) => {
              error2 && setError2(undefined);
              setBulanAwal(value);
            }}
            errors={error2}
          />
          <SelectMonthPicker
            label="Bulan Akhir"
            placeholder="Pilih Bulan"
            required={!!error3}
            defaultValue={bulanAkhir?.nama}
            onChange={(value: string) => {
              error3 && setError3(undefined);
              setBulanAkhir(value);
            }}
            errors={error3}
          />
        </div>
        <div className="flex justify-end mt-10">
          <PrimaryButton
            className="mb-10"
            isLoading={isLoading}
            onClick={() => {
              if (!tahun) {
                setError("Tahun harus diisi");
              } else {
                setError(undefined);
              }
              if (bulanAwal.nama === "") {
                setError2("Bulan Awal harus diisi");
              } else {
                setError2(undefined);
              }
              if (bulanAkhir.nama === "") {
                setError3("Bulan Akhir harus diisi");
              } else {
                setError3(undefined);
              }

              if (tahun && bulanAwal.nama !== "" && bulanAkhir.nama !== "") {
                setTrialBalance(undefined);
                setTableKey(0);
                getTrialBalanceTable(tahun, bulanAwal.kode, bulanAkhir.kode);
              }
            }}
            icon={<ArrowPathIcon className="w-5 h-5" />}
          >
            Generate
          </PrimaryButton>
        </div>
        <Spin spinning={isLoadingModal} fullscreen />

        {trialBalance && (
          <div>
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
                  console.log("Opening Balance");

                  const exportToExcel = () => {
                    const worksheet = XLSX.utils.json_to_sheet(
                      trialBalanceData ?? []
                    );
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(
                      workbook,
                      worksheet,
                      "Opening Balance"
                    );
                    XLSX.writeFile(workbook, "OpeningBalance.xlsx");
                  };

                  exportToExcel();
                }}
              >
                Export
              </PrimaryButton>
            </div>
            <PrimaryButton onClick={handleToggleExpandAll}>
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </PrimaryButton>
            <div className="rounded-sm border border-stroke bg-white shadow-default p-10 mt-10">
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                Trial Balance
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                Periode {tahun}
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                {new Date(trialBalance.tanggal_mulai).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "long", year: "numeric" }
                )}{" "}
                -{" "}
                {new Date(trialBalance.tanggal_akhir).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-5 ">
                Generated at {generatedAt}
              </p>
              <TableApp
                key={tableKey}
                columns={columns(expandedRowKeys)}
                dataSource={trialBalanceData}
                rowKey="id"
                expandable={{
                  expandedRowKeys,
                  onExpand: handleExpand,
                }}
                pagination={false}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrialBalance;
