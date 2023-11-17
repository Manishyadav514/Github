import { API_CONFIG, API_ENDPOINT } from "@constants/api.constant";
import NucleusAPI from "./nucleusAPI";
import { LOCALSTORAGE } from "@/constants/Storage.constant";
import { getLocalStorageValue } from "@/utils/localStorage";

class OrderAPI extends NucleusAPI {
  public fetchOrderCount(
    page: number = 1,
    limit: number = API_CONFIG.pageSize,
    order: string = "orderPlaced DESC",
    orderStatusQuery?: number[],
    search?: string,
    where?: object
  ) {
    const skip = (page - 1) * limit;
    let statusId = orderStatusQuery && { inq: orderStatusQuery };
    const vendorCode = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
    const country = getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME);
    const filter = {
      limit,
      skip,
      order,
      where: { ...where, vendorCode, country, statusId, search }
    };
    const params = new URLSearchParams({ filter: JSON.stringify(filter) });
    return this.NucleusAPI.get<any[]>(API_ENDPOINT.order.count, { params });
  }

  public fetchAllOrder(
    page: number = 1,
    limit: number = API_CONFIG.pageSize,
    order: string = "orderPlaced DESC",
    orderStatusQuery?: number[],
    search?: string,
    where?: object
  ) {
    const skip = (page - 1) * limit;

    let statusId = orderStatusQuery && { inq: orderStatusQuery };
    const filter = {
      limit,
      skip,
      order,
      where: { ...where, vendorCode: "mgp", country: "IND", statusId, search }
    };
    const params = new URLSearchParams({ filter: JSON.stringify(filter) });
    return this.NucleusAPI.get<any[]>(API_ENDPOINT.order.fetchAll, { params });
  }

  public fetchOrderInvoice = (orderID: string) => {
    return this.NucleusAPI.get(`order-ms/getOrderInvoice/${orderID}`);
  };

  public fetchOrderDetails = (orderID: string) => {
    return this.NucleusAPI.get(`order-ms/order/${orderID}`);
  };

  public fetchOrderSKU = (orderNumber: string) => {
    return this.NucleusAPI.get(`wms-ms/orderSkuStock?orderNumber=${orderNumber}`);
  };
}

export default OrderAPI;
