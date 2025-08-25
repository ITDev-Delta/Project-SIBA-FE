import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import PrimaryButton from "../../components/Button/PrimaryButton";
import InputField from "../../components/Forms/InputField";
import { useAuthContext } from "../../context/auth_context";
import LogoIcon from "../../images/logo/logo-icon.svg";

const Login: React.FC = () => {
  const { login, isLoading } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    login(data.username, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <img src={LogoIcon} alt="Akui Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            PT AKUI BIRD NEST INDONESIA
          </h1>
          <p className="text-gray-600">Selamat datang kembali !</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Masuk ke Akun Anda
            </h2>
            <p className="text-gray-600 text-center mt-2">
              Silakan masukkan kredensial Anda
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              label="Username"
              id="username"
              type="text"
              placeholder="Masukkan username Anda"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Username harus diisi!",
                minLength: {
                  value: 3,
                  message: "Username minimal 3 karakter!",
                },
              }}
            />
            <InputField
              label="Password"
              id="password"
              type={"password"}
              placeholder="Masukkan password Anda"
              register={register}
              errors={errors}
              validationSchema={{
                required: "Password harus diisi!",
                minLength: {
                  value: 3,
                  message: "Password minimal 6 karakter!",
                },
              }}
            />
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
              </label>
              <a
                href="#"
                className="text-sm text-primary hover:text-strokedark font-medium"
              >
                Lupa password?
              </a>
            </div>

            <PrimaryButton
              isLoading={isLoading}
              type="submit"
              className="w-full py-3 text-base font-semibold flex items-center justify-center"
            >
              {"Masuk"}
            </PrimaryButton>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Butuh bantuan?{" "}
              <a
                href="#"
                className="text-primary hover:text-strokedark font-medium"
              >
                Hubungi administrator
              </a>
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 PT Akui Bird Nest Indonesia. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
