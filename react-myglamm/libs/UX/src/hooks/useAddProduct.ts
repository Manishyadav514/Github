import { useState } from "react";
import { useRouter } from "next/router";

import CartAPI from "@libAPI/apis/CartAPI";

import { addToBag } from "@libStore/actions/cartActions";

import { getCartIdentifier, checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

function useAddProduct() {
  const router = useRouter();

  const [isProductAdded, setIsProductAdded] = useState<any>(null);

  /**
   * @description - Add to cart api call and navigation to destination
   * @param productId - productId e.g -> '5e54e97f98da6edd07b879b7'
   * @param destination - destination
   */
  const addProduct = (productsIdArray: any, destination?: any) => {
    const payload = {
      products: productsIdArray,
      identifier: getCartIdentifier(),
      isGuest: !checkUserLoginStatus(),
    };

    const cartApi = new CartAPI();

    cartApi
      .addToBag(payload)
      .then(async result => {
        addToBag(result.data);
        setIsProductAdded({
          status: true,
          message: "Product Added to cart",
        });
        if (destination) {
          localStorage.setItem("cartId", result.data?.data?.cart?.identifier);
          router.push(destination);
        }
      })
      .catch((error: any) => {
        // eslint-disable-next-line no-console
        console.log(error);
        setIsProductAdded({
          status: false,
          message: error.response?.data?.message,
        });
        if (destination) {
          router.push("/");
        }
      });
  };
  return {
    addProduct,
    isProductAdded,
    setIsProductAdded,
  };
}
export default useAddProduct;
