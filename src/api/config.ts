import axios from "axios";
import { toast } from "react-toastify";
import { navigate } from "../navigate";

const axiosInstance = axios.create();
export const baseUrl = import.meta.env.VITE_API_BASE_URL;

const API_ERROR_TOAST_ID = "api-error-toast";

axiosInstance.interceptors.request.use(
  (config) => {
    let isFileUpload = false;
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      for (let value of config.data.values()) {
        if (
          value instanceof File ||
          (Array.isArray(value) && value[0] instanceof File)
        ) {
          isFileUpload = true;
          break;
        }
      }
    }

    config.baseURL = baseUrl;
    config.headers = Object.assign(
      config.headers,
      {
        "Content-Type": isFileUpload
          ? "multipart/form-data"
          : "application/json",
        Accept: "application/json",
      },
      config.headers
    );

    let newUrl = config.url;
    newUrl = newUrl?.replace(/^\//, "api/");
    newUrl = newUrl?.replace(/\//g, ".");
    newUrl = newUrl?.replace(/.\d$/, ".*");
    newUrl = newUrl?.replace(/\?.+$/, "");

    console.log(
      `%c🚀 API: %c${newUrl}`,
      "color: #4CAF50; font-weight: bold;",
      "color: #2196F3; font-weight: bold;"
    );

    return config;
  },
  (error) => {
    console.log("🚀 ~ errors:", error.response.data);
    return Promise.reject(new Error(error));
  }
);

axiosInstance.interceptors.response.use(
  (config) => {
    // ... (kode response success Anda tidak berubah)
    return config;
  },
  async (error) => {
    const responseData = error.response?.data;
    const status = error.response?.status;

    if (status === 401) {
      // ... (logika 401 Anda tidak berubah)
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("access_token");
      navigate("/login");
      toast.error(
        responseData?.message ||
          "Sesi Anda telah berakhir, silakan login kembali.",
        { toastId: "auth-error-toast" }
      );
      return Promise.reject(error);
    }

    let errorMessage = "Terjadi kesalahan pada server.";

    if (responseData?.errors && typeof responseData.errors === "object") {
      const firstError = Object.values(responseData.errors)[0];
      if (typeof firstError === "string") {
        errorMessage = firstError;
      } else if (Array.isArray(firstError) && firstError.length > 0) {
        errorMessage = firstError[0];
      }
    } else if (
      responseData?.errors &&
      typeof responseData.errors === "string" &&
      responseData?.errors?.includes("SQL")
    ) {
      errorMessage = responseData.errors?.split(":")[1] ?? responseData.errors;
    } else if (
      responseData?.errors &&
      typeof responseData.errors === "string"
    ) {
      errorMessage = responseData.errors;
    } else if (
      responseData?.message &&
      typeof responseData.message === "string"
    ) {
      errorMessage = responseData.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (!toast.isActive(API_ERROR_TOAST_ID)) {
      toast.error(errorMessage, {
        toastId: API_ERROR_TOAST_ID, // 3. Set toastId di sini
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
