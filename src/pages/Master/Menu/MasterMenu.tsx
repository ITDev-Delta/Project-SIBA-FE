import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button, Checkbox, Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  getApiByParentId,
  updateApi,
} from "../../../api/Master/services/masterApiService";
import {
  getAllMenus,
  getMenuById,
  updateMenu,
} from "../../../api/Master/services/masterMenuService";
import type { IMenu } from "../../../api/Master/types/masterMenu.interface";
import { syncRolePermissionService } from "../../../api/UserManagements/services/roleAndPermissionService";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";

const Menu: React.FC = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<IMenu | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [selectedModule, setSelectedModule] = useState<string>();

  const [apiView, setApiView] = useState<any[]>([]);
  const [apiCreate, setApiCreate] = useState<any[]>([]);
  const [apiUpdate, setApiUpdate] = useState<any[]>([]);

  const [tableKeyView, setTableKeyView] = useState(0);
  const [tableKeyCreate, setTableKeyCreate] = useState(0);
  const [tableKeyUpdate, setTableKeyUpdate] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});

  const {
    register: registerView,
    reset: resetView,
    formState: { errors: errrorView },
  } = useForm({});

  const {
    register: registerCreate,
    reset: resetCreate,
    formState: { errors: errrorCreate },
  } = useForm({});

  const {
    register: registerUpdate,
    reset: resetUpdate,
    formState: { errors: errrorUpdate },
  } = useForm({});

  const columns: any = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      align: "center",
    },
    {
      title: "Menu Name",
      dataIndex: "menu_name",
      key: "menu_name",
      align: "center",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      align: "center",
      render: (url: string, record: any) => {
        // if record no children, return full_url, else return url
        return record.children && record.children.length > 0
          ? url
          : record.full_url || url;
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (text: any) => <div className="text-right">{text ?? "-"}</div>,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (_: any, record: any) => {
        return (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => getMenuByIds(record.id.toString())}
          />
        );
      },
    },
  ];

  const columnsView = [
    {
      title: "No",
      width: 50,
      render: (_: any, __: any, index: number) => index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "API Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => {
        return (
          <InputField
            id={`name_${record.id}`}
            defaultValue={record.name}
            register={registerView}
            onChange={(event) => {
              const value = event.target.value;
              const updatedTransaksi = apiView.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    name: value,
                  };
                }
                return item;
              });
              setApiView(updatedTransaksi);

              return value;
            }}
            disabled={!record.id.toString().includes("temp_id")}
            style={{ height: 40 }}
            errors={errrorView}
            validationSchema={{}}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 100,
      key: "type",
    },
    {
      title: "Actions",
      width: 100,
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            danger
            onClick={async () => {
              const updatedTrans = apiView.filter(
                (item) => item.id !== record.id
              );
              setApiView(updatedTrans);
              setTableKeyView((prev) => prev + 1);
              resetView();
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const columnsCreate = [
    {
      title: "No",
      width: 50,
      render: (_: any, __: any, index: number) => index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "API Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => {
        return (
          <InputField
            id={`name_${record.id}`}
            defaultValue={record.name}
            register={registerCreate}
            disabled={!record.id.toString().includes("temp_id")}
            onChange={(event) => {
              const value = event.target.value;
              const updatedTransaksi = apiCreate.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    name: value,
                  };
                }
                return item;
              });
              setApiCreate(updatedTransaksi);

              return value;
            }}
            style={{ height: 40 }}
            errors={errrorCreate}
            validationSchema={{}}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 100,
      key: "type",
    },
    {
      title: "Actions",
      width: 100,
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            danger
            onClick={async () => {
              const updatedTrans = apiCreate.filter(
                (item) => item.id !== record.id
              );
              setApiCreate(updatedTrans);
              setTableKeyCreate((prev) => prev + 1);
              resetCreate();
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const columnsUpdate = [
    {
      title: "No",
      width: 50,
      render: (_: any, __: any, index: number) => index + 1, // Menggunakan index dari array sebagai auto increment ID
    },
    {
      title: "API Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => {
        return (
          <InputField
            id={`name_${record.id}`}
            defaultValue={record.name}
            register={registerUpdate}
            disabled={!record.id.toString().includes("temp_id")}
            onChange={(event) => {
              const value = event.target.value;
              const updatedTransaksi = apiUpdate.map((item) => {
                if (item.id === record.id) {
                  return {
                    ...item,
                    name: value,
                  };
                }
                return item;
              });
              setApiUpdate(updatedTransaksi);

              return value;
            }}
            style={{ height: 40 }}
            errors={errrorUpdate}
            validationSchema={{}}
          />
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 100,
      key: "type",
    },
    {
      title: "Actions",
      width: 100,
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            danger
            onClick={async () => {
              const updatedTrans = apiUpdate.filter(
                (item) => item.id !== record.id
              );
              setApiUpdate(updatedTrans);
              setTableKeyUpdate((prev) => prev + 1);
              resetUpdate();
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  // const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);

  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedRowKeys((prev) => {
      if (expanded) {
        return [...prev, record.id];
      } else {
        return prev.filter((key) => key !== record.id);
      }
    });
  };

  // const handleToggleExpandAll = () => {
  //   if (isAllExpanded) {
  //     setExpandedRowKeys([]);
  //   } else {
  //     const allKeys: React.Key[] = [];

  //     const collectKeys = (nodes: any[]) => {
  //       nodes.forEach((node) => {
  //         allKeys.push(node.id);
  //         if (node.all_children && node.all_children.length > 0) {
  //           collectKeys(node.all_children);
  //         }
  //       });
  //     };

  //     collectKeys(menus);
  //     setExpandedRowKeys(allKeys);
  //   }
  //   setIsAllExpanded(!isAllExpanded);
  // };

  const getMenus = (): void => {
    setIsLoadingModal(true);
    const promise = getAllMenus();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setMenus(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getMenuByIds = (id: string): void => {
    setIsLoadingModal(true);

    const promise = getMenuById(id);

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

  const handleEdit = (record: IMenu) => {
    setSelectedRecord(record);
    setSelectedModule(record.module);
    setValue("is_view", record.is_view);
    setValue("is_create", record.is_create);
    setValue("is_update", record.is_update);
    setValue("is_delete", record.is_delete);
    setValue("is_approve", record.is_approve);
    setValue("is_reject", record.is_reject);
    setValue("is_detail", record.is_detail);
    setIsModalOpen(true);
  };

  const handleEdit2 = (record: any) => {
    setApiView(record.view || []);
    setApiCreate(record.create || []);
    setApiUpdate(record.update || []);
    setIsModalOpen2(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedModule(undefined);
    setError(undefined);
    reset();
  };

  const handleModalClose2 = () => {
    setIsModalOpen2(false);
    setApiCreate([]);
    setApiUpdate([]);
    setApiView([]);
    resetView();
    resetCreate();
    resetUpdate();
  };

  const getAPIByIdParent = (id: string): void => {
    setIsLoading(true);

    const promise = getApiByParentId(id);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          handleEdit2(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (!selectedRecord) return;
    if (!selectedModule) {
      setError("Module harus diisi!");
      return;
    }

    const payload = {
      id: selectedRecord.id,
      module: selectedModule,
      parent_id: selectedRecord.parent_id,
      kode: selectedRecord.kode,
      kode_parent: selectedRecord.kode_parent,
      menu_name: data.menu_name,
      url: data.url,
      level: data.level,
      is_create: data.is_create == "1" ? "1" : "0",
      is_view: data.is_view == "1" ? "1" : "0",
      is_update: data.is_update == "1" ? "1" : "0",
      is_delete: data.is_delete == "1" ? "1" : "0",
      is_approve: data.is_approve == "1" ? "1" : "0",
      is_reject: data.is_reject == "1" ? "1" : "0",
      is_show: data.is_detail == "1" ? "1" : "0",
    };

    updateMenu(selectedRecord.id.toString(), payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getMenus();
          toast.success(res.data.message);
          handleModalClose();
        } else {
          toast.error(res.data.message || "Gagal mengubah menu!");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
      });
  };

  const onUpdateAPI = async () => {
    setIsLoading(true);
    if (!selectedRecord) return;
    if (
      apiView.length === 0 &&
      apiCreate.length === 0 &&
      apiUpdate.length === 0
    ) {
      setIsLoading(false);
      toast.error("API list tidak boleh kosong!");
      return;
    }

    const payload = {
      api: [
        ...apiView.map((item) => ({
          id: item.id.toString().includes("temp_id") ? null : item.id,
          name: item.name,
          type: item.type,
        })),
        ...apiCreate.map((item) => ({
          id: item.id.toString().includes("temp_id") ? null : item.id,
          name: item.name,
          type: item.type,
        })),
        ...apiUpdate.map((item) => ({
          id: item.id.toString().includes("temp_id") ? null : item.id,
          name: item.name,
          type: item.type,
        })),
      ],
    };

    await updateApi(selectedRecord.id.toString(), payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message);
          setIsLoading(false);
          syncRolePermission();
        } else {
          toast.error(res.data.message || "Gagal mengubah API!");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
      });
  };

  const syncRolePermission = async () => {
    setIsLoading(true);
    await syncRolePermissionService()
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          syncRolePermissionService();
          getMenus();
          handleModalClose2();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
      });
  };

  useEffect(() => {
    getMenus();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Master Menu" />
        {
          <PrimaryButton to="/master/master-menu/add" className="ms-auto">
            Tambah Data
          </PrimaryButton>
        }
      </div>

      <TableApp
        dataSource={menus}
        columns={columns}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
        }}
        childrenColumnName="children"
        rowKey="id"
      />

      <Spin spinning={isLoadingModal} fullscreen />

      {isModalOpen && selectedRecord && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal
            title={
              <>
                <>Master Menu</>
                {
                  <div className="flex justify-end gap-4 px-5">
                    <PrimaryButton
                      onClick={() => {
                        getAPIByIdParent(selectedRecord.id.toString());
                      }}
                      isLoading={isLoading}
                      outlined
                    >
                      API List
                    </PrimaryButton>
                    <PrimaryButton
                      onClick={() => {
                        if (!selectedModule) {
                          setError("Module harus diisi!");
                        }
                        handleSubmit(onSubmit)();
                      }}
                      isLoading={isLoading}
                    >
                      Simpan
                    </PrimaryButton>
                  </div>
                }
              </>
            }
            open={isModalOpen}
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
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 xl:grid-cols-4 2xl:gap-5 p-6">
              <SelectGroupField
                label="Module"
                value={selectedModule}
                onChange={(value) => setSelectedModule(value)}
                options={menus.map((menu) => {
                  return menu.module;
                })}
                error={error}
              />
              <InputField
                label="Menu Name"
                id="menu_name"
                type="text"
                defaultValue={selectedRecord.menu_name}
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Menu name harus diisi!",
                }}
              />
              <InputField
                label="URL"
                id="url"
                type="text"
                defaultValue={selectedRecord.url}
                register={register}
                errors={errors}
                validationSchema={{
                  required: "URL harus diisi!",
                }}
              />
              <InputField
                label="Level"
                id="level"
                type="text"
                defaultValue={selectedRecord.level}
                disabled
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Level harus diisi!",
                }}
              />
            </div>
            <div className="space-y-2 px-6">
              <label className="block text-sm mt-1">Permissions</label>
              <div className="space-y-2 space-x-4">
                <Checkbox
                  defaultChecked={selectedRecord.is_view == "1"}
                  className="custom-checkbox"
                  onChange={(e) => {
                    setValue("is_view", e.target.checked ? "1" : "0");
                  }}
                >
                  View
                </Checkbox>
                <Checkbox
                  defaultChecked={selectedRecord.is_create == "1"}
                  className="custom-checkbox"
                  onChange={(e) => {
                    setValue("is_create", e.target.checked ? "1" : "0");
                  }}
                >
                  Create
                </Checkbox>
                <Checkbox
                  defaultChecked={selectedRecord.is_update == "1"}
                  className="custom-checkbox"
                  onChange={(e) => {
                    setValue("is_update", e.target.checked ? "1" : "0");
                  }}
                >
                  Update
                </Checkbox>
              </div>
            </div>
          </Modal>
        </form>
      )}

      {selectedRecord && isModalOpen2 && (
        <Modal
          title={
            <>
              <h2 className="text-lg font-semibold">API List</h2>
              <div className="flex justify-end gap-4 px-5">
                <PrimaryButton
                  onClick={() => {
                    onUpdateAPI();
                  }}
                  isLoading={isLoading}
                >
                  Update
                </PrimaryButton>
              </div>
            </>
          }
          open={isModalOpen2}
          onCancel={handleModalClose2}
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
          <div className="p-6 space-y-4">
            {selectedRecord.is_view == "1" && (
              <>
                <h3 className="text font-semibold">View API</h3>
                <ul>
                  {apiView && (
                    <TableApp
                      key={tableKeyView}
                      columns={columnsView}
                      dataSource={apiView}
                      scroll={{ x: "max-content" }}
                      pagination={false}
                      summary={() => (
                        <>
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={2}>
                              <Button
                                type="primary"
                                onClick={() => {
                                  let lastId = 0;
                                  if (
                                    apiView.length > 0 &&
                                    apiView[apiView.length - 1].id
                                      .toString()
                                      .includes("temp_id")
                                  ) {
                                    lastId =
                                      apiView[apiView.length - 1].id.split(
                                        "_"
                                      )[2];
                                  }

                                  setApiView([
                                    ...apiView,
                                    {
                                      id: `temp_id_${lastId + 1}`,
                                      type: "view",
                                    },
                                  ]);
                                }}
                              >
                                + API
                              </Button>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </>
                      )}
                    />
                  )}
                </ul>
              </>
            )}
            {selectedRecord.is_create == "1" && (
              <>
                <h3 className="text font-semibold">Create API</h3>
                <ul>
                  {apiCreate && (
                    <TableApp
                      key={tableKeyCreate}
                      columns={columnsCreate}
                      dataSource={apiCreate}
                      scroll={{ x: "max-content" }}
                      pagination={false}
                      summary={() => (
                        <>
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={2}>
                              <Button
                                type="primary"
                                onClick={() => {
                                  let lastId = 0;
                                  if (
                                    apiCreate.length > 0 &&
                                    apiCreate[apiCreate.length - 1].id
                                      .toString()
                                      .includes("temp_id")
                                  ) {
                                    lastId =
                                      apiCreate[apiCreate.length - 1].id.split(
                                        "_"
                                      )[2];
                                  }

                                  setApiCreate([
                                    ...apiCreate,
                                    {
                                      id: `temp_id_${lastId + 1}`,
                                      type: "create",
                                    },
                                  ]);
                                }}
                              >
                                + API
                              </Button>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </>
                      )}
                    />
                  )}
                </ul>
              </>
            )}
            {selectedRecord.is_update == "1" && (
              <>
                <h3 className="text font-semibold">Update API</h3>
                <ul>
                  {apiUpdate && (
                    <TableApp
                      key={tableKeyUpdate}
                      columns={columnsUpdate}
                      dataSource={apiUpdate}
                      scroll={{ x: "max-content" }}
                      pagination={false}
                      summary={() => (
                        <>
                          <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={2}>
                              <Button
                                type="primary"
                                onClick={() => {
                                  let lastId = 0;
                                  if (
                                    apiUpdate.length > 0 &&
                                    apiUpdate[apiUpdate.length - 1].id
                                      .toString()
                                      .includes("temp_id")
                                  ) {
                                    lastId =
                                      apiUpdate[apiUpdate.length - 1].id.split(
                                        "_"
                                      )[2];
                                  }

                                  setApiUpdate([
                                    ...apiUpdate,
                                    {
                                      id: `temp_id_${lastId + 1}`,
                                      type: "update",
                                    },
                                  ]);
                                }}
                              >
                                + API
                              </Button>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </>
                      )}
                    />
                  )}
                </ul>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Menu;
