import { LeftCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ConfigProvider, Menu } from "antd";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useProfileContext } from "../../context/profile_context";
import Logo from "../../images/logo/logo.svg";
import { itemSidebar } from "../../utils/menu_sidebar";
import { permissionKey } from "../../utils/permission_key";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { profile } = useProfileContext();

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const findParentKey = (
    key: string,
    menuItems: MenuProps["items"]
  ): string | null => {
    for (const item of menuItems || []) {
      if (item && "children" in item && item.children) {
        if (item.children.some((child) => child && child.key === key)) {
          return item.key as string;
        }
        const parentKey = findParentKey(key, item.children);
        if (parentKey) {
          return parentKey;
        }
      }
    }
    return null;
  };

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));

    if (latestOpenKey) {
      const parentKey = findParentKey(latestOpenKey, items);

      // Jika tidak punya parent (menu utama), tutup semua yang lain
      if (!parentKey) {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      } else {
        // Jika punya parent, tutup semua yang selevel
        const levelKeys = openKeys.filter(
          (key) => findParentKey(key, items) === parentKey
        );

        const newOpenKeys = openKeys
          .filter((key) => !levelKeys.includes(key))
          .concat(latestOpenKey);

        setOpenKeys(newOpenKeys);
      }
    } else {
      setOpenKeys(keys);
    }
  };

  const filterMenuByPermissions = (
    menuItems: MenuProps["items"],
    permissions: string[]
  ): MenuProps["items"] => {
    return (menuItems || [])
      .map((item) => {
        if (!item) return null;
        // Dashboard selalu tampil
        if (item.key === "dashboard") return item;
        if ("children" in item && item.children) {
          const filteredChildren = filterMenuByPermissions(
            item.children,
            permissions
          );
          if (filteredChildren && filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
          return null;
        }
        if (item.key && permissionKey[item.key as string]) {
          return permissions.includes(permissionKey[item.key as string])
            ? item
            : null;
        }
        return null;
      })
      .filter(Boolean) as MenuProps["items"];
  };

  const items: MenuProps["items"] = filterMenuByPermissions(
    itemSidebar,
    profile?.permissions || []
  );

  useEffect(() => {
    console.log("Current Pathname:", pathname.replace(/^\//, "").split("/"));

    setOpenKeys(pathname.replace(/^\//, "").split("/")); // Ambil parent pertama
  }, [pathname]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-primary duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-gray-3"
        >
          <LeftCircleOutlined className="text-gray-3" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="style-1  flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 lg:mt-2 lg:px-2">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  darkItemHoverBg: "#44444e", // Background color on hover
                  darkItemHoverColor: "#44444e", // Text color on hover
                },
              },
            }}
          >
            <Menu
              mode="inline"
              theme="dark"
              defaultSelectedKeys={[pathname]}
              defaultOpenKeys={[]}
              selectedKeys={pathname.replace(/^\//, "").split("/")} // Ambil bagian terakhir sebagai selectedKeys
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              items={items}
            />
          </ConfigProvider>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
