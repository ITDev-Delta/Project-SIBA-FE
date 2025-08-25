import {
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import TableApp from "../../../../components/Tables/TableApp";

import { Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getOpeningBalance } from "../../../../api/Accounting/services/openingBalanceService";
import { getFiscalPeriod } from "../../../../api/Accounting/services/periodService";
import type { IOpeningBalance } from "../../../../api/Accounting/types/opening.balance.interface";
import type { IPeriod } from "../../../../api/Accounting/types/period.interface";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import { formatCurrency } from "../../../../utils/format_currency";
import { formatDate } from "../../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";

const OpeningBalance: React.FC = () => {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
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
      title: "CoA",
      children: [
        {
          title: (
            <InputField
              id="coa_account_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => {
                if (selectedPeriod) {
                  getOpenBalance(
                    selectedPeriod.id.toString(),
                    1,
                    pagination.pageSize
                  );
                } else {
                  getOpenBalance(undefined, 1, pagination.pageSize);
                }
              }}
              validationSchema={{}}
            />
          ),
          dataIndex: "coa_account",
          key: "coa_account",
        },
      ],
      align: "center",
      sorter: (a, b) => a.coa_account.localeCompare(b.coa_account),
    },
    {
      title: "Debit",
      children: [
        {
          title: (
            <InputField
              id="debit_search"
              type="text"
              onKeyDown={handleKeyDown}
              register={register}
              errors={errors}
              onInput={handleInputChange}
              style={{
                textAlign: "right",
              }}
              onSearch={(_) => {
                if (selectedPeriod) {
                  getOpenBalance(
                    selectedPeriod.id.toString(),
                    1,
                    pagination.pageSize
                  );
                } else {
                  getOpenBalance(undefined, 1, pagination.pageSize);
                }
              }}
              validationSchema={{}}
            />
          ),
          dataIndex: "debit",
          key: "debit",
          align: "right",
          render: (value: string) => {
            if (value !== null && value !== "") {
              return formatCurrency(value);
            } else {
              return "-";
            }
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.debit.replace(/,/g, "")) -
        parseFloat(b.debit.replace(/,/g, "")),
    },
    {
      title: "Kredit",
      children: [
        {
          title: (
            <InputField
              id="kredit_search"
              type="text"
              register={register}
              errors={errors}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              onSearch={(_) => {
                if (selectedPeriod) {
                  getOpenBalance(
                    selectedPeriod.id.toString(),
                    1,
                    pagination.pageSize
                  );
                } else {
                  getOpenBalance(undefined, 1, pagination.pageSize);
                }
              }}
              style={{
                textAlign: "right",
              }}
              validationSchema={{}}
            />
          ),
          dataIndex: "kredit",
          key: "kredit",
          align: "right",
          render: (value: string) => {
            if (value !== null && value !== "") {
              return formatCurrency(value);
            } else {
              return "-";
            }
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.kredit.replace(/,/g, "")) -
        parseFloat(b.kredit.replace(/,/g, "")),
    },
    {
      title: "Tanggal Mulai",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_mulai_search", date);
                if (selectedPeriod) {
                  getOpenBalance(
                    selectedPeriod.id.toString(),
                    1,
                    pagination.pageSize
                  );
                } else {
                  getOpenBalance(undefined, 1, pagination.pageSize);
                }
              }}
            />
          ),
          dataIndex: "tanggal_mulai",
          align: "right",
          key: "tanggal_mulai",
          render: (tanggal_mulai: string) => {
            return formatDate(tanggal_mulai);
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        String(a.tanggal_mulai || "").localeCompare(
          String(b.tanggal_mulai || "")
        ),
    },
    {
      title: "Tanggal Berakhir",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_berakhir_search", date);
                if (selectedPeriod) {
                  getOpenBalance(
                    selectedPeriod.id.toString(),
                    1,
                    pagination.pageSize
                  );
                } else {
                  getOpenBalance(undefined, 1, pagination.pageSize);
                }
              }}
            />
          ),
          dataIndex: "tanggal_berakhir",
          align: "right",
          key: "tanggal_berakhir",
          render: (tanggal_berakhir: string) => {
            return formatDate(tanggal_berakhir);
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        String(a.tanggal_berakhir || "").localeCompare(
          String(b.tanggal_berakhir || "")
        ),
    },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [periods, setPeriods] = useState<IPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<IPeriod>();
  const [openBalance, setOpenBalance] = useState<IOpeningBalance[]>([]);

  const getPeriod = (): void => {
    setIsLoading(true);
    // get by level : 1
    const promise = getFiscalPeriod();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);

          // filter period yang status === "Inactive"
          const period = res.data.data.filter(
            (item: any) => item.status !== "Inactive"
          );
          setPeriods(period);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  const getOpenBalance = (
    id: string | undefined,
    page: number,
    pageSize: number
  ): void => {
    setIsLoading(true);

    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      fiscal_period_id: id ?? "",
      coa_account: getValues("coa_account_search"),
      debit: getValues("debit_search").replace(/,/g, ""),
      kredit: getValues("kredit_search").replace(/,/g, ""),
      tanggal_mulai: getValues("tanggal_mulai_search"),
      tanggal_berakhir: getValues("tanggal_berakhir_search"),
    };

    const promise = getOpeningBalance(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          // filter coa_account (ASC)
          const openBalance = (res.data.data.data as IOpeningBalance[]).sort(
            (a: any, b: any) => (a.coa_account > b.coa_account ? 1 : -1)
          );
          setOpenBalance(openBalance);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: res.data.data.total,
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getPeriod();
    getOpenBalance(undefined, 1, pagination.pageSize);
  }, []);

  return (
    <>
      <MyBreadcrumb pageName="Opening Balance" />
      <div className="flex flex-row justify-between mt-5">
        <Spin spinning={isLoading} fullscreen />
        <div className="flex gap-2">
          <SelectGroupField
            options={periods}
            value={selectedPeriod?.nama_periode ?? ""}
            onChange={(value: IPeriod) => {
              setSelectedPeriod(value);
            }}
          />
          <PrimaryButton
            className="mb-10"
            isLoading={isLoading}
            onClick={() => {
              if (selectedPeriod) {
                getOpenBalance(
                  selectedPeriod.id.toString(),
                  1,
                  pagination.pageSize
                );
              }
            }}
            icon={<ArrowPathIcon className="w-5 h-5" />}
          >
            Proses
          </PrimaryButton>
        </div>
        <div className="flex gap-2 mb-10 ">
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
                const worksheet = XLSX.utils.json_to_sheet(openBalance);
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
      </div>
      <TableApp
        dataSource={openBalance}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page: number, size: number) => {
          getOpenBalance(selectedPeriod?.id.toString(), page, size);
        }}
      />
    </>
  );
};

export default OpeningBalance;
