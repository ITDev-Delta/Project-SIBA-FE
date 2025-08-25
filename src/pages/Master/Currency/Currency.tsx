import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Checkbox, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import TableApp from "../../../components/Tables/TableApp";

import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { ColumnsType } from "antd/es/table";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  editCurrency,
  getCurrency,
  getCurrencyServiceById,
} from "../../../api/Accounting/services/currencyService";
import type {
  ICurrency,
  ICurrencyDetail,
} from "../../../api/Accounting/types/currency.interface";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import { usePermission } from "../../../hooks/usePermission";

const CurrencySetup: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("master-currency-create");
  const canUpdate = hasPermission("master-currency-update");

  const [searchStatus, setSearchStatus] = useState<string>();
  const [searchIsDefault, setSearchIsDefault] = useState<string>();

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "Nama Currency",
      children: [
        {
          title: (
            <InputField
              id="nama_currency_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getCurrencys(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          dataIndex: "nama_currency",
          key: "nama_currency",
        },
      ],
      align: "center",
      sorter: (a, b) => a.nama_currency.localeCompare(b.nama_currency),
    },
    {
      title: "Kode Currency",
      children: [
        {
          title: (
            <InputField
              id="kode_currency_search"
              type="text"
              register={register}
              errors={errors}
              onSearch={(_) => getCurrencys(1, pagination.pageSize)}
              validationSchema={{}}
            />
          ),
          align: "center",
          dataIndex: "kode_currency",
          key: "kode_currency",
        },
      ],
      align: "center",
      render: (format: string) => {
        return getCurrencySymbol(format);
      },
      sorter: (a, b) => a.kode_currency.localeCompare(b.kode_currency),
    },
    {
      title: "Default",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              options={["Ya", "Tidak"]}
              value={searchIsDefault}
              className="min-w-25"
              onChange={(value: string) => {
                setSearchIsDefault(value);
              }}
            />
          ),
          align: "center",
          dataIndex: "is_default",
          key: "is_default",
          render: (isActive: string) => {
            return isActive == "1" ? (
              <CheckOutlined className="h-5 w-5 text-green-600 " />
            ) : (
              <CloseOutlined className="h-5 w-5 text-red-600 " />
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.is_default.localeCompare(b.is_default),
    },
    {
      title: "Status",
      children: [
        {
          title: (
            <SelectGroupField
              placeholder=" "
              className="min-w-25"
              options={["Active", "Inactive"]}
              value={searchStatus}
              onChange={(value: string) => setSearchStatus(value)}
            />
          ),
          align: "center",
          dataIndex: "is_active",
          key: "is_active",
          render: (isActive: string) => {
            return (
              <span
                className={`px-2 py-1 rounded-md text-xs text-white ${
                  isActive == "1" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {isActive == "1" ? "Active" : "Inactive"}
              </span>
            );
          },
        },
      ],
      align: "center",
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    },
    {
      title: "Action",
      dataIndex: "",
      align: "center",
      key: "x",
      render: (_: any, record: ICurrencyDetail) => {
        if (!canUpdate) {
          return (
            <EyeIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                getCurrencyById(record.id.toString());
              }}
            />
          );
        }
        return (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              getCurrencyById(record.id.toString());
            }}
          />
        );
      },
    },
  ];

  const [currency, setCurrency] = useState<ICurrency[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedRecord, setSelectedRecord] = useState<ICurrencyDetail | null>(
    null
  );
  const statusOptions = ["Active", "Inactive"];

  const handleEdit = (record: ICurrencyDetail) => {
    console.log("Selected Record", record);
    setSelectedRecord(record);
    setSelectedStatus(record.is_active == "1" ? "Active" : "Inactive");
    setIsDefault(record.is_default == "1" ? true : false);
    console.log("isDefault", record.is_default == "1" ? true : false);
    setIsModalOpen(true);
  };

  const getCurrencySymbol = (currency: string) => {
    try {
      return `${new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(1)
        .replace(/\d+/g, "")
        .trim()} (${currency})`;
    } catch (e) {
      return currency;
    }
  };

  const getCurrencys = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      page: page,
      per_page: pageSize,
      is_pagination: true,
      nama_currency: getValues("nama_currency_search"),
      kode_currency: getValues("kode_currency_search"),
      is_default: searchIsDefault ? (searchIsDefault === "Ya" ? "1" : "0") : "",
      is_active:
        searchStatus === "Active"
          ? "1"
          : searchStatus === "Inactive"
          ? "0"
          : "",
    };

    const promise = getCurrency(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setCurrency(res.data.data.data);
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

  const getCurrencyById = (id: string): void => {
    setIsLoadingModal(true);
    const promise = getCurrencyServiceById(id);

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

  useEffect(() => {
    getCurrencys(1, pagination.pageSize);
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (!selectedRecord) return;
    if (!selectedStatus) {
      setSelectedStatus(
        selectedRecord.is_active == "1" ? "Active" : "Inactive"
      );
    }

    if (
      data.nama_currency === selectedRecord.nama_currency &&
      data.kode_currency === selectedRecord.kode_currency &&
      selectedStatus ===
        (selectedRecord.is_active == "1" ? "Active" : "Inactive") &&
      isDefault === (selectedRecord.is_default == "1" ? true : false)
    ) {
      setIsLoading(false);
      toast.error("Data belum ada perubahan");
      return;
    }

    const payload = {
      ...data,
      id: selectedRecord?.id,
      nama_currency: data?.nama_currency.trim(),
      kode_currency: data?.kode_currency.trim(),
      is_active: selectedStatus === "Active" ? 1 : 0,
      is_default: isDefault ? 1 : 0,
    };

    console.log("payload", payload);

    editCurrency(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getCurrencys(pagination.current, pagination.pageSize);
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah currency!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getCurrencys(1, pagination.pageSize);
  }, [searchStatus, searchIsDefault]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedStatus(undefined);
    setIsDefault(false);
    reset();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Master Currency" />
        {canCreate && (
          <PrimaryButton to={"/accounting/currency/master-currency/add"}>
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <TableApp
        dataSource={currency}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page, pageSize) => getCurrencys(page, pageSize)}
      />
      <Spin spinning={isLoadingModal} fullscreen />
      {isModalOpen && selectedRecord && (
        <>
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                {canUpdate ? (
                  <>Edit Master Currency</>
                ) : (
                  <>View Master Currency</>
                )}
                {canUpdate && (
                  <div className="flex justify-end gap-4 px-5">
                    <PrimaryButton
                      onClick={handleSubmit(onSubmit)}
                      isLoading={isLoading}
                    >
                      Simpan
                    </PrimaryButton>
                  </div>
                )}
              </>
            }
            open={isModalOpen}
            onCancel={handleModalClose}
            onOk={handleSubmit(onSubmit)}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            width={1000}
            styles={{
              body: {
                maxHeight: "70vh",
                overflowY: "auto",
              },
            }}
          >
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
                <InputField
                  label="Nama Currency"
                  id="nama_currency"
                  type="text"
                  register={register}
                  errors={errors}
                  disabled={!canUpdate}
                  validationSchema={{
                    required: "Nama Currency harus diisi!",
                  }}
                  defaultValue={selectedRecord.nama_currency}
                />
                <InputField
                  label="Kode Currency"
                  id="kode_currency"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Kode Currency harus diisi!",
                  }}
                  defaultValue={selectedRecord.kode_currency}
                />
                <SelectGroupField
                  label={"Status"}
                  options={statusOptions}
                  value={selectedStatus}
                  disabled={!canUpdate}
                  onChange={(value: string) => {
                    setSelectedStatus(value);
                  }}
                />
              </div>
              <Checkbox
                onChange={(value) => {
                  setIsDefault(value.target.checked);
                }}
                checked={isDefault}
                disabled={!canUpdate}
                className="custom-checkbox mt-5 ml-2"
              >
                {"Currency Default"}
                <span style={{ color: "grey" }}> (optional)</span>
              </Checkbox>
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
                                  {new Date(audit.updated_at).toLocaleString()}
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
                                      let displayValue = value.toString();
                                      let oldValue =
                                        (audit.old_data as Record<string, any>)[
                                          key
                                        ] ?? "-";

                                      let displayKey = key
                                        .replace(/_/g, " ")
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
                                      if (
                                        key === "is_active" ||
                                        key === "is_default"
                                      ) {
                                        displayValue =
                                          value == "1" ? "Active" : "Inactive";
                                        oldValue =
                                          oldValue == "1"
                                            ? "Active"
                                            : "Inactive";
                                        displayKey = "Status";
                                      }

                                      return (
                                        <li
                                          key={key}
                                          className={
                                            displayValue === "Active"
                                              ? "text-green-600"
                                              : displayValue === "Inactive"
                                              ? "text-red-600"
                                              : ""
                                          }
                                        >
                                          <span
                                            key={key}
                                            className={
                                              oldValue === "Active"
                                                ? "text-green-600"
                                                : oldValue === "Inactive"
                                                ? "text-red-600"
                                                : ""
                                            }
                                          >
                                            {oldValue}
                                          </span>
                                          <span className="text-gray-500">
                                            {" > "}
                                          </span>
                                          {displayValue}{" "}
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
            </>
          </Modal>
        </>
      )}
    </>
  );
};

export default CurrencySetup;
