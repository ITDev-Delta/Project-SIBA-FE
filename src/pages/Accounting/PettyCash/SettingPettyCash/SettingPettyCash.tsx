import { Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import {
  editSettingPettyCash,
  getSettingPettyCash,
  getSettingPettyCashServiceById,
} from "../../../../api/Accounting/services/settingPettiCashService";
import type { ICoa } from "../../../../api/Accounting/types/coa.interface";
import type {
  ISettingPettyCash,
  ISettingPettyCashDetail,
} from "../../../../api/Accounting/types/settingPettyCash.interface";
import type { IDepartemen } from "../../../../api/Master/types/departemen.interface";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import InputField from "../../../../components/Forms/InputField";
import SelectGroupField from "../../../../components/Forms/SelectGroupField";
import { usePermission } from "../../../../hooks/usePermission";
import {
  handleInputChange,
  handleKeyDown,
} from "../../../../utils/InputCurrencyUtils";
import { formatCurrency } from "../../../../utils/format_currency";

const SettingPettyCash: React.FC = () => {
  const { hasPermission } = usePermission();

  const canCreate = hasPermission("setting-petty-cash-create");
  const canUpdate = hasPermission("setting-petty-cash-update");

  const [settingPettyCash, setsettingPettyCash] = useState<ISettingPettyCash[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<ISettingPettyCashDetail | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedDepartemen, setSelectedDepartemen] =
    useState<Partial<IDepartemen>>();
  const [selectedCoaKasKecil, setSelectedCoaKasKecil] =
    useState<Partial<ICoa>>();
  const [isLoadingModal, setIsLoadingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const statusOptions = ["Active", "Inactive"];

  const handleEdit = (record: ISettingPettyCashDetail) => {
    setSelectedRecord(record);

    setSelectedDepartemen({
      id: record.departemen_id,
      nama_departemen: record.nama_departemen,
    });

    setSelectedCoaKasKecil({
      id: record.coa_id,
      full_account_name: record.coa_account,
    });

    setSelectedStatus(record.status === "active" ? "Active" : "Inactive");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setSelectedStatus(undefined);
    setSelectedDepartemen(undefined);
    reset();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (data?.saldo_maksimum < 0 || data?.maksimum_transaksi < 0) {
      setIsLoading(false);
      toast.error(
        "Maksimum Saldo atau maksimum transaksi harus lebih besar dari 0!"
      );
      return;
    }

    if (Number(data?.maksimum_transaksi) > Number(data?.saldo_maksimum)) {
      setIsLoading(false);
      toast.error(
        "Maksimum transaksi tidak boleh lebih besar dari maksimum saldo!"
      );
      return;
    }

    if (!selectedRecord) return;

    if (!selectedDepartemen) {
      setIsLoading(false);
      toast.error("Departemen harus diisi!");
      return;
    }

    if (!selectedCoaKasKecil) {
      setIsLoading(false);
      toast.error("COA Kas Kecil harus diisi!");
      return;
    }

    if (!selectedStatus) {
      setSelectedStatus(
        selectedRecord.status === "active" ? "active" : "inactive"
      );
    }

    const payload = {
      ...data,
      id: selectedRecord?.id,
      nama_petty_cash: data?.nama_petty_cash,
      departemen_id: selectedDepartemen!.id!,
      coa_id: selectedCoaKasKecil!.id!,
      saldo_maksimum: data?.saldo_maksimum.replace(/\,/g, ""),
      maksimum_transaksi: data?.maksimum_transaksi.replace(/\,/g, ""),
      status: selectedStatus === "Active" ? "active" : "inactive",
    };

    console.log(payload);

    editSettingPettyCash(payload)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200 || res.status === 201) {
          getSettingPettyCashs();
          setIsLoading(false);
          toast.success(res.data.message);
          handleModalClose();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("err", error);
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

  const getSettingPettyCashById = (id: string): void => {
    setIsLoadingModal(true);
    console.log("id", id);
    const promise = getSettingPettyCashServiceById(id);

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

  useEffect(() => {
    getSettingPettyCashs();
    // getDepartments();
    // getCoa();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <MyBreadcrumb pageName="Setting Petty Cash" />
        {canCreate && (
          <PrimaryButton to="/accounting/petty-cash/setting-petty-cash/add">
            Tambah Data
          </PrimaryButton>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 2xl:grid-cols-3 2xl:gap-7.5">
        {settingPettyCash.map((data) => (
          <div
            key={data.id}
            className="rounded-sm border border-stroke bg-white py-4 px-4 shadow-default"
          >
            <span
              className={`px-2 py-1 rounded-md text-xs ${
                data.status === "active"
                  ? "border border-green-600 text-green-600"
                  : "border border-red-600 text-red-600"
              }`}
            >
              {data.status === "active" ? "Active" : "Inactive"}
            </span>
            <p className="text-title-s text-center font-semibold text-black mb-2 ">
              {data.nama_petty_cash}
            </p>
            <div className="border-b border-stroke my-4" />

            {/* data like kode: data.kode */}
            <ul className="list-none p-0">
              <li className="flex">
                <span className="text-body-s text-gray-500 w-35">
                  Departemen
                </span>
                <span className="text-body-s text-black">
                  : {data.nama_departemen}
                </span>
              </li>
              <li className="flex">
                <span className="text-body-s text-gray-500 w-35">
                  COA Kas Kecil
                </span>
                <span className="text-body-s text-black">
                  : {data.coa_account}
                </span>
              </li>
              <li className="flex">
                <span className="text-body-s text-gray-500 w-35">
                  Saldo Transaksi
                </span>
                <span className="text-body-s text-black">
                  :{" "}
                  {formatCurrency(data.saldo_akhir.toString()) +
                    " / " +
                    formatCurrency(data.saldo_maksimum.toString())}
                </span>
              </li>
              <li className="flex">
                <span className="text-body-s text-gray-500 w-35">
                  Ongoing Kasbon
                </span>
                <span className="text-body-s text-black">
                  : {formatCurrency(data.saldo_ongoing.toString())}
                </span>
              </li>
              <li className="flex">
                <span className="text-body-s text-gray-500 w-35">Limit</span>
                <span className="text-body-s text-black">
                  : {formatCurrency(data.maksimum_transaksi.toString())}
                </span>
              </li>
            </ul>
            <PrimaryButton
              className="w-full mt-4 flex justify-center "
              outlined
              onClick={() => getSettingPettyCashById(data.id.toString())}
            >
              Setting
            </PrimaryButton>
          </div>
        ))}
        <Spin spinning={isLoadingModal} fullscreen />
        {isModalOpen && selectedRecord && (
          <Modal
            key={selectedRecord?.id}
            title={
              <>
                <>Edit Petty Cash</>
                <div className="flex gap-4 justify-end px-5">
                  {canUpdate && (
                    <PrimaryButton
                      onClick={handleSubmit(onSubmit)}
                      isLoading={isLoading}
                    >
                      Simpan
                    </PrimaryButton>
                  )}
                </div>
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
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6  2xl:gap-7.5 p-5">
                <InputField
                  label="Nama"
                  id="nama_petty_cash"
                  type="text"
                  defaultValue={selectedRecord?.nama_petty_cash}
                  register={register}
                  errors={errors}
                  disabled={!canUpdate}
                  validationSchema={{
                    required: "Nama harus diisi!",
                  }}
                />
                <InputField
                  label="Departemen"
                  id="departemen"
                  type="text"
                  defaultValue={selectedRecord?.nama_departemen}
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Nama harus diisi!",
                  }}
                />
                <InputField
                  label="COA Kas Kecil"
                  id="coa"
                  type="text"
                  defaultValue={selectedRecord?.coa_account}
                  disabled
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Nama harus diisi!",
                  }}
                />
                <SelectGroupField
                  label={"Status"}
                  options={statusOptions}
                  value={selectedStatus}
                  disabled={!canUpdate}
                  onChange={(value: string) => {
                    setSelectedStatus(value);
                  }}
                />
                <InputField
                  label="Maksimum Saldo Sekarang"
                  id="maksimum_saldo_sekarang"
                  type="text"
                  disabled
                  defaultValue={`${formatCurrency(
                    selectedRecord.saldo_maksimum.toString()
                  )}`}
                  register={register}
                  errors={errors}
                  style={{ textAlign: "right" }}
                  validationSchema={{
                    required: "Maksimum Saldo Sekarang harus diisi!",
                  }}
                />
                <InputField
                  label="Maksimum Saldo Baru"
                  id="saldo_maksimum"
                  type="text"
                  defaultValue={formatCurrency(
                    selectedRecord.saldo_maksimum.toString()
                  )}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Maksimum Saldo Baru harus diisi!",
                  }}
                  disabled={!canUpdate}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  style={{ textAlign: "right", direction: "ltr" }}
                />
                {/* maksimum transaksi sekarang */}
                <InputField
                  label="Maksimum Transaksi Sekarang"
                  id="maksimum_transaksi_sekarang"
                  type="text"
                  disabled
                  defaultValue={`${formatCurrency(
                    selectedRecord.maksimum_transaksi.toString()
                  )}`}
                  register={register}
                  errors={errors}
                  style={{ textAlign: "right" }}
                  validationSchema={{
                    required: "Maksimum Transaksi Sekarang harus diisi!",
                  }}
                />
                <InputField
                  label="Maksimum Transaksi Baru"
                  id="maksimum_transaksi"
                  type="text"
                  defaultValue={formatCurrency(
                    selectedRecord.maksimum_transaksi.toString()
                  )}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Maksimum Transaksi Baru harus diisi!",
                  }}
                  disabled={!canUpdate}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  style={{ textAlign: "right", direction: "ltr" }}
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
                        .map((audit: any, index: number) => (
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
                                    .replace(/^./, (str: string) =>
                                      str.toUpperCase()
                                    )}
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
                                      let displayValue = (value as string)
                                        .toString()
                                        .toLowerCase()
                                        .replace(/_/g, " ")
                                        .replace(/(^\w|\s\w)/g, (m) =>
                                          m.toUpperCase()
                                        );

                                      let displayKey = key
                                        .replace(/_/g, " ")
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        );
                                      if (key === "is_active") {
                                        displayValue =
                                          value == "1" ? "Active" : "Inactive";
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
            </>
          </Modal>
        )}
      </div>
    </>
  );
};

export default SettingPettyCash;
