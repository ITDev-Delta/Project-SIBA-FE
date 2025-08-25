import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  editAccountCoa,
  getAccountCoa,
  getAccountCoaById,
} from "../../../../api/Accounting/services/coaSevice";
import type {
  ICoa,
  ICoaDetail,
} from "../../../../api/Accounting/types/coa.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import TableApp from "../../../../components/Tables/TableApp";
import { usePermission } from "../../../../hooks/usePermission";
import { useColumnSearchProps } from "../../../../utils/SearchUtils";

const ChartAccounts: React.FC = () => {
  const { getColumnSearchProps } = useColumnSearchProps();

  const { hasPermission } = usePermission();

  const canCreate = hasPermission("account-list-create");
  const canUpdate = hasPermission("account-list-update");

  const column = [
    {
      title: "Account",
      dataIndex: "full_account_name",
      key: "full_account_name",
      // menambah  edit button ketika data key lebih dari 99
      render: (value: string, record: any) => {
        if (record.level === null) return <b>{value}</b>;
        if (parseInt(record.level) > 3) {
          return (
            <div className="flex justify-between w-auto">
              <div className="">{record.full_account_name}</div>
              {canUpdate ? (
                <PencilSquareIcon
                  className="h-5 w-5 "
                  onClick={() => {
                    getCoaById(record.id.toString());
                  }}
                />
              ) : (
                <EyeIcon
                  className="h-5 w-5 "
                  onClick={() => {
                    getCoaById(record.id.toString());
                  }}
                />
              )}
            </div>
          );
        }
        return <b>{value}</b>;
      },
      ...getColumnSearchProps({
        dataIndex: "full_account_name",
        label: "Account",
        isTree: true,
        onSearch: () => {
          !isAllExpanded && handleToggleExpandAll();
        },
        onReset: () => {
          isAllExpanded && handleToggleExpandAll();
        },
      }),
    },
    {
      title: "D/K",
      dataIndex: "debit_kredit",
      key: "debit_kredit",
      render: (value: string, record: any) => {
        if (parseInt(record.level) > 3) {
          return value;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (status: string, record: any) =>
        // menambahkan status active dan inactive ketika level lebih dari 3
        parseInt(record.level) > 3 && (
          <span
            className={`px-2 py-1 rounded-md text-xs text-white ${
              status == "1" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {status == "1" ? "Active" : "Inactive"}
          </span>
        ),
    },
  ];

  const statusOptions = ["Active", "Inactive"];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedDK, setSelectedDK] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ICoaDetail | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const getCoa = (): void => {
    setIsLoadingModal(true);
    // get by level : 1
    const promise = getAccountCoa(1);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          const data = res.data.data.map((item: ICoa) => {
            const removeEmptyChildren = (item: ICoa) => {
              if (item.all_children?.length === 0) {
                delete item.all_children;
              } else {
                item.all_children = item.all_children?.map(removeEmptyChildren);
              }
              return item;
            };

            return removeEmptyChildren(item);
          });
          setCoa(data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getCoaById = (id: string): void => {
    setIsLoadingModal(true);
    console.log("id", id);
    const promise = getAccountCoaById(id);

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

  const handleEdit = (record: ICoaDetail) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
    setSelectedDK(record.debit_kredit);
    setSelectedStatus(record.is_active == "1" ? "Active" : "Inactive");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedStatus(undefined);
    setSelectedDK(undefined);
    reset();
  };

  const onSubmit = (data: any) => {
    setIsLoading(true);

    if (!selectedRecord) {
      setIsLoading(false);
      return;
    }

    if (!selectedStatus) {
      setSelectedStatus(
        selectedRecord.is_active == "1" ? "Active" : "Inactive"
      );
    }

    if (
      selectedStatus ===
        (selectedRecord.is_active == "1" ? "Active" : "Inactive") &&
      selectedDK?.toLowerCase() === selectedRecord.debit_kredit
    ) {
      setIsLoading(false);
      toast.error("Data belum ada perubahan");
      return;
    }

    const payload = {
      ...data,
      id: selectedRecord?.id,
      is_active: selectedStatus === "Active" ? "1" : "0",
      debit_kredit: selectedDK?.toLowerCase(),
    };

    console.log("payload", payload);

    editAccountCoa(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message);
          getCoa();
          setIsLoading(false);
          handleModalClose();
        } else {
          setIsLoading(false);
          toast.error(res.data.message || "Gagal mengubah Account!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  const findParent = (data: ICoa[], id: string): string | undefined => {
    for (const item of data) {
      if (item.id.toString() === id) {
        return item.nama_akun;
      }
      if (item.all_children) {
        const result = findParent(item.all_children, id);
        if (result) {
          return result;
        }
      }
    }
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);

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
          if (node.all_children && node.all_children.length > 0) {
            collectKeys(node.all_children);
          }
        });
      };

      collectKeys(coa);
      setExpandedRowKeys(allKeys);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  useEffect(() => {
    getCoa();
  }, []);

  useEffect(() => {
    if (selectedRecord) console.log("selectedRecord", selectedRecord);
  }, [selectedRecord]);

  return (
    <div>
      <MyBreadcrumb pageName="Account List"></MyBreadcrumb>
      <div className="flex justify-between mt-5 ">
        <PrimaryButton onClick={handleToggleExpandAll}>
          {isAllExpanded ? "Collapse All" : "Expand All"}
        </PrimaryButton>
        {canCreate && (
          <PrimaryButton to="/accounting/coa/account-list/add">
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <div className="mb-8" />
      <TableApp
        columns={column}
        dataSource={coa}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
        }}
        childrenColumnName="all_children"
        rowKey="id"
      />
      <Spin spinning={isLoadingModal} fullscreen />
      {isModalOpen && selectedRecord && (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                {canUpdate ? <>Edit Account List</> : <>View Account List</>}
                {canUpdate && (
                  <div className="flex pr-5 justify-end ">
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
            onOk={handleSubmit(onSubmit)}
            onCancel={handleModalClose}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            width={1000}
            styles={{
              body: {
                maxHeight: "70vh",
                overflowY: "auto",
                minHeight: "30vh",
              },
            }}
          >
            <div className="px-5">
              <InputField
                label="Parent"
                defaultValue={
                  selectedRecord.id_parent
                    ? findParent(coa, selectedRecord.id_parent.toString())
                    : ""
                }
                id="parent"
                disabled
                type="text"
                register={register}
                errors={errors}
                validationSchema={{}}
              />
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 mt-3">
                <InputField
                  label="Kode Akun"
                  defaultValue={selectedRecord.kode_akun}
                  id="kode_akun"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                <InputField
                  label="Nama Akun"
                  defaultValue={selectedRecord.nama_akun}
                  id="nama_akun"
                  type="text"
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{}}
                />
                {parseInt(selectedRecord.level) === 4 && (
                  <SelectGroupField
                    label="Debit/Kredit"
                    options={["Debit", "Kredit"]}
                    value={selectedDK}
                    disabled={!canUpdate}
                    onChange={(value: string) => {
                      setSelectedDK(value);
                    }}
                  />
                )}
                {parseInt(selectedRecord.level) > 4 && (
                  <InputField
                    label="Debit/Kredit"
                    id="debit_kredit"
                    defaultValue={selectedDK}
                    type="text"
                    disabled
                    register={register}
                    errors={errors}
                    validationSchema={{ required: "Debit/Kredit harus diisi!" }}
                  />
                )}
                <SelectGroupField
                  label="Status"
                  options={statusOptions}
                  disabled={!canUpdate}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e)}
                />
              </div>

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
                                      if (key === "is_active") {
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
            </div>
          </Modal>
        </form>
      )}
    </div>
  );
};

export default ChartAccounts;
