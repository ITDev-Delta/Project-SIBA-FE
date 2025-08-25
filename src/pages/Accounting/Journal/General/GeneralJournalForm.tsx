import { Button, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCoaTransaction } from "../../../../api/Accounting/services/coaSevice";
import {
  addGeneralJournal,
  bulkTransaction,
} from "../../../../api/Accounting/services/generalJournalService";
import type { ICoa } from "../../../../api/Accounting/types/coa.interface";
import type {
  IJournal,
  IJournalTransaction,
} from "../../../../api/Accounting/types/journal.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputAreaField from "../../../../components/Forms/InputAreaField";
import InputField from "../../../../components/Forms/InputField";
import SelectDatePicker from "../../../../components/Forms/SelectDatePicker";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../components/Tables/TableApp";
import { EnumJournal } from "../../../../constant/journal_enum";
import { useProfileContext } from "../../../../context/profile_context";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";
import { formatCurrency } from "../../../../utils/format_currency";

const GeneralJournalForm = () => {
  const navigate = useNavigate();
  const { profile } = useProfileContext();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});

  const columns = [
    {
      title: "No",
      render: (_: any, __: any, index: number) => index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Akun",
      dataIndex: "akun",
      key: "akun",
      width: "50%",
      render: (_: any, record: any) => (
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
      dataIndex: "deskripsi",
      key: "deskripsi",
      width: "50%",
      render: (_: any, record: any) => (
        <InputField
          id={`deskripsi_${record.id}`}
          defaultValue={record.deskripsi}
          register={register}
          onInput={(event) => {
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
      ),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      render: (_: any, record: any) => (
        <InputField
          id={`debit_${record.id}`}
          defaultValue={record.debit}
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
      ),
    },
    {
      title: "Kredit",
      dataIndex: "kredit",
      key: "kredit",
      render: (_: any, record: any) => (
        <InputField
          id={`kredit_${record.id}`}
          defaultValue={record.kredit}
          type="text"
          onKeyDown={handleKeyDown}
          onInput={(event) => {
            const value = event.target.value.replace(/,/g, "");
            const updatedTransaksi = transaksi.map((item) => {
              if (item.id === record.id) {
                return {
                  ...item,
                  kredit: value,
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
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
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
      ),
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [journalPost, setJournalPost] = useState<IJournal>();
  const [transaksi, setTransaksi] = useState<any[]>(defaultTransaksi);
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [tableKey, setTableKey] = useState<number>(0);

  const [dateJournal, setDateJournal] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    getCoaTrans();
  }, []);

  const onAddData: SubmitHandler<FieldValues> = async (data) => {
    if (!dateJournal) {
      return;
    }
    setIsLoading(true);

    const payload = {
      ...data,
      nomor_journal: data?.nomor_journal,
      tanggal_journal: dateJournal,
      deskripsi: data?.deskripsi,
      status: "Draft",
    };

    await addGeneralJournal(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          toast.success(res.data.message);
          setJournalPost(res.data.data);
          setTransaksi(
            defaultTransaksi.map((item) => ({
              ...item,
              id_journal: res.data.data.id,
              nomor_journal: res.data.data.nomor_journal,
              tanggal_journal: res.data.data.tanggal_journal,
              deskripsi: res.data.data.deskripsi,
            }))
          );
          setValue("nomor_journal", res.data.data.nomor_journal);
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

  const onAddTransaction = async (status: string) => {
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

    //ganti semua status di transaksi && remove id
    const newTransaksi = withoutEmptyTransaksi.map((item) => ({
      ...item,
      id: undefined,
      status: status,
    }));

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

    const payload = {
      journals: newTransaksi,
    };

    await bulkTransaction(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate("/accounting/journal-entry/general-journal");
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

  return (
    <>
      <div className="sticky top-16 left-0 right-0 flex flex-row justify-between items-center mb-5 bg-white z-40 py-4 ">
        <MyBreadcrumb
          pageName="General Journal"
          link="/accounting/journal-entry/general-journal"
          session="Tambah Data"
        />
        <div
          className={`flex ${
            journalPost ? "justify-between" : "justify-end"
          } gap-4 pr-5`}
        >
          {journalPost && (
            <PrimaryButton
              onClick={() => {
                onAddTransaction("Unposted");
              }}
              isLoading={isLoading}
              outlined
            >
              Simpan
            </PrimaryButton>
          )}
          <PrimaryButton
            onClick={() => {
              if (journalPost) {
                onAddTransaction("Posted");
              } else {
                if (!dateJournal) {
                  setError("Tanggal harus diisi!");
                }
                handleSubmit(onAddData)();
              }
            }}
            isLoading={isLoading}
          >
            {journalPost ? `Post` : `Simpan`}
          </PrimaryButton>
        </div>
      </div>
      <Spin spinning={isLoadingModal} fullscreen />
      <div className="rounded-sm border border-stroke bg-white p-10 ">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 ">
          <InputField
            label="No Journal"
            id="nomor_journal"
            type="text"
            disabled
            register={register}
            errors={errors}
            validationSchema={{}}
          />
          <SelectDatePicker
            label="Tanggal"
            defaultValue={dateJournal}
            backDate={Number(profile?.role?.backdate_limit)}
            required={!!error}
            errors={error}
            onChange={(date) => {
              if (date !== "") {
                setError(undefined);
              }
              setDateJournal(date);
            }}
          />
        </div>
        <br />
        <InputAreaField
          label="Deskripsi"
          id="deskripsi"
          disabled={!!journalPost}
          register={register}
          errors={errors}
          validationSchema={{
            required: "Deskripsi harus diisi!",
          }}
        />
        <br />
        {journalPost && transaksi && (
          <TableApp
            key={tableKey}
            columns={columns}
            dataSource={transaksi}
            pagination={false}
            summary={() => (
              <>
                <Table.Summary.Row>
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
                            id_journal: journalPost.id,
                            nomor_journal: journalPost.nomor_journal,
                            tanggal_journal: journalPost.tanggal_journal,
                            deskripsi: journalPost.deskripsi ?? "",
                            debit: null,
                            kredit: null,
                          },
                        ]);
                      }}
                    >
                      + Transaksi
                    </Button>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <strong className="flex justify-end mr-10">Total :</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    {formatCurrency(
                      transaksi.reduce(
                        (acc, item) => acc + parseFloat(item.debit ?? "0") || 0,
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
                          acc + parseFloat(item.debit?.toString() ?? "0") || 0,
                        0
                      ) -
                        transaksi.reduce(
                          (acc, item) =>
                            acc + parseFloat(item.kredit?.toString() ?? "0") ||
                            0,
                          0
                        )
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )}
          />
        )}
      </div>
    </>
  );
};

export default GeneralJournalForm;
