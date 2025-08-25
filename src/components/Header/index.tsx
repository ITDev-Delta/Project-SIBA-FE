import { MenuOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Layout } from "antd";
import { Link } from "react-router-dom";
import LogoIcon from "../../images/logo/logo-icon.svg";
import DropdownUser from "./DropdownUser";

const { Header } = Layout;

const CustomHeader = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "#FFFFF", // atau warna primary
            headerHeight: 64,
          },
        },
        // token: { colorText: "#FFFFFF" },
      }}
    >
      <Header className="sticky top-0 z-998 flex w-full bg-white/95 backdrop-blur-md border-b border-stroke drop-shadow-sm p-0 transition-all duration-200">
        <div className="flex flex-grow items-center justify-between px-4 py-3">
          {/* Left Section - Logo & Hamburger */}
          <div className="lg:hidden flex items-center gap-3 sm:gap-4">
            {/* Hamburger Toggle BTN (mobile only) */}
            <Button
              icon={<MenuOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-998 rounded-md border border-stroke bg-white hover:bg-gray-50 shadow-sm lg:hidden transition-colors duration-200"
              size="small"
            />

            {/* Logo & Brand */}
            <Link className="flex items-center gap-2 flex-shrink-0" to="/">
              <img src={LogoIcon} alt="Logo" className="h-8 w-8" />
              <span className="hidden sm:inline-block font-bold text-lg text-primary tracking-wide">
                AKUI ERP
              </span>
            </Link>
          </div>

          {/* Center Section - Spacer for desktop, hidden on mobile */}
          <div className="flex-1 hidden lg:block" />

          {/* Divider - only visible on desktop */}
          <div className="hidden lg:block h-8 w-px bg-stroke mx-6" />

          {/* Right Section - User Actions */}
          <div className="flex items-center gap-3 2xsm:gap-4">
            <ul className="flex items-center gap-2 2xsm:gap-3">
              {/* Dark Mode Toggler - placeholder for future */}
              {/* <DarkModeSwitcher /> */}

              {/* Notification Menu - placeholder for future */}
              {/* <DropdownNotification /> */}
            </ul>

            {/* User Area */}
            <DropdownUser />
          </div>
        </div>
      </Header>
    </ConfigProvider>
  );
};

export default CustomHeader;
