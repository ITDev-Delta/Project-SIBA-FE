import {
  DownOutlined,
  EditOutlined,
  UpOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Descriptions, Modal, Spin, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { baseUrl } from "../../api/config";
import { updateUserAccountService } from "../../api/UserManagements/services/userAccountService";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputField from "../../components/Forms/InputField";
import { useProfileContext } from "../../context/profile_context";

const Profile: React.FC = () => {
  const { profile, getProfile, isLoading } = useProfileContext();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [image, setImage] = useState<File>();

  const [showAllPermissions, setShowAllPermissions] = useState(false); // <--- Add this state

  const PERMISSIONS_DISPLAY_LIMIT = 12; // Define your limit here

  const {
    setValue: setValueForm,
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: errorsForm },
    reset: resetForm,
  } = useForm({});

  useEffect(() => {
    if (!profile) {
      getProfile();
    }
  }, [profile, getProfile]);

  useEffect(() => {
    if (profile) {
      const imageUrl = baseUrl.replace(/\/api$/, "");
      setPreviewImage(
        profile.user?.avatar_path
          ? `${imageUrl}/storage/${profile.user?.avatar_path}`
          : null
      );

      setValueForm("nip", profile.user?.nip || "");
      setValueForm("nama", profile.user?.nama_lengkap || "");
      setValueForm("username", profile.user?.username || "");
      setValueForm("email", profile.user?.email || "");
      setValueForm("nomor_telepon", profile.user?.nomor_telepon || "");
    }
  }, [profile, setValueForm]);

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setPreviewImage(
      profile?.user?.avatar_path
        ? `${baseUrl.replace(/\/api$/, "")}/storage/${
            profile?.user?.avatar_path
          }`
        : null
    );
    setImage(undefined);
    resetForm();
  };

  const handleFileChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return false;
    }
    setPreviewImage(URL.createObjectURL(file));
    setImage(file);
    return false;
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // Validasi jika gak ada perubahan
    if (
      image === undefined &&
      data.nip === profile?.user?.nip &&
      data.nama === profile?.user?.nama_lengkap &&
      data.username === profile?.user?.username &&
      data.email === profile?.user?.email &&
      data.nomor_telepon === profile?.user?.nomor_telepon &&
      !data.old_password &&
      !data.new_password
    ) {
      toast.error("Tidak ada perubahan yang dilakukan!");
      return;
    }

    // Validasi password jika diisi
    if (data.old_password) {
      if (!data.new_password || data.new_password === "") {
        toast.error("Isi password baru jika ingin mengubah password!");
        return;
      }
    }

    if (data.new_password) {
      if (!data.old_password || data.old_password === "") {
        toast.error("Isi password lama jika ingin mengubah password!");
        return;
      }
      if (data.new_password.length < 8) {
        toast.error("Password minimal 8 karakter!");
        return;
      }
      if (data.new_password !== data.password_confirmation) {
        toast.error("Password dan Password Confirmation tidak cocok!");
        return;
      }
    }

    setIsLoadingButton(true);

    const payload = {
      avatar: image ?? null,
      nip: data.nip,
      nama_lengkap: data.nama,
      username: data.username,
      old_password: data.old_password || null,
      password: data.new_password || null,
      password_confirmation: data.password_confirmation || null,
      email: data.email,
      nomor_telepon: data.nomor_telepon,
      roles_id: profile?.user?.roles_id,
      status: profile?.user?.status,
    };

    console.log(payload);

    await updateUserAccountService(payload)
      .then((res) => {
        setIsLoadingButton(false);
        if (res.status === 200 || res.status === 201) {
          setIsLoadingButton(false);
          toast.success("Profile updated successfully!");
          getProfile();
          setIsEditModalVisible(false);
          resetForm();
          handleModalClose();
        } else {
          setIsLoadingButton(false);
          toast.error("Failed to edit data");
        }
      })
      .catch((_) => {
        setIsLoadingButton(false);
        toast.error("Terjadi kesalahan saat mengedit data");
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin spinning={isLoading} />
      </div>
    );
  }

  const cardRef = useRef<HTMLDivElement | null>(null); // <-- Tambahkan ref untuk menunjuk ke Card

  // Effect untuk menangani auto-scroll
  useEffect(() => {
    // Hanya berjalan jika ref sudah terpasang dan showAllPermissions berubah
    if (showAllPermissions) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }
  }, [showAllPermissions]); // <-- Dijalankan setiap kali showAllPermissions berubah

  return (
    <div className="mx-auto max-w-screen-2xl px-4 md:px-6 2xl:px-10">
      <Breadcrumb pageName="Profile" />
      <div className="mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  src={previewImage || profile?.user?.avatar_path}
                  className="border-4 border-gray-200"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {profile?.user?.nama_lengkap || "No Name"}
            </h3>
            <p className="text-gray-600 mb-4">
              {profile?.user?.email || "No Email"}
            </p>

            {/* Role Badge */}
            <div className="mb-4">
              <Tag color="blue" className="px-3 py-1">
                {profile?.roles?.join(", ") || "No Role"}
              </Tag>
            </div>

            <PrimaryButton
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              className="w-full"
            >
              Edit Profile
            </PrimaryButton>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card title="Profile Information">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="NIP">
                {profile?.user?.nip || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Full Name">
                {profile?.user?.nama_lengkap || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {profile?.user?.username || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {profile?.user?.email || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {profile?.user?.nomor_telepon || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {profile?.location?.length || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                {profile?.roles?.join(", ") || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Petty Cash">
                {profile?.petty_cash?.length || "-"}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Permissions Card */}
          {profile?.permissions && profile.permissions.length > 0 && (
            <div ref={cardRef}>
              <Card title="Permissions" className="mt-6">
                {(() => {
                  const filteredPermissions = profile.permissions.filter(
                    (permission) => !permission.startsWith("api")
                  );

                  // Jika izin tidak banyak, tampilkan biasa tanpa efek buka-tutup
                  if (filteredPermissions.length <= PERMISSIONS_DISPLAY_LIMIT) {
                    return (
                      <div className="flex flex-wrap gap-2">
                        {filteredPermissions.map((permission, index) => (
                          <Tag key={index} color="green">
                            {permission}
                          </Tag>
                        ))}
                      </div>
                    );
                  }

                  // Tampilan dengan efek buka-tutup
                  return (
                    <div className="relative">
                      {/* Kontainer Izin dengan tinggi yang bisa berubah */}
                      <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          // 👇 Perbaikan utama ada di sini
                          showAllPermissions ? "max-h-[9999px]" : "max-h-28"
                        }`}
                      >
                        <div className="flex flex-wrap gap-2">
                          {filteredPermissions.map((permission, index) => (
                            <Tag key={index} color="green">
                              {permission}
                            </Tag>
                          ))}
                        </div>
                      </div>

                      {/* Overlay Gradasi & Tombol "Tampilkan Semua" (hanya saat ditutup) */}
                      <div
                        className={`absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent transition-opacity duration-300 flex justify-center items-end pb-2 ${
                          showAllPermissions
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                        }`}
                      >
                        <Button
                          type="primary"
                          shape="round"
                          ghost
                          icon={<DownOutlined />}
                          onClick={() => setShowAllPermissions(true)}
                        >
                          Tampilkan Semua
                        </Button>
                      </div>

                      {/* Tombol "Tampilkan lebih sedikit" (hanya saat dibuka) */}
                      {showAllPermissions && (
                        <div className="flex justify-center mt-4">
                          <Button
                            type="link"
                            icon={<UpOutlined />}
                            onClick={() => setShowAllPermissions(false)}
                          >
                            Tampilkan lebih sedikit
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalVisible}
        title={
          <>
            <h4>Edit Profile</h4>
            <div className="flex gap-4 justify-end px-5">
              <PrimaryButton
                onClick={handleSubmitForm(onSubmit)}
                isLoading={isLoadingButton}
              >
                Save
              </PrimaryButton>
            </div>
          </>
        }
        onCancel={handleModalClose}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        width={800}
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            minHeight: "30vh",
          },
        }}
      >
        <form
          onSubmit={handleSubmitForm(onSubmit)}
          encType="multipart/form-data"
        >
          {/* Main grid container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-4">
            {/* --- Avatar Section --- */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium">Avatar</label>
              <div className="flex items-center gap-4">
                <Avatar
                  size={70}
                  icon={<UserOutlined />}
                  src={previewImage}
                  className="border-4 border-gray-200"
                />
                <label className="cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-semibold text-sm">
                  Ubah Foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileChange(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* --- Personal Information Section --- */}
            <InputField
              label="NIP"
              id="nip"
              type="text"
              disabled
              defaultValue={profile?.user?.nip || ""}
              register={registerForm}
              errors={errorsForm}
              validationSchema={{
                required: "NIP wajib diisi!",
              }}
            />

            <InputField
              label="Nama Lengkap"
              id="nama"
              type="text"
              defaultValue={profile?.user?.nama_lengkap || ""}
              register={registerForm}
              errors={errorsForm}
              validationSchema={{
                required: "Nama wajib diisi!",
              }}
            />

            <InputField
              label="Username"
              id="username"
              type="text"
              defaultValue={profile?.user?.username || ""}
              register={registerForm}
              errors={errorsForm}
              validationSchema={{
                required: "Username wajib diisi!",
              }}
            />

            <InputField
              label="Email"
              id="email"
              type="email"
              defaultValue={profile?.user?.email || ""}
              register={registerForm}
              errors={errorsForm}
              validationSchema={{
                required: "Email wajib diisi!",
              }}
            />

            <div className="md:col-span-2">
              <InputField
                label="Nomor Telepon"
                id="nomor_telepon"
                type="text"
                defaultValue={profile?.user?.nomor_telepon || ""}
                register={registerForm}
                errors={errorsForm}
                validationSchema={{
                  required: "Nomor telepon wajib diisi!",
                }}
              />
            </div>

            {/* --- Password Section --- */}
            <div className="md:col-span-2">
              <hr className="my-4" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Ubah Password
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Kosongkan jika Anda tidak ingin mengubah password.
              </p>
            </div>

            <InputField
              label="Password Lama"
              id="old_password"
              type="password"
              register={registerForm}
              errors={errorsForm}
              validationSchema={{}}
            />

            {/* This empty div acts as a spacer in the grid on medium screens and up */}
            <div></div>

            <InputField
              label="Password Baru"
              id="new_password"
              type="password"
              register={registerForm}
              errors={errorsForm}
              validationSchema={{}}
            />

            <InputField
              label="Konfirmasi Password Baru"
              id="password_confirmation"
              type="password"
              register={registerForm}
              errors={errorsForm}
              validationSchema={{}}
            />
          </div>
        </form>
      </Modal>

      <Spin spinning={isLoading} />
    </div>
  );
};

export default Profile;
