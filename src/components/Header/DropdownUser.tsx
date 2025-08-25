import { DownOutlined, UserOutlined } from "@ant-design/icons";
import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Dropdown } from "antd";
import type { ItemType } from "antd/es/menu/interface";
import { useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../api/config";
import { useAuthContext } from "../../context/auth_context";
import { useProfileContext } from "../../context/profile_context";
import UserOne from "../../images/user/user-01.png";
import { ModalConfirm } from "../Modal/ModalConfirm";

const DropdownUser = () => {
  const { logout } = useAuthContext();
  const { logoutProfile, profile } = useProfileContext();
  const profileImage =
    `${baseUrl.replace(/\/api$/, "")}/storage/${profile?.user?.avatar_path}` ||
    UserOne;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menu: ItemType[] = [
    {
      key: "/profile",
      icon: <UserIcon style={{ height: "16", width: "18" }} />,
      label: <Link to="/profile">My Profile</Link>,
      style: { fontSize: "14px", fontWeight: "bold", padding: "10px 20px" },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: (
        <ArrowRightStartOnRectangleIcon style={{ height: "16", width: "18" }} />
      ),
      label: (
        <span
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "inherit",
            fontWeight: "bold",
          }}
        >
          Log Out
        </span>
      ),
      style: { fontSize: "14px", fontWeight: "bold", padding: "10px 20px" },
      onClick: () => {
        ModalConfirm({
          title: "Konfirmasi Logout",
          message:
            "Apakah Anda yakin ingin keluar dari sistem? Semua data yang belum disimpan akan hilang.",
          buttons: [
            {
              label: "Tidak",
              color: "red-500",
              onClick: async () => {},
            },
            {
              label: "Ya",
              color: "primary",
              onClick: async () => {
                logout();
                logoutProfile();
              },
            },
          ],
        });
      },
    },
  ];
  return (
    <Dropdown
      menu={{ items: menu }}
      trigger={["click"]}
      onOpenChange={(open) => setIsDropdownOpen(open)}
    >
      <Link
        to="#"
        className="flex items-center gap-4"
        onClick={(e) => e.preventDefault()}
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black">
            {profile?.user.nama_lengkap}
          </span>
          <span className="block text-xs text-black">{profile?.roles}</span>
        </span>
        <Avatar
          size={40}
          icon={<UserOutlined />}
          src={profileImage}
          className="border-4 border-gray-200"
        />
        <DownOutlined
          style={{
            transition: "transform 0.3s ease",
            transform: `rotate(${isDropdownOpen ? 180 : 0}deg)`,
            color: "black",
          }}
        />
      </Link>
    </Dropdown>
  );
};

export default DropdownUser;
