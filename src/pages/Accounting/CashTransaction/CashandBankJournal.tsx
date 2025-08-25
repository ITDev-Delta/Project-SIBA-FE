import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  getServiceCashandBankJournal,
  getServiceCashandBankJournalById,
  postServiceCashandBankJournal,
} from "../../../api/Accounting/services/cashAndBankService";
import { getCoaTransaction } from "../../../api/Accounting/services/coaSevice";
import type {
  ICashAndBankJournal,
  ICashAndBankJournalDetail,
  ICashAndBankJournalJournalData,
} from "../../../api/Accounting/types/cashAndBank.interface";
import type { ICoa } from "../../../api/Accounting/types/coa.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputAreaField from "../../../components/Forms/InputAreaField";
import InputField from "../../../components/Forms/InputField";
import SelectDatePicker from "../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";
import { EnumJournal } from "../../../constant/journal_enum";
import { usePermission } from "../../../hooks/usePermission";
import { formatCurrency } from "../../../utils/format_currency";
import { formatDate } from "../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../utils/InputCurrencyUtils";

const CashAndBankJournal: React.FC = () => {
  const {
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchStatus, setSearchStatus] = useState<string>();

  const { hasPermission } = usePermission();

  const canUpdate = hasPermission("cash-bank-journal-update");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "No. Journal",
      children: [
        {
          title: (
            <InputField
              id="nomor_journal_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getJournal(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "nomor_journal",
          key: "nomor_journal",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nomor_journal.localeCompare(b.nomor_journal),
    },
    {
      title: "Created Date",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("created_at_search", date);
                getJournal(1, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "created_at",
          key: "created_at",
          align: "center",
          render: (created_at: string) => {
            return <div className="text-right">{formatDate(created_at)}</div>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        (a.created_at ?? "")
          .toString()
          .localeCompare((b.created_at ?? "").toString()),
    },
    {
      title: "Posted Date",
      dataIndex: "tanggal_posting",
      key: "tanggal_posting",
      render: (tanggal_posting: string) => {
        return <div className="text-right">{formatDate(tanggal_posting)}</div>;
      },
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_posting_search", date);
                getJournal(1, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_posting",
          key: "tanggal_posting",
          align: "center",
          render: (tanggal_posting: string) => {
            return (
              <span>{tanggal_posting ? formatDate(tanggal_posting) : "-"}</span>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        (a.tanggal_posting ?? "")
          .toString()
          .localeCompare((b.tanggal_posting ?? "").toString()),
    },
    {
      title: "Deskripsi",
      align: "center",
      dataIndex: "deskripsi",
      key: "deskripsi",
      render: (deskripsi: string) => {
        return <span className="text-left">{deskripsi ?? "-"}</span>;
      },
    },
    {
      title: "Nominal",
      children: [
        {
          title: (
            <InputField
              id="nominal_search"
              type="text"
              register={register}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
              errors={errors}
              style={{ textAlign: "right" }}
              onSearch={(_) => getJournal(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "nominal",
          align: "center",
          key: "nominal",
          render: (nominal: string) => {
            return <div className="text-right">{formatCurrency(nominal)}</div>;
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.nominal.replace(/,/g, "")) -
        parseFloat(b.nominal.replace(/,/g, "")),
    },
    {
      title: "Status",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Posted", "Unposted"]}
              value={searchStatus}
              onChange={(value: string) => setSearchStatus(value)}
            />
          ),
          align: "center",
          dataIndex: "status",
          key: "status",
          render: (status: string) => {
            let statusClass = "bg-red-600";
            if (status === EnumJournal.Posted) {
              statusClass = "bg-green-600";
            } else if (status === EnumJournal.Draft) {
              statusClass = "bg-amber-500";
            }
            return (
              <span
                className={`px-2 py-1 rounded-md text-xs text-white ${statusClass}`}
              >
                {status}
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
      render: (_: any, record: any) => {
        if (record.status === EnumJournal.Posted || !canUpdate) {
          return (
            <EyeIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                getJournalById(record.id.toString());
              }}
            />
          );
        }
        return (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              getJournalById(record.id.toString());
            }}
          />
        );
      },
    },
  ];

  const columnDetail: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Akun",
      align: "center",
      dataIndex: "akun",
      key: "akun",
      width: "35%",
      render: (_: any, record: any) => (
        <SelectGroupField
          style={{
            height: 40,
            alignItems: "center",
            placeItems: "center",
            display: "flex",
            justifyItems: "center",
            textAlign: "left",
          }}
          disabled={
            selectedRecord?.data.status === EnumJournal.Posted || !canUpdate
          }
          options={coa}
          allowClear={false}
          value={record.coa_account}
          onChange={(value) => {
            const updatedTransaksi = transaksi.map((item) => {
              if (item.id === record.id) {
                return {
                  ...item,
                  coa_id: value.id,
                  coa_account: value.full_account_name,
                };
              }
              return item;
            });
            setTransaksi(updatedTransaksi);
          }}
        />
      ),
    },
    {
      title: "Deskripsi",
      align: "center",
      dataIndex: "deskripsi",
      key: "deskripsi",
      width: "35%",
      render: (deskripsi: string) => {
        return <span className="text-left">{deskripsi ?? "-"}</span>;
      },
    },
    {
      title: "Debit",
      align: "center",
      dataIndex: "debit",
      key: "debit",
      render: (value: any) => {
        return <div className="text-right">{formatCurrency(value ?? 0)}</div>;
      },
    },
    {
      title: "Kredit",
      align: "center",
      dataIndex: "kredit",
      key: "kredit",
      render: (value: any) => {
        return <div className="text-right">{formatCurrency(value ?? 0)}</div>;
      },
    },
  ];

  const [cashAndBankJournal, setCashAndBankJournal] = useState<
    ICashAndBankJournal[]
  >([]);
  const [coa, setCoa] = useState<ICoa[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] =
    useState<ICashAndBankJournalDetail>();
  const [transaksi, setTransaksi] = useState<ICashAndBankJournalJournalData[]>(
    []
  );
  const [tableKey, setTableKey] = useState<number>(0);

  const handleView = (record: ICashAndBankJournalDetail) => {
    console.log(record);

    setSelectedRecord(record);
    setTransaksi(record.journal);
    setTableKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(undefined);
    setTransaksi([]);
    reset();
  };

  const getJournal = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      nomor_journal: getValues("nomor_journal_search"),
      created_date: getValues("created_at_search"),
      tanggal_journal: getValues("tanggal_create_search"),
      tanggal_posting: getValues("tanggal_posting_search"),
      nominal: (getValues("nominal_search") ?? "").replace(/,/g, ""),
      status_filter: searchStatus,
    };

    const promise = getServiceCashandBankJournal(params);
    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setCashAndBankJournal(res.data.data.data);
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

  const getJournalById = (id: string): void => {
    setIsLoadingModal(true);

    const promise = getServiceCashandBankJournalById(id);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          handleView(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getCoa = (): void => {
    setIsLoadingModal(true);
    const promise = getCoaTransaction();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          let data = res.data.data as ICoa[];
          data = [
            ...data.filter((item) => item.level != "1" && item.level != "2"),
          ];
          setCoa(data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoadingModal);
      });
  };

  const onSubmit = () => {
    if (!selectedRecord) return;

    if (transaksi.some((item) => !item.coa_id)) {
      toast.error("Semua akun harus dipilih!");
      return;
    }

    setIsLoading(true);

    const payload = {
      tanggal_post: new Date().toISOString().slice(0, 10),
      id: transaksi.map((item) => Number(item.id)),
      coa_id: transaksi.map((item) => Number(item.coa_id)),
    };

    console.log(payload);

    const promise = postServiceCashandBankJournal(
      payload,
      selectedRecord.data.id.toString()
    );

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          toast.success("Berhasil memposting jurnal!");
          getJournal(pagination.current, pagination.pageSize);
          handleModalClose();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getJournal(1, pagination.pageSize);
    getCoa();
  }, []);

  useEffect(() => {
    getJournal(1, pagination.pageSize);
  }, [searchStatus]);

  return (
    <>
      <div className="mb-8">
        <MyBreadcrumb pageName="Cash and Bank Journal" />
      </div>
      <TableApp
        dataSource={cashAndBankJournal}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page, pageSize) => getJournal(page, pageSize)}
      />
      {isModalOpen && selectedRecord && (
        <Modal
          key={selectedRecord.data.nomor_journal}
          title={
            <>
              <h4>{`Cash and Bank Journal - ${selectedRecord.data.nomor_journal}`}</h4>
              <div className="flex justify-end px-5">
                {selectedRecord.data.status !== "Posted" && canUpdate && (
                  <PrimaryButton
                    onClick={() => onSubmit()}
                    isLoading={isLoading}
                  >
                    Post
                  </PrimaryButton>
                )}
              </div>
            </>
          }
          open={isModalOpen}
          onCancel={handleModalClose}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          width={1400}
          styles={{
            body: {
              maxHeight: "70vh",
              overflowY: "auto",
              minHeight: "30vh",
            },
          }}
        >
          <div className="p-5">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-3 2xl:gap-5 mt-3">
              <InputField
                label="Nomor Journal"
                id="nomor_journal"
                type="text"
                disabled
                defaultValue={selectedRecord.data.nomor_journal}
                register={register}
                errors={errors}
                validationSchema={{}}
              />
              <InputField
                label="Created Date"
                id="created_date"
                type="text"
                disabled
                defaultValue={
                  selectedRecord.data.tanggal_journal
                    ? formatDate(selectedRecord.data.tanggal_journal)
                    : ""
                }
                register={register}
                errors={errors}
                style={{ textAlign: "right" }}
                validationSchema={{}}
              />
              {selectedRecord.data.tanggal_posting && (
                <InputField
                  label="Tanggal Posted"
                  id="tanggal_posting"
                  type="text"
                  disabled
                  defaultValue={
                    selectedRecord.data.tanggal_posting
                      ? formatDate(selectedRecord.data.tanggal_posting)
                      : ""
                  }
                  register={register}
                  errors={errors}
                  style={{ textAlign: "right" }}
                  validationSchema={{}}
                />
              )}
            </div>
            <br />
            <InputAreaField
              label="Deskripsi"
              id="deskripsi"
              disabled
              defaultValue={selectedRecord.data.deskripsi}
              register={register}
              errors={errors}
              validationSchema={{}}
            />
            <br />
            {transaksi && (
              <TableApp
                key={tableKey}
                columns={columnDetail}
                dataSource={transaksi}
                pagination={false}
                summary={() => (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        colSpan={2}
                      ></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        <strong className="flex justify-end mr-10">
                          Total :
                        </strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        <div className="text-right">
                          {formatCurrency(
                            transaksi.reduce(
                              (acc, item) =>
                                acc +
                                  parseFloat(item.debit?.toString() ?? "0") ||
                                0,
                              0
                            )
                          )}
                        </div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        <div className="text-right">
                          {formatCurrency(
                            transaksi.reduce(
                              (acc, item) =>
                                acc +
                                  parseFloat(item.kredit?.toString() ?? "0") ||
                                0,
                              0
                            )
                          )}
                        </div>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        colSpan={2}
                      ></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        <strong className="flex justify-end mr-10">
                          Out of Balance :
                        </strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        <div className="text-right">
                          {formatCurrency(
                            transaksi.reduce(
                              (acc, item) =>
                                acc +
                                  parseFloat(item.debit?.toString() ?? "0") ||
                                0,
                              0
                            ) -
                              transaksi.reduce(
                                (acc, item) =>
                                  acc +
                                    parseFloat(
                                      item.kredit?.toString() ?? "0"
                                    ) || 0,
                                0
                              )
                          )}
                        </div>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )}
              />
            )}
          </div>
        </Modal>
      )}
      <Spin spinning={isLoadingModal} fullscreen />
    </>
  );
};

export default CashAndBankJournal;
