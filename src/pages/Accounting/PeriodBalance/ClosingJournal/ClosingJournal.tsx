import { Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import TableApp from "../../../../components/Tables/TableApp";

import { EyeIcon } from "@heroicons/react/24/outline";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import {
  getMasterClosingJournal,
  getMasterClosingJournalById,
} from "../../../../api/Accounting/services/closingJournalService";
import type {
  IClosedJournal,
  IClosedJournalDetail,
} from "../../../../api/Accounting/types/closedJournal.interface";
import type { IJournal } from "../../../../api/Accounting/types/journal.interface";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import { EnumJournal } from "../../../../constant/journal_enum";
import { usePermission } from "../../../../hooks/usePermission";
import { formatCurrency } from "../../../../utils/format_currency";
import { formatDate } from "../../../../utils/format_date";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";

const ClosingJournal: React.FC = () => {
  const {
    register,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchStatus, setSearchStatus] = useState<string>();

  const { hasPermission } = usePermission();

  const canUpdate = hasPermission("closing-journal-update");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nomor Jurnal",
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
      title: "Tanggal",
      children: [
        {
          title: (
            <SelectDatePicker
              onChange={(date) => {
                setValue("tanggal_journal_search", date);
                getJournal(1, pagination.pageSize);
              }}
            />
          ),
          dataIndex: "tanggal_journal",
          align: "right",
          key: "tanggal_journal",
          render: (tanggal_journal: string) => {
            return formatDate(tanggal_journal);
          },
        },
      ],
      align: "center",
      sorter: (a, b) =>
        String(a.tanggal_journal || "").localeCompare(
          String(b.tanggal_journal || "")
        ),
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
      align: "center",
      render: (text: any) => {
        return <div className="text-left">{text ?? "-"}</div>;
      },
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
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
              style={{
                textAlign: "right",
              }}
              onSearch={(_) => getJournal(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          align: "right",
          dataIndex: "nominal",
          render: (nominal: string) => formatCurrency(nominal),
          key: "nominal",
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
              options={["Posted", "Draft", "Unposted"]}
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
      render: (_: any, record: IJournal) => {
        return (
          <EyeIcon
            className="h-5 w-5 "
            onClick={() => {
              getJournalById(record.id.toString());
            }}
          />
        );
      },
    },
  ];

  const columnsTrans: any = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Akun",
      dataIndex: "coa_account",
      key: "coa_account",
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      align: "center",
      render: (value: any) => (
        <div className="text-right">{formatCurrency(value ?? 0)}</div>
      ),
    },
    {
      title: "Kredit",
      dataIndex: "kredit",
      key: "kredit",
      align: "center",
      render: (value: any) => (
        <div className="text-right">{formatCurrency(value ?? 0)}</div>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [journal, setJournal] = useState<IClosedJournal[]>([]);
  const [selectedRecord, setSelectedRecord] =
    useState<IClosedJournalDetail | null>(null);

  const getJournal = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page: page,
      per_page: pageSize,
      nomor_journal: getValues("nomor_journal_search"),
      tanggal_journal: getValues("tanggal_journal_search"),
      nominal: getValues("nominal_search").replace(/,/g, ""),
      status: searchStatus,
    };

    const promise = getMasterClosingJournal(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setJournal(res.data.data.data);
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
    const promise = getMasterClosingJournalById(id);

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

  const handleEdit = (record: IClosedJournalDetail) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setIsEditable(false);
    reset();
  };

  useEffect(() => {
    getJournal(1, pagination.pageSize);
  }, []);

  useEffect(() => {
    getJournal(1, pagination.pageSize);
  }, [searchStatus]);

  return (
    <>
      <MyBreadcrumb pageName="Closing Journal" />
      <div className="mb-8"></div>
      <TableApp
        dataSource={journal}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page: number, size: number) =>
          getJournal(page, size)
        }
      />
      <Spin spinning={isLoadingModal} fullscreen />
      {isModalOpen && selectedRecord && (
        <form encType="multipart/form-data">
          <Modal
            key={selectedRecord?.id}
            title={
              selectedRecord.status === "Posted" && !canUpdate
                ? "View" + " Closing Adjustment Journal"
                : "Edit" + " Closing Adjustment Journal"
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
            <div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 mt-3 p-5">
                <InputField
                  label="Nomor Journal"
                  id="nomor_journal"
                  type="text"
                  disabled
                  defaultValue={selectedRecord.nomor_journal}
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Tanggal Journal"
                  id="tanggal_journal"
                  type="date"
                  disabled={!isEditable || !canUpdate}
                  defaultValue={
                    new Date(selectedRecord.tanggal_journal)
                      .toISOString()
                      .split("T")[0]
                  }
                  register={register}
                  errors={errors}
                  validationSchema={
                    isEditable
                      ? { required: "Tanggal Journal harus diisi!" }
                      : {}
                  }
                />
                {selectedRecord.status === EnumJournal.Posted && (
                  <InputField
                    label="Tanggal Posted"
                    id="tanggal_posting"
                    type="date"
                    disabled
                    defaultValue={
                      new Date(selectedRecord.tanggal_posting)
                        .toISOString()
                        .split("T")[0]
                    }
                    register={register}
                    errors={errors}
                    validationSchema={{}}
                  />
                )}
                <InputField
                  label="Deskripsi"
                  id="deskripsi"
                  type="text"
                  disabled={!isEditable || !canUpdate}
                  defaultValue={selectedRecord.deskripsi}
                  register={register}
                  errors={errors}
                  validationSchema={
                    isEditable ? { required: "Deskripsi harus diisi!" } : {}
                  }
                />
              </div>
              {selectedRecord.transactions && (
                <div className="rounded-sm border border-stroke bg-white shadow-default p-10 mx-10">
                  <TableApp
                    columns={columnsTrans}
                    dataSource={selectedRecord.transactions}
                    pagination={false}
                    summary={() => (
                      <>
                        <Table.Summary.Row>
                          {selectedRecord.status !== "Posted" && (
                            <Table.Summary.Cell index={0} colSpan={2}>
                              {/* <Button
                                type="primary"
                                onClick={() => {
                                  const lastId =
                                  selectedRecord.transactions.length > 0
                                      ? transaksi[transaksi.length - 1].id
                                      : 0;

                                  setTransaksi([
                                    ...transaksi,
                                    {
                                      id: (lastId ?? 0) + 1,
                                      coa_account: "",
                                      coa_id: "",
                                      id_journal: selectedRecord.id,
                                      nomor_journal:
                                        selectedRecord.nomor_journal,
                                      tanggal_journal:
                                        selectedRecord.tanggal_journal,
                                      deskripsi: selectedRecord.deskripsi ?? "",
                                      debit: null,
                                      kredit: null,
                                    },
                                  ]);
                                  console.log(transaksi);
                                }}
                              >
                                + Transaksi
                              </Button> */}
                            </Table.Summary.Cell>
                          )}
                          {selectedRecord.status === "Posted" && (
                            <Table.Summary.Cell
                              index={0}
                              colSpan={2}
                            ></Table.Summary.Cell>
                          )}
                          <Table.Summary.Cell index={3}>
                            <strong className="flex justify-end mr-10">
                              Total :
                            </strong>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={4} align="right">
                            {formatCurrency(
                              (selectedRecord.transactions ?? []).reduce(
                                (acc, item) =>
                                  acc + parseFloat(item.debit ?? "0") || 0,
                                0
                              )
                            )}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={5} align="right">
                            {formatCurrency(
                              (selectedRecord.transactions ?? []).reduce(
                                (acc, item) =>
                                  acc + parseFloat(item.kredit ?? "0") || 0,
                                0
                              )
                            )}
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
                          <Table.Summary.Cell index={5} align="right">
                            {formatCurrency(
                              (selectedRecord.transactions ?? []).reduce(
                                (acc, item) =>
                                  acc +
                                    parseFloat(item.debit?.toString() ?? "0") ||
                                  0,
                                0
                              ) -
                                (selectedRecord.transactions ?? []).reduce(
                                  (acc, item) =>
                                    acc +
                                      parseFloat(
                                        item.kredit?.toString() ?? "0"
                                      ) || 0,
                                  0
                                )
                            )}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    )}
                  />
                </div>
              )}
              {selectedRecord.audit_trail &&
                selectedRecord.audit_trail.length > 0 && (
                  <div className="rounded-sm border border-stroke bg-white shadow-default p-5 mt-5">
                    <p className="text-title-s font-semibold text-black">
                      Audit Trail
                    </p>

                    <div className="audit-trail-list mt-5">
                      {selectedRecord.audit_trail
                        .slice()
                        .reverse()
                        .map((audit, index) => (
                          <div
                            key={index}
                            className="rounded-sm border border-stroke bg-white shadow-default mb-4"
                          >
                            <div className="user-info flex items-center mb-2 p-2">
                              <div>
                                <h3 className="font-semibold">
                                  {audit.user} {audit.event} {"at "}
                                  {audit.table_name
                                    .replace(/_/g, " ")
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    audit.updated_at
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            {audit.event !== "created" && (
                              <div className="mx-4 mb-4">
                                <ul className="text-sm">
                                  {Object.entries(audit?.new_data ?? {}).map(
                                    ([key, value]) => {
                                      if (key === "id") return null;
                                      if (key === "updated_at") return null;
                                      if (key === "updated_by") return null;
                                      let displayValue = value?.toString();
                                      let oldValue =
                                        (
                                          audit.old_data as unknown as Record<
                                            string,
                                            any
                                          >
                                        )[key] ?? "-";

                                      if (key === "tanggal_posting") {
                                        displayValue = new Date(
                                          displayValue
                                        ).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        });
                                        oldValue = new Date(
                                          oldValue
                                        ).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        });
                                      }

                                      let displayKey = key
                                        .replace(/_/g, " ")
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );

                                      return (
                                        <li
                                          key={key}
                                          className={(() => {
                                            if (
                                              displayValue ===
                                              EnumJournal.Posted
                                            )
                                              return "text-green-600";
                                            if (
                                              displayValue ===
                                              EnumJournal.Unposted
                                            )
                                              return "text-red-600";

                                            if (
                                              displayValue === EnumJournal.Draft
                                            )
                                              return "text-amber-500";
                                            return "";
                                          })()}
                                        >
                                          {oldValue !== "Invalid Date" && (
                                            <span
                                              key={key}
                                              className={(() => {
                                                if (
                                                  oldValue ===
                                                  EnumJournal.Posted
                                                )
                                                  return "text-green-600";
                                                if (
                                                  oldValue ===
                                                  EnumJournal.Unposted
                                                )
                                                  return "text-red-600";

                                                if (
                                                  oldValue === EnumJournal.Draft
                                                )
                                                  return "text-amber-500";
                                                return "";
                                              })()}
                                            >
                                              {oldValue}
                                            </span>
                                          )}
                                          {oldValue !== "Invalid Date" && (
                                            <span className="text-gray-500">
                                              {" > "}
                                            </span>
                                          )}
                                          {displayValue === "Invalid Date"
                                            ? "-"
                                            : displayValue}{" "}
                                          <span className="text-gray-500">
                                            ({displayKey})
                                          </span>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </Modal>
        </form>
      )}
    </>
  );
};

export default ClosingJournal;
