import { getCurrency } from "../Accounting/services/currencyService";
import type { ICurrency } from "../Accounting/types/currency.interface";
import { getMasterItem } from "../Master/services/itemService";
import { getMasterPaymentMethod } from "../Master/services/paymentMethodService";
import { getMasterPaymentSources } from "../Master/services/paymentSourcesService";
import { getMasterSatuan } from "../Master/services/satuanService";
import {
  getMasterSupplier,
  getMasterSupplierById,
} from "../Master/services/supplierService";
import type { IPaymentMethod } from "../Master/types/paymentMethod.interface";
import type { IPaymentSources } from "../Master/types/paymentSources.interface";
import type {
  ISupplier,
  ISupplierDetail,
} from "../Master/types/supplier.interface";

export const getDataSuppliers = ({
  setData,
  setLoading,
  activeOptions = true,
}: {
  setData: React.Dispatch<React.SetStateAction<ISupplier[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeOptions?: boolean;
}): void => {
  setLoading(true);
  const promise = getMasterSupplier(
    activeOptions === true ? { is_active: "1" } : {}
  );

  promise
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        setData(res.data.data);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("err", err);
    });
};

export const getDataSupplierById = ({
  setData,
  setLoading,
  id,
}: {
  setData: React.Dispatch<React.SetStateAction<ISupplierDetail | undefined>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}): void => {
  setLoading(true);
  const promise = getMasterSupplierById(id);

  promise
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        setData(res.data.data);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("err", err);
    });
};

export const getDataCurrencys = ({
  setData,
  setLoading,
  activeOptions = true,
}: {
  setData: React.Dispatch<React.SetStateAction<ICurrency[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeOptions?: boolean;
}): void => {
  setLoading(true);
  const promise = getCurrency(
    activeOptions === true ? { is_active: "1" } : null
  );

  promise
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        const data = res.data.data.filter((item: any) => item.is_active == "1");
        setData(activeOptions ? data : res.data.data);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("err", err);
    });
};

export const getDataPaymentMethods = ({
  setData,
  setLoading,
  activeOptions = true,
}: {
  setData: React.Dispatch<React.SetStateAction<IPaymentMethod[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeOptions?: boolean;
}): void => {
  setLoading(true);
  const promise = getMasterPaymentMethod();

  promise
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        const data = res.data.data.filter(
          (item: any) => item.status === "active"
        );
        setData(activeOptions ? data : res.data.data);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("err", err);
    });
};

export const getDataPaymentSource = ({
  setData,
  setLoading,
  activeOptions = true,
  params,
}: {
  setData: React.Dispatch<React.SetStateAction<IPaymentSources[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeOptions?: boolean;
  params?: any;
}): void => {
  setLoading(true);

  const promise = getMasterPaymentSources(
    activeOptions === true ? { ...params, status: "active" } : { ...params }
  );

  promise
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        const data = res.data.data.filter(
          (item: any) => item.status === "active"
        );
        setData(activeOptions ? data : res.data.data);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("err", err);
    });
};

// get items
export const getDataItems = ({
  setData,
  setLoading,
  activeOptions = true,
  params,
}: {
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeOptions?: boolean;
  params?: any;
}): void => {
  setLoading(true);
  const promise = getMasterItem(
    activeOptions === true ? { ...params, is_active: "1" } : {}
  );

  promise
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        setData(res.data.data);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("err", err);
    });
};

//get satuans
export const getDataSatuan = ({
  setData,
  setLoading,
  activeOptions = true,
}: {
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeOptions?: boolean;
}): void => {
  setLoading(true);
  const promise = getMasterSatuan(
    activeOptions === true ? { is_active: "1" } : {}
  );

  promise
    .then((res) => {
      if (res.status === 200 || res.status === 201) {
        setLoading(false);
        setData(res.data.data);
      }
    })
    .catch((err) => {
      setLoading(false);
      console.log("err", err);
    });
};
