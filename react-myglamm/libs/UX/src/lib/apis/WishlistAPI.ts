import MyGlammAPI from "@libAPI/MyGlammAPI";
import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

class WishlistAPI extends MyGlammAPI {
  public getWishlistProductIds = (identifier: string) => this.myGlammV2.get(`search-ms/wishlist/${identifier}/products`);

  public getWishlist = (identifier: string | null, value?: any, skip = 0, limit = 10) => {
    const filter = {
      where: {
        identifier,
        value,
      },
    };
    return this.myGlammV2.get(`/search-ms/wishlist?skip=${skip}&limit=${limit}&filter=${JSON.stringify(filter)}`);
  };

  public addProductToWishlist = (identifier: string | null, productId: string) => {
    const payload = {
      default: true,
      identifier,
      type: "product",
      value: productId,
    };
    let _eventID = "";
    if (typeof window !== "undefined") {
      const fbEventID = sessionStorage.getItem(SESSIONSTORAGE.FB_EVENT_ID);
      if (fbEventID) {
        _eventID = "?eventID=" + fbEventID;
      }
    }
    return this.myGlammV2.put(`wishlist-ms/wishlist${_eventID}`, payload);
  };

  public removeProductFromWishlist = (identifier: string | null, wishlistId: string | null, productId: string) =>
    this.myGlammV2.delete(`wishlist-ms/wishlist/${identifier}/${wishlistId}/${productId}`);

  //Credit Good Points when user add products in Wishlist
  public creditGPWishlist = (identifier: string | null) =>
    this.myGlammV2.post("/share-and-earn-ms/credit/points", {
      identifier,
      module: "products",
      platform: "wishlist",
      type: "glammPoints",
    });
}

export default WishlistAPI;
