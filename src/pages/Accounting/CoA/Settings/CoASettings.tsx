import { Spin } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllCoaSetting,
  getCoaTransaction,
  saveCoaSetting,
} from "../../../../api/Accounting/services/coaSevice";
import type {
  ICoa,
  ICoaAudit,
  ICoaSetting,
} from "../../../../api/Accounting/types/coa.interface";
import AuditTrail from "../../../../components/AuditTrail";
import MyBreadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import PrimaryButton from "../../../../components/Button/PrimaryButton";
import SelectCoa from "../../../../components/SelectCoa";
import { usePermission } from "../../../../hooks/usePermission";

interface SettingResponses {
  coa_sttings: Record<string, ICoaSetting[]>;
  audit_trail: ICoaAudit[];
}

interface ISaveSettings {
  departemen: string;
  setting_name: string;
  coa_id: number;
  coa_account: string;
}

const CoASettings = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoadingModal, setIseLoadingModal] = useState<boolean>(false);
  const [coaSettigns, setCoaSettings] = useState<SettingResponses>();
  const [coa, setCoa] = useState<ICoa[]>([]);
  const [changedSetting, setChangedSetting] = useState<
    Record<string, ISaveSettings>
  >({});
  const [count, setCount] = useState<number>(0);

  const { hasPermission } = usePermission();

  const canUpdate = hasPermission("default-account-update");

  const handleChangeSetting = () => {
    setIsEditing(true);
  };

  const handleAbort = () => {
    setIsEditing(false);
    setCount(count + 1);
  };

  const handleSave = async () => {
    try {
      setIseLoadingModal(true);

      const newSetting = Object.values(changedSetting);
      if (newSetting.length > 0) {
        const response = await saveCoaSetting({
          settings: newSetting,
        });
        toast.success(response.data.message);
        setChangedSetting({});
        await loadSettings();
      }
      setIsEditing(false);

      setIseLoadingModal(false);
    } catch (err: any) {
      setIseLoadingModal(false);
      console.log("err", err);
    }
  };

  const loadSettings = async () => {
    try {
      setIseLoadingModal(true);

      const response = await getAllCoaSetting();
      setCoaSettings(response.data.data);

      setIseLoadingModal(false);
    } catch (err) {
      setIseLoadingModal(false);
    }
  };

  const getCoaTrans = async () => {
    try {
      setIseLoadingModal(true);
      const response = await getCoaTransaction();
      if (response.status === 200 || response.status === 201) {
        let data = response.data.data as ICoa[];
        data = [
          ...data.filter((item) => item.level != "1" && item.level != "2"),
        ];
        setCoa(data);
      }
      setIseLoadingModal(false);
    } catch (err) {
      setIseLoadingModal(false);
    }
  };

  const hanldeInputSettingOnChange = (
    value: ICoa,
    departemen: string,
    account: string
  ) => {
    const input: ISaveSettings = {
      departemen: departemen,
      coa_account: account,
      coa_id: value.id,
      setting_name: value.full_account_name,
    };

    setChangedSetting((prev) => ({
      ...prev,
      [account]: input,
    }));
  };

  const inputCoaSetting = (data: ICoaSetting, departemen: string) => {
    if (coa.length > 0) {
      return (
        <div className="flex flex-row mb-3">
          <label className="w-1/6 ml-9 mt-auto mb-auto">
            {data.coa_account}
          </label>
          <span className="mr-9 ml-9 mt-auto mb-auto">:</span>
          <SelectCoa
            className="w-1/3"
            disabled={!isEditing}
            options={coa}
            value={data.coa_setting_name}
            onChange={(value) => {
              hanldeInputSettingOnChange(value, departemen, data.coa_account);
            }}
            coaDepartemen={data.coa_departemen}
            coaAccount={data.coa_account}
          />
        </div>
      );
    } else {
      return;
    }
  };

  useEffect(() => {
    loadSettings();
    getCoaTrans();
  }, []);

  useEffect(() => {}, [coa]);

  return (
    <div key={"content-settings-coa"}>
      <div className="flex flex-flow justify-between">
        <MyBreadcrumb pageName="Default Account"></MyBreadcrumb>
        <Spin spinning={isLoadingModal} fullscreen />

        {canUpdate &&
          (!isEditing ? (
            <div>
              <PrimaryButton onClick={handleChangeSetting}>
                Change Setting
              </PrimaryButton>
            </div>
          ) : (
            <div>
              <PrimaryButton className="bg-red-600 ml-3" onClick={handleAbort}>
                Abort
              </PrimaryButton>

              <PrimaryButton className="ml-3" onClick={handleSave}>
                Save
              </PrimaryButton>
            </div>
          ))}
      </div>

      {coaSettigns &&
        Object.entries(coaSettigns.coa_sttings).map(([departemen, list]) => (
          <div key={`${departemen}-${count}`}>
            <h3 className="font-semibold text-title-xsm m-6">{departemen}</h3>
            {list.map((item: ICoaSetting) => (
              <div key={item.id}>{inputCoaSetting(item, departemen)}</div>
            ))}
            <hr />
          </div>
        ))}

      {coaSettigns && (
        <div className="ml-2 p-5 mt-9 rounded-sm border border-stroke bg-white shadow-default pb-6">
          <div className="h-75 overflow-auto">
            <AuditTrail AuditTrailData={coaSettigns?.audit_trail ?? []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoASettings;
