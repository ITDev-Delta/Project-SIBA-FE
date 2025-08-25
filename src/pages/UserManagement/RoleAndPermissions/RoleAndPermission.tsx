import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button, Checkbox, Modal, Spin, Tabs } from "antd";
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
import { getAllMenus } from "../../../api/Master/services/masterMenuService";
import type { ILocation } from "../../../api/Master/types/location.interface";
import type { IMenu } from "../../../api/Master/types/masterMenu.interface";
import {
  getServiceUserManagement,
  getServiceUserManagementById,
  updateUserManagementService,
} from "../../../api/UserManagements/services/roleAndPermissionService";
import type {
  IRoleAndPermission,
  IRoleAndPermissionDetail,
} from "../../../api/UserManagements/types/roleAndPermission.interface";
import MyBreadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../components/Button/PrimaryButton";
import InputField from "../../../components/Forms/InputField";
import SelectGroupField from "../../../components/Forms/SelectGroupField";
import TableApp from "../../../components/Tables/TableApp";
import { toPascalCase } from "../../../utils/format_text";
import { useColumnSearchProps } from "../../../utils/SearchUtils";

const RoleAndPermissions: React.FC = () => {
  const {
    getValues: getValuesForm,
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    reset: resetForm,
  } = useForm({});

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();

  const [searchStatus, setSearchStatus] = useState<string>();
  const { getColumnSearchProps } = useColumnSearchProps();

  const [isSelectAllCreate, setIsSelectAllCreate] = useState(false);
  const [isSelectAllUpdate, setIsSelectAllUpdate] = useState(false);

  const columns: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Role Name",
      children: [
        {
          title: (
            <InputField
              id="role_name_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getRoleAndPermission(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "role_name",
          align: "center",
          key: "role_name",
        },
      ],
      align: "center",
      sorter: (a, b) => a.role_name.localeCompare(b.role_name),
    },
    {
      title: "Role Code",
      children: [
        {
          title: (
            <InputField
              id="role_code_search"
              type="text"
              register={registerForm}
              errors={errorsForm}
              onSearch={(_) =>
                getRoleAndPermission(pagination.current, pagination.pageSize)
              }
              validationSchema={{}}
            />
          ),
          dataIndex: "role_code",
          align: "center",
          key: "role_code",
        },
      ],
      align: "center",
      sorter: (a, b) => a.role_code.localeCompare(b.role_code),
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
          dataIndex: "status",
          key: "status",
          render: (status: string) => {
            return (
              <span
                className={`px-2 py-1 rounded-md text-xs ${
                  status === "Draft" ? "text-black" : "text-white"
                } ${status === "Active" ? "bg-green-600" : "bg-red-600"}`}
              >
                {status === "Active" ? "Active" : "Inactive"}
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
      render: (record: any) => {
        return (
          <PencilSquareIcon
            className="h-5 w-5 cursor-pointer"
            onClick={() => getRoleAndPermissionById(record.id)}
          />
        );
      },
    },
  ];

  const columnListMenu: ColumnsType<any> = [
    {
      title: "Menu",
      dataIndex: "label",
      key: "label",
      width: "80%",
      render: (label: any) => {
        return toPascalCase(label);
      },
    },
    {
      title: "Select",
      dataIndex: "isSelected",
      key: "isSelected",
      render: (_: any, record: any) => {
        if (!record.children) {
          return (
            <Checkbox
              checked={record.isSelected}
              onChange={(e) =>
                toggleMenuSelectionInModal(record.id, e.target.checked)
              }
            />
          );
        }
      },
    },
  ];

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

                // Helper function to update isChecked recursively
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

  const [roleAndPermissions, setRoleAndPermissions] = useState<
    IRoleAndPermission[]
  >([]);
  const [settingPettyCash, setsettingPettyCash] = useState<ISettingPettyCash[]>(
    []
  );
  const [locations, setLocations] = useState<ILocation[]>([]);

  const [listMenu, setListMenu] = useState<IMenu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] =
    useState<IRoleAndPermissionDetail>();

  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddMenu, setIsModalAddMenu] = useState<boolean>(false);

  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isKasirPettyCash, setIsKasirPettyCash] = useState<boolean>(false);
  const [isAdminWarehouse, setIsAdminWarehouse] = useState<boolean>(false);

  const [errorStatus, setErrorStatus] = useState<string>("");

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
          />
        </>
      ),
    },
    {
      key: "2",
      label: "Petty Cash Settings",
      disabled: !isKasirPettyCash,
      children: (
        <>
          <TableApp
            dataSource={settingPettyCash}
            columns={columnPettyCash}
            pagination={false}
          />
        </>
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

  const handleView = (record: IRoleAndPermissionDetail) => {
    console.log(record);

    setSelectedRecord(record);
    setSelectedStatus(record.status);
    setIsKasirPettyCash(record.is_kasir_petty_cash == "1");
    setIsAdminWarehouse(record.is_admin_warehouse == "1");

    const processedMenus: { [key: string]: any } = {};
    if (record.role?.permissions) {
      record.role.permissions.forEach((p) => {
        const parts = p.name.split(".");
        const action = parts.pop();
        const full_url = parts.join(".");
        if (!processedMenus[full_url]) {
          const originalMenu = findMenuByFullUrl(listMenu, full_url);

          if (originalMenu) {
            processedMenus[full_url] = {
              ...originalMenu,
              is_view: "0",
              is_create: "0",
              is_update: "0",
            };
          }
        }
        if (processedMenus[full_url] && action) {
          processedMenus[full_url][`is_${action}`] = "1";
        }
      });
    }

    setSelectedMenu(Object.values(processedMenus));

    // Update petty cash settings
    updatePettyCashSettings(record.petty_cash);

    // Update locations
    setLocations(updateLocationChecked(locations, record.locations));

    setIsModalOpen(true);
  };

  // Helper function to find a menu item by full_url in a nested structure
  const findMenuByFullUrl = (
    nodes: any[],
    fullUrl: string
  ): any | undefined => {
    for (const node of nodes) {
      if (node.full_url === fullUrl) {
        return node;
      }
      if (node.children) {
        const found = findMenuByFullUrl(node.children, fullUrl);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  // Helper function to update petty cash settings
  const updatePettyCashSettings = (pettyCashData: any[]) => {
    settingPettyCash.map((item) => {
      const matchingPettyCash = pettyCashData.find(
        (pc) => Number(pc.petty_cash_settings_id) === item.id
      );

      item.isChecked = !!matchingPettyCash;
      item.id_petty_cash_role = matchingPettyCash?.id;

      return item;
    });
  };

  // Helper function to update location checked status recursively
  const updateLocationChecked = (
    locations: ILocation[],
    recordLocations: any[]
  ): any[] => {
    return locations.map((item) => {
      const matchingLocation = recordLocations.find(
        (loc) => Number(loc.master_warehouse_id) === item.id
      );

      const updatedItem = {
        ...item,
        isChecked: !!matchingLocation,
        id_location_role: matchingLocation ? matchingLocation.id : undefined,
      };

      // Recursively update children if they exist
      if (updatedItem.children && updatedItem.children.length > 0) {
        updatedItem.children = updateLocationChecked(
          updatedItem.children,
          recordLocations
        );
      }

      return updatedItem;
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(undefined);
    setSelectedStatus("");
    setErrorStatus("");
    setIsSelectAllCreate(false);
    setIsSelectAllUpdate(false);

    resetForm();
  };

  const getRoleAndPermission = (page: number, pageSize: number): void => {
    setIsLoadingModal(true);

    const params = {
      is_pagination: true,
      page,
      per_page: pageSize,
      role: getValuesForm("role_name_search"),
      role_code: getValuesForm("role_code_search"),
      status: searchStatus,
    };

    const promise = getServiceUserManagement(params);

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);

          setRoleAndPermissions(res.data.data);
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
                api_grouped: node.api_grouped,
                is_view: node.is_view == "0",
                is_create: node.is_create == "0",
                is_update: node.is_update == "0",
                // is_delete: node.is_delete == "1",
                // is_approve: node.is_approve == "1",
                // is_reject: node.is_reject == "1",
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

  const getRoleAndPermissionById = (id: string): void => {
    setIsLoadingModal(true);

    const promise = getServiceUserManagementById(id);

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

  const getSettingPettyCashs = (): void => {
    setIsLoadingModal(true);
    const promise = getSettingPettyCash();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setIsLoadingModal(false);
          setsettingPettyCash(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err, isLoading);
      });
  };

  const getLocation = async () => {
    setIsLoadingModal(true);

    const promise = getMasterLocation();

    promise
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
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
        }
      })
      .catch((err) => {
        setIsLoadingModal(false);
        console.log("err", err);
      });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedRecord) return;

    if (selectedMenu.length === 0) {
      toast.error("Pilih minimal satu menu untuk role ini!");
      return;
    }

    const permissionFlags = [
      { key: "is_view", name: "view" },
      { key: "is_create", name: "create" },
      { key: "is_update", name: "update" },
      { key: "is_delete", name: "delete" },
      { key: "is_approve", name: "approve" },
      { key: "is_reject", name: "reject" },
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
            .map((item) => {
              return {
                id: item.id_petty_cash_role ?? null,
                petty_cash_settings_id: item.id,
              };
            })
        : null,
      locations: isAdminWarehouse
        ? (() => {
            const findCheckedLeafNodes = (nodes: any[]): any[] => {
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

            // Ambil semua id, warehouse_id, dan id children (jika ada)
            const masterWarehouseIds = checkedLeafNodes.reduce<number[]>(
              (acc, item) => {
                if (item.id) acc.push(Number(item.id));
                if (item.warehouse_id) acc.push(Number(item.warehouse_id));
                if (Array.isArray(item.children) && item.children.length > 0) {
                  item.children.forEach((child: any) => {
                    if (child.id) acc.push(Number(child.id));
                  });
                }
                return acc;
              },
              []
            );

            const uniqueMasterWarehouseIds = Array.from(
              new Set(masterWarehouseIds)
            );

            // Helper function to recursively collect checked locations with id_location_role
            const collectCheckedLocations = (
              nodes: any[]
            ): { id: any; master_warehouse_id: number }[] => {
              let result: { id: any; master_warehouse_id: number }[] = [];
              nodes.forEach((node: any) => {
                if (node.isChecked && node.id_location_role) {
                  result.push({
                    id: node.id_location_role,
                    master_warehouse_id: node.id,
                  });
                }
                if (Array.isArray(node.children) && node.children.length > 0) {
                  result = result.concat(
                    collectCheckedLocations(node.children)
                  );
                }
              });
              return result;
            };

            const collectedLocationRoles = collectCheckedLocations(locations);

            // Gabungkan dengan uniqueMasterWarehouseIds yang belum punya id_location_role
            uniqueMasterWarehouseIds.forEach((mwId) => {
              // Jika belum ada di collectedLocationRoles
              if (
                !collectedLocationRoles.some(
                  (lr) => lr.master_warehouse_id === mwId
                )
              ) {
                collectedLocationRoles.push({
                  id: null,
                  master_warehouse_id: mwId,
                });
              }
            });

            return collectedLocationRoles;
          })()
        : null,
    };

    console.log(payload);

    await updateUserManagementService(
      payload,
      selectedRecord?.id.toString() ?? ""
    )
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoading(false);
          toast.success(res.data.message);
          getRoleAndPermission(pagination.current, pagination.pageSize);
          resetForm();
          handleModalClose();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    getSettingPettyCashs();
    getMenus();
    getLocation();
  }, []);

  useEffect(() => {
    getRoleAndPermission(1, 10);
  }, [searchStatus]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <MyBreadcrumb pageName="Role & Permissions" />
        <PrimaryButton
          onClick={() => navigate("/user-managements/role-permissions/add")}
        >
          Add Data
        </PrimaryButton>
      </div>
      <TableApp
        dataSource={roleAndPermissions}
        columns={columns}
        pagination={pagination}
        onPaginationChange={(page: number, size: number) =>
          getRoleAndPermission(page, size)
        }
      />
      <Spin spinning={isLoadingModal} fullscreen />

      {isModalOpen && selectedRecord && (
        <Modal
          key={selectedRecord?.id}
          title={
            <>
              <h4>Role {selectedRecord.role_name}</h4>
              <div className="flex justify-end gap-4 px-5">
                <PrimaryButton
                  onClick={handleSubmitForm(onSubmit)}
                  isLoading={isLoading}
                >
                  Save
                </PrimaryButton>
              </div>
            </>
          }
          open={isModalOpen}
          onOk={handleSubmitForm(onSubmit)}
          onCancel={handleModalClose}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          width={1200}
          styles={{
            body: {
              maxHeight: "70vh",
              overflowY: "auto",
              minHeight: "30vh",
            },
          }}
        >
          <>
            <form
              onSubmit={handleSubmitForm(onSubmit)}
              encType="multipart/form-data"
            >
              <div className="flex flex-col md:flex-row">
                {/* Section 1 */}
                <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6 p-5 ">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-6 2xl:gap-6 ">
                    <InputField
                      label="Role Name"
                      id="role_name"
                      type="text"
                      register={registerForm}
                      errors={errorsForm}
                      defaultValue={selectedRecord.role_name}
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
                      defaultValue={selectedRecord.role_code}
                      validationSchema={{
                        required: "Role Code harus diisi!",
                      }}
                    />
                    <div className="flex gap-2">
                      <InputField
                        label="Backdate Limit"
                        id="backdate_limit"
                        type="number"
                        register={registerForm}
                        errors={errorsForm}
                        defaultValue={selectedRecord.backdate_limit}
                        validationSchema={{
                          required: "Backdate Limit harus diisi!",
                        }}
                      />
                      <p className="place-content-end">hari</p>
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <div className="border-l-2 hidden md:block w-[2px] h-auto mt-5 mx-5" />
                {/* Section 2 */}
                <div className="flex-1 p-5 space-y-4 md:space-y-6 2xl:space-y-6">
                  <div className="flex gap-3 items-center">
                    <div className="flex-1 space-y-4 md:space-y-6 2xl:space-y-6">
                      <div>
                        <Checkbox
                          onChange={(value) => {
                            setIsKasirPettyCash(value.target.checked);
                          }}
                          defaultChecked={isKasirPettyCash}
                          checked={isKasirPettyCash}
                          className="custom-checkbox"
                        >
                          {"Kasir Petty Cash"}
                        </Checkbox>
                      </div>
                      <div></div>
                      <div>
                        <Checkbox
                          onChange={(value) => {
                            setIsAdminWarehouse(value.target.checked);
                          }}
                          defaultChecked={isAdminWarehouse}
                          checked={isAdminWarehouse}
                          className="custom-checkbox"
                        >
                          {"Admin Warehouse"}
                        </Checkbox>
                      </div>
                      <div></div>
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
          </>
        </Modal>
      )}

      {isModalAddMenu && (
        <Modal
          title={
            <>
              <div className="flex gap-4 justify-end px-5">
                <PrimaryButton
                  onClick={() => {
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
                              full_url: node.full_url,
                              api_grouped: node.api_grouped,
                              // permission_flags: node.permission_flags,
                              is_view: "1",
                              is_create: "0",
                              is_update: "0",
                              // is_delete: node.is_delete,
                              // is_approve: node.is_approve,
                              // is_reject: node.is_reject,
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
                  Save
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
          <>
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
              scroll={{ x: 1000, y: 400 }}
            />
          </>
        </Modal>
      )}
    </>
  );
};

export default RoleAndPermissions;
