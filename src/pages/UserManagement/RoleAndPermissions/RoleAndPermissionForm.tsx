import { Button, Checkbox, Modal, Spin, Tabs, Tooltip } from "antd";
import type { TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSettingPettyCash } from "../../../api/Accounting/services/settingPettiCashService";
import type { ISettingPettyCash } from "../../../api/Accounting/types/settingPettyCash.interface";
import { getMasterLocation } from "../../../api/Master/services/locationService";
import type { ILocation } from "../../../api/Master/types/location.interface";
import { createUserManagementService } from "../../../api/UserManagements/services/roleAndPermissionService";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";
import { toPascalCase } from "../../../utils/format_text";
import { useColumnSearchProps } from "../../../utils/SearchUtils";
import { getAllMenus } from "../../../api/Master/services/masterMenuService";
import type { IMenu } from "../../../api/Master/types/masterMenu.interface";

const RoleAndPermissionsForm: React.FC = () => {
  const { getColumnSearchProps } = useColumnSearchProps();

  const toggleMenuSelectionInModal = (id: number, value: boolean) => {
    const updateNode = (nodes: any[]): any[] =>
      nodes.map((node) => {
        if (node.id === id) {
          return { ...node, isSelected: value };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    setListMenu((prevMenu) => updateNode(prevMenu));
  };

  const toggleParentAndChildrenSelection = (
    parentId: number,
    value: boolean
  ) => {
    // Helper function untuk update semua children secara rekursif
    const updateChildrenRecursively = (nodes: any[]): any[] => {
      return nodes.map((node) => ({
        ...node,
        isSelected: value,
        // Jika node ini juga punya children, update mereka juga
        children: node.children
          ? updateChildrenRecursively(node.children)
          : undefined,
      }));
    };

    const updateNode = (nodes: any[]): any[] =>
      nodes.map((node) => {
        // Jika node ini adalah parent yang kita cari
        if (node.id === parentId) {
          return {
            ...node,
            isSelected: value, // Update parent-nya juga
            children: updateChildrenRecursively(node.children), // Update semua children-nya
          };
        }
        // Jika bukan, cari di dalam children-nya
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });

    setListMenu((prevMenu) => updateNode(prevMenu));
  };

  const columnListMenu: ColumnsType<any> = [
    {
      title: "Menu",
      dataIndex: "label",
      key: "label",
      width: "80%",
      render: (label: any, record: any) => {
        // Jika record memiliki children (ini adalah parent)
        if (
          record.children &&
          record.children.length > 0 &&
          Number(record.level ?? 0) > 0
        ) {
          // Cek status children
          const totalChildren = record.children.length;
          const selectedChildren = record.children.filter(
            (child: any) => child.isSelected
          ).length;

          const allChildrenSelected = totalChildren === selectedChildren;
          const someChildrenSelected =
            selectedChildren > 0 && !allChildrenSelected;

          const tooltipTitle = allChildrenSelected
            ? "Batal pilih semua"
            : "Pilih semua";

          return (
            <div className="flex justify-between items-center">
              {toPascalCase(label)}
              <Tooltip title={tooltipTitle}>
                <Checkbox
                  checked={allChildrenSelected}
                  indeterminate={someChildrenSelected}
                  onChange={(e) =>
                    toggleParentAndChildrenSelection(
                      record.id,
                      e.target.checked
                    )
                  }
                />
              </Tooltip>
            </div>
          );
        }
        return toPascalCase(label);
      },
    },
    {
      title: "Select",
      dataIndex: "isSelected",
      key: "isSelected",
      render: (_: any, record: any) => {
        // Jika record tidak memiliki children (ini adalah leaf node)
        if (!record.children) {
          return (
            <Checkbox
              checked={record.isSelected}
              onChange={(e) => {
                console.log(record);
                toggleMenuSelectionInModal(record.id, e.target.checked);
              }}
            />
          );
        }

        // Return null jika ada kasus lain (misal: children array kosong)
        return null;
      },
    },
  ];

  const [isSelectAllCreate, setIsSelectAllCreate] = useState(false);
  const [isSelectAllUpdate, setIsSelectAllUpdate] = useState(false);
  const [listMenu, setListMenu] = useState<IMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any[]>([]);

  const handleSelectAll = (
    permissionKey: "is_create" | "is_update",
    checked: boolean
  ) => {
    if (permissionKey === "is_create") {
      setIsSelectAllCreate(checked);
    } else {
      setIsSelectAllUpdate(checked);
    }

    const newSelectedMenu = selectedMenu.map((menu) => {
      return { ...menu, [permissionKey]: checked ? "1" : "0" };
    });
    setSelectedMenu(newSelectedMenu);
  };

  const columnSelectedMenu: ColumnsType<any> = [
    {
      title: "No",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Module",
      key: "module",
      render: (_: any, record: any) => {
        const parts = record.full_url.split(".");
        if (parts.length <= 1) {
          // Jika hanya ada satu bagian, anggap itu sebagai menu utama tanpa modul
          return toPascalCase(record.module || "");
        }
        // Ambil semua bagian kecuali yang terakhir sebagai modul
        const moduleParts = parts.slice(0, -1);
        return moduleParts
          .map((part: string) => toPascalCase(part))
          .join(" / ");
      },
    },
    {
      title: "Menu",
      key: "menu",
      render: (_: any, record: any) => {
        const parts = record.full_url.split(".");
        // Ambil bagian terakhir sebagai nama menu
        const menuName = parts[parts.length - 1] || "";
        return toPascalCase(menuName);
      },
    },
    {
      title: "View",
      dataIndex: "is_view",
      key: "is_view",
      render: (_: any, record: any) => (
        <Checkbox
          className="custom-checkbox"
          checked={record.is_view == "1"}
          disabled
          onChange={(_) => {}}
        />
      ),
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Create</span>
          <Checkbox
            checked={isSelectAllCreate}
            onChange={(e) => handleSelectAll("is_create", e.target.checked)}
            // indeterminate={
            //   selectedMenu
            //     .filter((item) => item.permission_flags.is_create)
            //     .some((item) => item.is_create) && !isSelectAllCreate
            // }
          />
        </div>
      ),
      dataIndex: "is_create",
      key: "is_create",
      render: (_: any, record: any) => (
        <Checkbox
          className="custom-checkbox"
          checked={record.is_create == "1"}
          // disabled={!record.is_create}
          onChange={(e) => {
            const checked = e.target.checked;
            setSelectedMenu((prevSelectedMenu) =>
              prevSelectedMenu.map((menuItem) =>
                menuItem.id === record.id
                  ? { ...menuItem, is_create: checked ? "1" : "0" }
                  : menuItem
              )
            );
          }}
        />
      ),
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Update</span>
          <Checkbox
            checked={isSelectAllUpdate}
            onChange={(e) => handleSelectAll("is_update", e.target.checked)}
            // indeterminate={
            //   selectedMenu
            //     .filter((item) => item.permission_flags.is_update)
            //     .some((item) => item.is_update) && !isSelectAllUpdate
            // }
          />
        </div>
      ),
      dataIndex: "is_update",
      key: "is_update",
      render: (_: any, record: any) => (
        <Checkbox
          className="custom-checkbox"
          checked={record.is_update == "1"}
          // disabled={!record.permission_flags.is_update}
          onChange={(e) => {
            const checked = e.target.checked;
            setSelectedMenu((prevSelectedMenu) =>
              prevSelectedMenu.map((menuItem) =>
                menuItem.id === record.id
                  ? { ...menuItem, is_update: checked ? "1" : "0" }
                  : menuItem
              )
            );
          }}
        />
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            danger
            onClick={() => {
              setSelectedMenu((prevSelectedMenu) =>
                prevSelectedMenu.filter((menuItem) => menuItem.id !== record.id)
              );
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const columnPettyCash: ColumnsType<any> = [
    {
      title: "No",
      width: "10%",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Nama Petty Cash",
      dataIndex: "nama_petty_cash",
      key: "nama_petty_cash",
    },
    {
      title: "Select",
      dataIndex: "isChecked",
      key: "isChecked",
      align: "center",
      render: (_: any, record: any) => {
        return (
          <Checkbox
            className="custom-checkbox"
            checked={record.isChecked}
            onChange={(e) => {
              const checked = e.target.checked;
              setsettingPettyCash((prevSettingPettyCash) =>
                prevSettingPettyCash.map((item) =>
                  item.id === record.id ? { ...item, isChecked: checked } : item
                )
              );
            }}
          />
        );
      },
    },
  ];

  const columnLocation: ColumnsType<any> = [
    {
      title: "Location",
      dataIndex: "full_nama",
      key: "full_nama",
      ...getColumnSearchProps({
        dataIndex: "full_nama",
        label: "Location",
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
      title: "Type Location",
      dataIndex: "location_type",
      key: "location_type",
      render: (value: string) => toPascalCase(value ?? ""),
    },
    {
      title: "Select",
      dataIndex: "isChecked",
      key: "isChecked",
      render: (_: any, record: any) => {
        if (record.level === "2") {
          return (
            <Checkbox
              className="custom-checkbox"
              checked={record.isChecked}
              onChange={(e) => {
                const checked = e.target.checked;
                const updateIsChecked = (nodes: any[]): any[] =>
                  nodes.map((node) => {
                    if (node.id === record.id) {
                      return { ...node, isChecked: checked };
                    }
                    if (node.children && node.children.length > 0) {
                      return {
                        ...node,
                        children: updateIsChecked(node.children),
                      };
                    }
                    return node;
                  });

                setLocations((prevLocations) => updateIsChecked(prevLocations));
              }}
            />
          );
        }
      },
    },
  ];

  const navigate = useNavigate();

  const [settingPettyCash, setsettingPettyCash] = useState<ISettingPettyCash[]>(
    []
  );
  const [locations, setLocations] = useState<ILocation[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);

  const [isModalAddMenu, setIsModalAddMenu] = useState<boolean>(false);

  const [isKasirPettyCash, setIsKasirPettyCash] = useState(false);
  const [isAdminWarehouse, setIsAdminWarehouse] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<string>("");

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
  } = useForm({});

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
      collectKeys(locations);
      setExpandedRowKeys(allKeys);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const handleOpenAddMenuModal = () => {
    const selectedIds = new Set(selectedMenu.map((item) => item.id));

    const syncIsSelectedRecursive = (nodes: any[]): any[] => {
      return nodes.map((node) => {
        const updatedNode = { ...node, isSelected: selectedIds.has(node.id) };
        if (node.children) {
          updatedNode.children = syncIsSelectedRecursive(node.children);
        }
        return updatedNode;
      });
    };

    setListMenu((currentListMenu) => syncIsSelectedRecursive(currentListMenu));
    setIsModalAddMenu(true);
  };

  const itemTabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Menu Settings",
      children: (
        <>
          <div className="mb-4 flex justify-end">
            <PrimaryButton onClick={handleOpenAddMenuModal}>Add</PrimaryButton>
          </div>
          <TableApp
            dataSource={selectedMenu}
            columns={columnSelectedMenu}
            pagination={false}
            rowKey="id"
          />
        </>
      ),
    },
    {
      key: "2",
      label: "Petty Cash Settings",
      disabled: !isKasirPettyCash,
      children: (
        <TableApp
          dataSource={settingPettyCash}
          columns={columnPettyCash}
          pagination={false}
          rowKey="id"
        />
      ),
    },
    {
      key: "3",
      label: "Location Settings",
      disabled: !isAdminWarehouse,
      children: (
        <>
          <div className="mb-4 flex justify-end">
            <PrimaryButton onClick={handleToggleExpandAll}>
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </PrimaryButton>
          </div>
          <TableApp
            columns={columnLocation}
            dataSource={locations}
            expandable={{
              expandedRowKeys,
              onExpand: handleExpand,
            }}
            childrenColumnName="children"
            rowKey="id"
          />
        </>
      ),
    },
  ];

  const getMenus = (): void => {
    setIsLoadingModal(true);
    const promise = getAllMenus();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          // setListMenu(res.data.data);
          const transformMenuData = (nodes: IMenu[]) => {
            return nodes.map((node) => {
              const transformedNode: any = {
                id: node.id,
                key: node.url,
                label: node.menu_name,
                module: node.module,
                full_url: node.full_url,
                level: node.level ?? "0",
                api_grouped: node.api_grouped,
                is_view: node.is_view == "1",
                is_create: node.is_create == "1",
                is_update: node.is_update == "1",
                is_delete: node.is_delete == "1",
                is_approve: node.is_approve == "1",
                is_reject: node.is_reject == "1",
                isSelected: false,
              };

              if (node.children && node.children.length > 0) {
                transformedNode.children = transformMenuData(node.children);
              }

              return transformedNode;
            });
          };

          setListMenu(transformMenuData(res.data.data));
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getSettingPettyCashs = (): void => {
    setIsLoadingModal(true);
    getSettingPettyCash()
      .then((res) => {
        setIsLoadingModal(false);
        setsettingPettyCash(res.data.data);
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const getLocation = async () => {
    setIsLoadingModal(true);
    getMasterLocation()
      .then((res) => {
        setIsLoadingModal(false);
        const data = res.data.data.map((item: ILocation) => {
          const removeEmptyChildren = (item: ILocation) => {
            if (item.children?.length === 0) {
              delete item.children;
            } else {
              item.children = item.children?.map(removeEmptyChildren);
            }
            return item;
          };
          return removeEmptyChildren(item);
        });
        setLocations(data);
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedStatus) {
      setErrorStatus("Status harus diisi!");
      return;
    }

    if (selectedMenu.length === 0) {
      toast.error("Pilih minimal satu menu untuk role ini!");
      return;
    }

    const permissionFlags = [
      { key: "is_view", name: "view" },
      { key: "is_create", name: "create" },
      { key: "is_update", name: "update" },
    ];

    const permissions = selectedMenu.flatMap((menuItem) => {
      return permissionFlags
        .filter((flag) => menuItem[flag.key] == "1")
        .map((flag) => {
          const apiPermissions =
            menuItem.api_grouped?.[flag.name]?.map((api: any) => ({
              permission_name: api.name,
              guard_name: "api",
            })) || [];

          return {
            permission_name: `${menuItem.full_url}.${flag.name}`,
            guard_name: "web",
            api: apiPermissions,
          };
        });
    });

    if (!permissions.length) {
      toast.error("Tidak ada permission yang dipilih!");
      return;
    }

    const emptyPermissionsMenus = selectedMenu.filter(
      (item) =>
        !item.is_view &&
        !item.is_create &&
        !item.is_update &&
        !item.is_delete &&
        !item.is_approve &&
        !item.is_reject
    );

    if (emptyPermissionsMenus.length > 0) {
      toast.error(
        `Ada ${emptyPermissionsMenus.length} menu yang belum memiliki permission dipilih!`
      );
      return;
    }

    setIsLoading(true);

    const payload = {
      role_name: data.role_name,
      role_code: data.role_code,
      backdate_limit: data.backdate_limit,
      is_kasir_petty_cash: isKasirPettyCash ? 1 : 0,
      is_admin_warehouse: isAdminWarehouse ? 1 : 0,
      status: selectedStatus,
      permissions: permissions,
      petty_cash: isKasirPettyCash
        ? settingPettyCash
            .filter((item) => item.isChecked)
            .map((item) => ({
              petty_cash_settings_id: item.id,
            }))
        : null,
      locations: isAdminWarehouse
        ? (() => {
            const findCheckedLeafNodes = (nodes: ILocation[]): ILocation[] => {
              let result: ILocation[] = [];
              nodes.forEach((node) => {
                if (node.level === "2" && node.isChecked) {
                  result.push(node);
                } else if (node.children && node.children.length > 0) {
                  result = result.concat(findCheckedLeafNodes(node.children));
                }
              });
              return result;
            };
            const checkedLeafNodes = findCheckedLeafNodes(locations);
            const masterWarehouseIds = checkedLeafNodes.reduce<number[]>(
              (acc, item) => {
                if (item.id) acc.push(Number(item.id));
                if (item.warehouse_id) acc.push(Number(item.warehouse_id));
                return acc;
              },
              []
            );
            const uniqueIds = Array.from(new Set(masterWarehouseIds));
            return uniqueIds.map((id) => ({
              master_warehouse_id: id,
            }));
          })()
        : null,
    };

    console.log(payload);

    await createUserManagementService(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          toast.success(
            res.data.message || "Role and Permissions berhasil disimpan!"
          );
          navigate("/user-managements/role-permissions");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getMenus();
    getSettingPettyCashs();
    getLocation();
  }, []);

  return (
    <>
      <div className="flex justify-between mb-4">
        <MyBreadcrumb
          pageName="Role and Permissions"
          link="/user-managements/role-permissions"
          session="Tambah Data"
        />
        <PrimaryButton
          onClick={handleSubmitForm(onSubmit)}
          isLoading={isLoading}
        >
          Save
        </PrimaryButton>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default">
        <form
          onSubmit={handleSubmitForm(onSubmit)}
          encType="multipart/form-data"
        >
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6 ">
                <InputField
                  label="Role Name"
                  id="role_name"
                  type="text"
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Role Name harus diisi!",
                  }}
                />
                <InputField
                  label="Role Code"
                  id="role_code"
                  type="text"
                  register={registerForm}
                  errors={errorsForm}
                  validationSchema={{
                    required: "Role Code harus diisi!",
                  }}
                />
                <div className="flex gap-2 items-center">
                  <InputField
                    label="Backdate Limit"
                    id="backdate_limit"
                    type="number"
                    register={registerForm}
                    errors={errorsForm}
                    validationSchema={{
                      required: "Backdate Limit harus diisi!",
                    }}
                  />
                  <p className="pt-8">hari</p>
                </div>
              </div>
            </div>
            <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
            <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
              <div className="flex gap-3 items-center">
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6">
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsKasirPettyCash(value.target.checked);
                      }}
                      checked={isKasirPettyCash}
                      className="custom-checkbox"
                    >
                      {"Kasir Petty Cash"}
                    </Checkbox>
                  </div>
                  <div>
                    <Checkbox
                      onChange={(value) => {
                        setIsAdminWarehouse(value.target.checked);
                      }}
                      checked={isAdminWarehouse}
                      className="custom-checkbox"
                    >
                      {"Admin Warehouse"}
                    </Checkbox>
                  </div>
                </div>
              </div>
              <SelectGroupField
                label="Status"
                options={["Active", "Inactive"]}
                value={selectedStatus}
                required
                error={errorStatus}
                onChange={(value: string) => {
                  setSelectedStatus(value);
                  setErrorStatus("");
                }}
              />
            </div>
          </div>
        </form>
        <Tabs
          defaultActiveKey="1"
          items={itemTabs}
          onChange={() => {}}
          className="custom-tabs p-6"
        />
      </div>
      <Spin spinning={isLoadingModal} fullscreen />

      {isModalAddMenu && (
        <Modal
          title={
            <>
              List Menu
              <div className="flex gap-4 justify-end px-5 pb-5">
                <PrimaryButton
                  onClick={() => {
                    // Logika save disederhanakan: ambil yang 'isSelected' dan set default permission
                    const collectSelectedMenus = (nodes: any[]): any[] => {
                      let result: any[] = [];
                      nodes.forEach((node) => {
                        if (!node.children || node.children.length === 0) {
                          if (node.isSelected) {
                            result.push({
                              id: node.id,
                              module: node.module,
                              menu: node.label,
                              key: node.key,
                              level: node.level,
                              full_url: node.full_url,
                              api_grouped: node.api_grouped,
                              is_view: "1",
                              is_create: "0",
                              is_update: "0",
                            });
                          }
                        } else if (node.children && node.children.length > 0) {
                          result = result.concat(
                            collectSelectedMenus(node.children)
                          );
                        }
                      });
                      return result;
                    };

                    const newSelectedMenus = collectSelectedMenus(listMenu);
                    // Ganti seluruh list dengan yang baru, hindari duplikasi
                    const existingIds = new Set(
                      selectedMenu.map((item) => item.id)
                    );
                    const finalMenus = [...selectedMenu];
                    newSelectedMenus.forEach((newMenu) => {
                      if (!existingIds.has(newMenu.id)) {
                        finalMenus.push(newMenu);
                      }
                    });

                    const finalSelectedMenus = collectSelectedMenus(listMenu);

                    setSelectedMenu(finalSelectedMenus);
                    setIsModalAddMenu(false);
                  }}
                >
                  Simpan
                </PrimaryButton>
              </div>
            </>
          }
          open={isModalAddMenu}
          onCancel={() => setIsModalAddMenu(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          width={1100}
          styles={{
            body: {
              maxHeight: "70vh",
              overflowY: "auto",
              minHeight: "30vh",
            },
          }}
        >
          <TableApp
            dataSource={listMenu}
            columns={columnListMenu}
            pagination={false}
            expandable={{
              expandedRowKeys,
              onExpand: handleExpand,
            }}
            childrenColumnName="children"
            rowKey="id"
            scroll={{ x: 1000, y: 500 }}
          />
        </Modal>
      )}
    </>
  );
};

export default RoleAndPermissionsForm;
