import { Button, Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import TableApp from "../../../../components/Tables/TableApp";

import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import {
  bulkTransaction,
  editClosingAdjustJournal,
  getClosingAdjustJournal,
  getClosingAdjustJournalById,
} from "../../../../api/Accounting/services/closingAdjJournalService";
import { getCoaTransaction } from "../../../../api/Accounting/services/coaSevice";
import type { ICoa } from "../../../../api/Accounting/types/coa.interface";
import type {
  IJournal,
  IJournalDetail,
  IJournalTransaction,
} from "../../../../api/Accounting/types/journal.interface";
import InputAreaField from "../../../../components/Forms/InputAreaField";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import { EnumJournal } from "../../../../constant/journal_enum";
import { useProfileContext } from "../../../../context/profile_context";
import { usePermission } from "../../../../hooks/usePermission";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";
import { formatCurrency } from "../../../../utils/format_currency";
import { formatDate } from "../../../../utils/format_date";

const ClosingAdjustmentJournal: React.FC = () => {
  const { profile } = useProfileContext();

  const {
    register,
    handleSubmit,
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

  const canCreate = hasPermission("closing-adjustment-create");
  const canUpdate = hasPermission("closing-adjustment-update");

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
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
          dataIndex: "nominal",
          align: "right",
          key: "nominal",
          render: (nominal: string) => formatCurrency(nominal),
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
      align: "center",
      render: (_: any, record: IJournal) => {
        if (record.status === EnumJournal.Posted || !canUpdate) {
          return (
            <EyeIcon
              className="h-5 w-5 "
              onClick={() => {
                getJournalById(record.id.toString());
              }}
            />
          );
        }
        return (
          <PencilSquareIcon
            className="h-5 w-5 "
            onClick={() => {
              getJournalById(record.id.toString());
            }}
          />
        );
      },
    },
  ];

  const columnsTrans = [
    {
      title: "No",
      render: (_: any, __: any, index: number) => index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Akun",
      dataIndex: "akun",
      key: "akun",
      width: "50%",
      render: (_: any, record: any) => {
        if (selectedRecord?.status === EnumJournal.Posted) {
          return record.coa_account;
        }
        return (
          <SelectGroupField
            style={{
              height: 40,
              alignItems: "center",
              placeItems: "center",
              display: "flex",
              justifyItems: "center",
            }}
            options={coa}
            value={record.coa_account}
            disabled={!canUpdate}
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
        );
      },
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      key: "deskripsi",
      width: "50%",
      render: (_: any, record: any) => {
        if (selectedRecord?.status === EnumJournal.Posted) {
          return record.deskripsi;
        }
        return (
          <InputField
            id={`deskripsi_${record.id}`}
            defaultValue={record.deskripsi}
            disabled={!canUpdate}
            register={register}
            onChange={(event) => {
              const value = event.target.value;
              setTimeout(() => {
                const updatedTransaksi = transaksi.map((item) => {
                  if (item.id === record.id) {
                    return {
                      ...item,
                      deskripsi: value,
                    };
                  }
                  return item;
                });
                setTransaksi(updatedTransaksi);
              }, 1000);

              return value;
            }}
            style={{ height: 40 }}
            errors={errors}
            validationSchema={{}}
          />
        );
      },
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      render: (_: any, record: any) => {
        if (selectedRecord?.status === EnumJournal.Posted) {
          return formatCurrency(record.debit);
        }
        return (
          <InputField
            id={`debit_${record.id}`}
            defaultValue={record.debit}
            disabled={!canUpdate}
            type="text"
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              const value = event.target.value.replace(/,/g, "");
              const updatedTransaksi = transaksi.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    debit: value,
                  };
                }
                return item;
              });
              setTransaksi(updatedTransaksi);

              return handleInputChange(event);
            }}
            style={{
              width: 150,
              height: 40,
              textAlign: "right",
              direction: "ltr",
            }}
            register={register}
            errors={errors}
            validationSchema={{}}
          />
        );
      },
    },
    {
      title: "Kredit",
      dataIndex: "kredit",
      key: "kredit",
      render: (_: any, record: any) => {
        if (selectedRecord?.status === EnumJournal.Posted) {
          return formatCurrency(record.kredit);
        }
        return (
          <InputField
            id={`kredit_${record.id}`}
            defaultValue={record.kredit}
            disabled={!canUpdate}
            type="text"
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              const value = event.target.value.replace(/,/g, "");
              const updatedTransaksi = transaksi.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    kredit: value ?? 0,
                  };
                }
                return item;
              });
              setTransaksi(updatedTransaksi);
              return handleInputChange(event);
            }}
            style={{
              width: 150,
              height: 40,
              textAlign: "right",
              direction: "ltr",
            }}
            register={register}
            errors={errors}
            validationSchema={{}}
          />
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",

      render: (_: any, record: any) => {
        if (selectedRecord?.status === EnumJournal.Posted || !canUpdate) {
          return null;
        }
        return (
          <Button
            type="link"
            danger
            onClick={async () => {
              const updatedTransaksi = transaksi.filter(
                (item) => item.id !== record.id
              );

              // Reset form values
              const newFormValues = updatedTransaksi.reduce(
                (acc, item, index) => {
                  acc[`deskripsi_${index}`] = item.deskripsi || "";
                  acc[`debit_${index}`] = item.debit || 0;
                  acc[`kredit_${index}`] = item.kredit || 0;
                  return acc;
                },
                {}
              );
              reset(newFormValues);
              setTransaksi(updatedTransaksi);
              setTableKey((prevKey) => prevKey + 1);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const defaultTransaksi: IJournalTransaction[] = [
    {
      id: 1,
      coa_account: "",
      coa_id: "",
      deskripsi: "",
      debit: null,
      kredit: null,
      id_journal: "",
      nomor_journal: "",
      nomor_transaksi: "",
      status: "",
      tanggal_journal: "",
    },
    {
      id: 2,
      coa_account: "",
      coa_id: "",
      deskripsi: "",
      debit: null,
      kredit: null,
      id_journal: "",
      nomor_journal: "",
      nomor_transaksi: "",
      status: "",
      tanggal_journal: "",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [journalData, setJournalData] = useState<IJournal[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<IJournalDetail | null>(
    null
  );
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [tableKey, setTableKey] = useState<number>(0);
  const [transaksi, setTransaksi] = useState<any[]>(defaultTransaksi);
  const [dateJournal, setDateJournal] = useState<string>();
  const [error, setError] = useState<string>();

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
    // get by level : 1
    const promise = getClosingAdjustJournal(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setJournalData(res.data.data.data);
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
    console.log("id", id);
    const promise = getClosingAdjustJournalById(id);

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

  const handleEdit = (record: IJournalDetail) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
    setDateJournal(record.tanggal_journal);
    if (record.status === EnumJournal.Posted) {
      setDateJournal(record.tanggal_posting);
    }
    setTransaksi(
      record.transactions.length === 0
        ? defaultTransaksi.map((item) => ({
            ...item,
            id_journal: record.id,
            nomor_journal: record.nomor_journal,
            tanggal_journal: record.tanggal_journal,
            deskripsi: record.deskripsi,
          }))
        : record.transactions
    );
    if (
      record.status === EnumJournal.Posted &&
      record.transactions.length === 0
    ) {
      setTransaksi([]);
    }
    setTableKey((prevKey) => prevKey + 1);

    if (
      record.status === EnumJournal.Unposted ||
      record.status === EnumJournal.Draft
    ) {
      setIsEditable(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setIsEditable(false);
    setError(undefined);
    setDateJournal(undefined);
    reset();
  };

  const onSubmit = (data: FieldValues, status: string) => {
    if (!dateJournal) {
      setError("Tanggal harus diisi!");
      return;
    }
    setIsLoading(true);

    const withoutEmptyTransaksi = transaksi.filter(
      (item) => item.coa_id !== ""
    );

    if (withoutEmptyTransaksi.length === 0) {
      setIsLoading(false);
      toast.error("Transaksi tidak boleh kosong ketika melakukan Aksi!");
      return;
    }

    if (withoutEmptyTransaksi.length < 2 && status === EnumJournal.Posted) {
      setIsLoading(false);
      toast.error("Transaksi tidak boleh kurang dari 2 ketika melakukan Post!");
      return;
    }

    // cek jika semua isi debit dan kredit tidak kosong
    const isDebitKreditEmpty = withoutEmptyTransaksi.some(
      (item) =>
        parseFloat(item.debit?.toString() ?? "0") === 0 &&
        parseFloat(item.kredit?.toString() ?? "0") === 0
    );

    if (isDebitKreditEmpty && status === EnumJournal.Posted) {
      setIsLoading(false);
      toast.error("Debit dan Kredit tidak boleh kosong!");
      return;
    }

    if (
      transaksi.reduce(
        (acc, item) => acc + parseFloat(item.debit?.toString() || "0"),
        0
      ) -
        transaksi.reduce(
          (acc, item) => acc + parseFloat(item.kredit?.toString() || "0"),
          0
        ) !==
        0 &&
      status === EnumJournal.Posted
    ) {
      setIsLoading(false);
      toast.error("Transaksi tidak balance!");
      return;
    }

    if (!selectedRecord) {
      setIsLoading(false);
      return;
    }

    const payload = {
      ...data,
      id: selectedRecord?.id,
      tanggal_journal: data.tanggal || selectedRecord.tanggal_journal,
      deskripsi: data.deskripsi || selectedRecord.deskripsi,
      status: status,
    };

    console.log("payload", payload);

    editClosingAdjustJournal(payload)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          if (
            JSON.stringify(selectedRecord?.transactions ?? []) ===
            JSON.stringify(transaksi)
          ) {
            getJournal(pagination.current, pagination.pageSize);
            setIsLoading(false);
            toast.success(res.data.message);
            handleModalClose();
          } else {
            setIsLoading(true);
            onAddTransaction(status, res.data.message);
          }
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah journal!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  const onAddTransaction = async (status: string, message: string) => {
    setIsLoading(true);

    const withoutEmptyTransaksi = transaksi.filter(
      (item) => item.coa_id !== ""
    );

    if (withoutEmptyTransaksi.length === 0) {
      getJournal(pagination.current, pagination.pageSize);
      setIsLoading(false);
      toast.success(message);
      handleModalClose();
      return;
    }

    if (
      JSON.stringify(selectedRecord?.transactions ?? []) ===
      JSON.stringify(withoutEmptyTransaksi)
    ) {
      getJournal(pagination.current, pagination.pageSize);
      setIsLoading(false);
      toast.success(message);
      handleModalClose();
      return;
    }

    //ganti semua status di transaksi && remove id
    const newTransaksi = withoutEmptyTransaksi.map((item) => ({
      ...item,
      id: undefined,
      status: status,
    }));

    const payload = {
      journals: newTransaksi,
    };

    await bulkTransaction(payload)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          getJournal(pagination.current, pagination.pageSize);
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error("Failed to add data");
        }
      })
      .catch((err) => {
        setIsLoading(false);
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
          setCoa(data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getJournal(1, pagination.pageSize);
    getCoaTrans();
  }, []);

  useEffect(() => {
    getJournal(1, pagination.pageSize);
  }, [searchStatus]);

  useEffect(() => {
    if (selectedRecord) console.log("selectedRecord", selectedRecord);
  }, [selectedRecord]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Closing Adjustment Journal" />
        {canCreate && (
          <PrimaryButton
            to={"/accounting/period-balance/closing-adjustment/add"}
          >
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <TableApp
        dataSource={journalData}
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
              <>
                <>
                  {selectedRecord.status === "Posted" && !canUpdate
                    ? "View"
                    : "Edit" + " Closing Adjustment Journal"}
                </>
                <div className="flex gap-3 justify-end mr-5">
                  {canUpdate && selectedRecord.status !== "Unposted" && (
                    <PrimaryButton
                      onClick={handleSubmit((data) => {
                        if (!dateJournal) {
                          setError("Tanggal harus diisi!");
                        }
                        onSubmit(data, EnumJournal.Unposted);
                      })}
                      isLoading={isLoading}
                      outlined
                    >
                      {selectedRecord.status === "Posted"
                        ? "Unposted"
                        : "Simpan"}
                    </PrimaryButton>
                  )}
                  {canUpdate && selectedRecord.status !== "Posted" && (
                    <PrimaryButton
                      onClick={() => {
                        handleSubmit((data) => {
                          if (!dateJournal) {
                            setError("Tanggal harus diisi!");
                          }
                          onSubmit(data, EnumJournal.Posted);
                        })();
                      }}
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
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 mt-3">
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
                <SelectDatePicker
                  label="Tanggal Journal"
                  required={!!error}
                  defaultValue={dateJournal}
                  backDate={Number(profile?.role?.backdate_limit)}
                  disabled={!isEditable || !canUpdate}
                  errors={error}
                  onChange={(date) => {
                    if (date !== "") {
                      setError(undefined);
                    }
                    setDateJournal(date);
                  }}
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
                    style={{
                      textAlign: "right",
                    }}
                    register={register}
                    errors={errors}
                    validationSchema={{}}
                  />
                )}
              </div>
              <br />
              <InputAreaField
                label="Deskripsi"
                id="deskripsi"
                disabled={!isEditable || !canUpdate}
                defaultValue={selectedRecord.deskripsi}
                register={register}
                errors={errors}
                validationSchema={
                  isEditable ? { required: "Deskripsi harus diisi!" } : {}
                }
              />
              <br />
              {transaksi && (
                <TableApp
                  key={tableKey}
                  columns={columnsTrans}
                  dataSource={transaksi}
                  pagination={false}
                  summary={() => (
                    <>
                      <Table.Summary.Row>
                        {selectedRecord.status !== "Posted" && canUpdate && (
                          <Table.Summary.Cell index={0} colSpan={2}>
                            <Button
                              type="primary"
                              onClick={() => {
                                const lastId =
                                  transaksi.length > 0
                                    ? transaksi[transaksi.length - 1].id
                                    : 0;

                                setTransaksi([
                                  ...transaksi,
                                  {
                                    id: (lastId ?? 0) + 1,
                                    coa_account: "",
                                    coa_id: "",
                                    id_journal: selectedRecord.id,
                                    nomor_journal: selectedRecord.nomor_journal,
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
                            </Button>
                          </Table.Summary.Cell>
                        )}
                        {(selectedRecord.status === "Posted" || !canUpdate) && (
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
                            transaksi.reduce(
                              (acc, item) =>
                                acc + parseFloat(item.debit ?? "0") || 0,
                              0
                            )
                          )}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={5} align="right">
                          {formatCurrency(
                            transaksi.reduce(
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
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  )}
                />
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
                                        (audit.old_data as Record<string, any>)[
                                          key
                                        ] ?? "-";

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

export default ClosingAdjustmentJournal;
