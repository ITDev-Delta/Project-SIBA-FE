import { Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { closePeriodService } from "../../../../api/Accounting/services/closingPeriodService";
import { getFiscalPeriod } from "../../../../api/Accounting/services/periodService";
import { getTrialBalances } from "../../../../api/Accounting/services/trialBalanceService";
import type { IPeriod } from "../../../../api/Accounting/types/period.interface";
import type {
  ITrialBalance,
  ITrialBalanceResponse,
} from "../../../../api/Accounting/types/trialBalance.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import TableApp from "../../../../components/Tables/TableApp";
import { EnumPeriod } from "../../../../constant/period_enum";
import { usePermission } from "../../../../hooks/usePermission";
import { formatCurrency } from "../../../../utils/format_currency";
import { formatDate } from "../../../../utils/format_date";

const PeriodClosing: React.FC = () => {
  const [period, setPeriod] = useState<IPeriod[]>();
  const [trialBalance, setTrialBalance] = useState<ITrialBalanceResponse>();
  const [trialBalanceData, setTrialBalanceData] = useState<any[]>();

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenClosePeriodModal, setIsOpenClosePeriodModal] =
    useState<boolean>(false);

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [tableKey, setTableKey] = useState<number>(0);
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);

  const { hasPermission } = usePermission();

  const canUpdate = hasPermission("period-closing-update");

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

      collectKeys(trialBalanceData ?? []);
      setExpandedRowKeys(allKeys);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const {
    register,
    formState: { errors },
  } = useForm({});

  const getPeriod = async (): Promise<void> => {
    setIsLoadingModal(true);

    const promise = getFiscalPeriod();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          const data = res.data.data.filter(
            (period: IPeriod) =>
              period.status === EnumPeriod.Active ||
              period.status === EnumPeriod.Locked
          );
          setPeriod(data);
        }
        setIsLoadingModal(false);
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
    setIsLoadingModal(true);
    const promise = getTrialBalances(tahun, bulanAwal, bulanAkhir);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setTrialBalance(res.data.data);
          setTrialBalanceData(buildTableData(res.data.data));
          setTableKey((prev) => prev + 1);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

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
          className={record.isSummary ? "flex justify-end mr-10" : ""}
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
      render: (value: any) => formatCurrency(value),
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
                  <div className="text-right">{formatCurrency(value ?? 0)}</div>
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

        return <div className="text-right">{formatCurrency(value ?? 0)}</div>;
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
        return <div className="text-right">{formatCurrency(value ?? 0)}</div>;
      },
    },
    {
      title: "Saldo Akhir",
      dataIndex: "saldo_akhir",
      key: "saldo_akhir",
      align: "center",
      render: (value: any) => formatCurrency(value),
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
                  <div className="text-right">{formatCurrency(value ?? 0)}</div>
                );
              },
            },
          ]
        : [],
    },
  ];

  const closePeriod = async (id: string) => {
    setIsLoading(true);
    if (!period) {
      toast.error("Period is undefined");
      return;
    }

    if (!period[1]?.id) {
      toast.error("Selected period ID is undefined");
      return;
    }

    const payload = {
      next_period_id: period[1].id,
    };

    closePeriodService(payload, id)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsOpenClosePeriodModal(false);
          window.location.reload();
          setIsLoading(false);
          toast.success(res.data.message);
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah Period!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getPeriod();
  }, []);

  useEffect(() => {
    if (period?.length) {
      const awalDate = new Date(period[0].tanggal_mulai);
      const akhirDate = new Date(period[0].tanggal_berakhir);
      const bulanAwal = (awalDate.getMonth() + 1).toString().padStart(2, "0");
      const bulanAkhir = (akhirDate.getMonth() + 1).toString().padStart(2, "0");
      const year = awalDate.getFullYear().toString();

      setTableKey(0);
      getTrialBalanceTable(year, bulanAwal, bulanAkhir);
    }
  }, [period]);
  return (
    <>
      <div className="mb-8">
        <MyBreadcrumb pageName="Period Closing" />
      </div>
      <Spin spinning={isLoadingModal} fullscreen />
      {period && (
        <div>
          <div
            className={
              "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5"
            }
          >
            <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
              <p className="text-title-s font-semibold text-black mb-5">
                Current Period
              </p>
              <InputField
                label="Active Period"
                id="nama_periode"
                type="text"
                defaultValue={period[0]?.nama_periode}
                disabled
                errors={errors}
                register={register}
                validationSchema={{}}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-5 ">
                <InputField
                  label="Start Date"
                  id="tanggal_mulai"
                  type="text"
                  defaultValue={formatDate(period[0]?.tanggal_mulai)}
                  disabled
                  errors={errors}
                  register={register}
                  validationSchema={{}}
                />
                <InputField
                  label="End Date"
                  id="tanggal_berakhir"
                  type="text"
                  defaultValue={formatDate(period[0]?.tanggal_berakhir)}
                  disabled
                  errors={errors}
                  register={register}
                  validationSchema={{}}
                />
              </div>
            </div>
            <div className="rounded-sm border border-stroke bg-white shadow-default p-10">
              <p className="text-title-s font-semibold text-black mb-5">
                Next Period
              </p>
              <InputField
                label="Active Period"
                id="nama_periode_2"
                type="text"
                defaultValue={period[1]?.nama_periode ?? "-"}
                disabled
                errors={errors}
                register={register}
                validationSchema={{}}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mt-5 ">
                <InputField
                  label="Start Date"
                  id="tanggal_mulai_2"
                  type="text"
                  defaultValue={formatDate(period[1]?.tanggal_mulai)}
                  disabled
                  errors={errors}
                  register={register}
                  validationSchema={{}}
                />
                <InputField
                  label="End Date"
                  id="tanggal_berakhir_2"
                  type="text"
                  defaultValue={formatDate(period[1]?.tanggal_berakhir)}
                  disabled
                  errors={errors}
                  register={register}
                  validationSchema={{}}
                />
              </div>
              {canUpdate && (
                <div className="flex justify-end mt-10">
                  <PrimaryButton
                    onClick={() => setIsOpenClosePeriodModal(true)}
                    disabled={
                      !(
                        period[0] &&
                        period[1] &&
                        period[0].status === EnumPeriod.Locked &&
                        period[1].status === EnumPeriod.Active
                      )
                    }
                  >
                    Close Period
                  </PrimaryButton>
                </div>
              )}
            </div>
          </div>

          {trialBalanceData && (
            <div className="rounded-sm border border-stroke bg-white shadow-default p-10 mt-10">
              <PrimaryButton onClick={handleToggleExpandAll}>
                {isAllExpanded ? "Collapse All" : "Expand All"}
              </PrimaryButton>
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                Trial Balance Closing
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-2 ">
                {period[0]?.nama_periode}
              </p>
              <p className="text-title-s text-center font-semibold text-black mb-5 ">
                {new Date(period[0]?.tanggal_mulai).toLocaleDateString()} -{" "}
                {new Date(period[0]?.tanggal_berakhir).toLocaleDateString()}
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
          )}

          {isOpenClosePeriodModal && (
            <Modal
              key={period[1]?.id}
              title={`Close Period ${period[1]?.nama_periode}`}
              open={isOpenClosePeriodModal}
              onOk={() => period[0]?.id && closePeriod(period[0].id.toString())}
              onCancel={() => setIsOpenClosePeriodModal(false)}
              okButtonProps={{ hidden: true }}
              cancelButtonProps={{ hidden: true }}
              styles={{
                body: {
                  maxHeight: "70vh",
                  overflowY: "auto",
                  minHeight: "20vh",
                },
              }}
            >
              <div className="mt-16">
                <p className="text-center text-lg">
                  Apakah Anda yakin untuk{" "}
                  {period[0]?.status === EnumPeriod.Active
                    ? "mengunci"
                    : "membuka"}{" "}
                  periode ini?
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-16">
                <PrimaryButton
                  onClick={() => setIsOpenClosePeriodModal(false)}
                  outlined
                >
                  Tidak
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  isLoading={isLoading}
                  onClick={() =>
                    period[0]?.id && closePeriod(period[0].id.toString())
                  }
                >
                  Close Period
                </PrimaryButton>
              </div>
            </Modal>
          )}
        </div>
      )}
    </>
  );
};

export default PeriodClosing;
