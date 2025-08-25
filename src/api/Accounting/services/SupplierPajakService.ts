import axiosInstance from "../../config";


const basePath = "/purchasing/purchase_order/get_pajak";

export const getSupplierPajakById = async (supplier_id:number) =>{
    const result = await axiosInstance.get(`${basePath}/${supplier_id}`);

    return result;
}