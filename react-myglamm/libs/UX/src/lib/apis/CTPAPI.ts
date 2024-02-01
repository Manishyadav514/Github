import MyGlammAPI from "@libAPI/MyGlammAPI";

class CTPAPI extends MyGlammAPI {
  public getDataBySKUs(sku: string, identifier?: string, limit = 10) {
    return this.myGlammV2.get(
      `/cut-the-price-ms/cutThePrice/ctpProducts?sku=${sku}&identifier=${identifier}&limit=${limit}&skip=0`
    );
  }

  public userLogs(sku: string, identifier?: string, limit = 10) {
    return this.myGlammV2.get(`/cut-the-price-ms/cutThePrice/skuLog?sku=${sku}&identifier=${identifier}&limit=${limit}&skip=0`);
  }

  public initiateCTP(input: any) {
    return this.myGlammV2.post(`/cut-the-price-ms/cutThePrice/ctp`, input);
  }
}

export default CTPAPI;
