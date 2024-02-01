import { Fragment, ReactElement, useEffect } from "react";
import { useRouter } from "next/router";

import useAddProduct from "@libHooks/useAddProduct";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { getClientQueryParam } from "@libUtils/_apputils";

function LbMiddleWare() {
  const router = useRouter();

  const { addProduct } = useAddProduct();

  useEffect(() => {
    /**
     * get query param from url
     */
    const getQueryparams = () => {
      if (window.location.search) {
        getDestination();
      }
    };
    getQueryparams();
  }, []);

  const getDestination = () => {
    // this.paramsRoute = this.route.snapshot.params;
    /* As per the requirement, we are saving
    coupon code in localStorage for every linkbuilder url with couponCode */
    const code = getClientQueryParam("code");
    const discountCode = getClientQueryParam("discountCode");
    const destination = getClientQueryParam("destination");
    const id = getClientQueryParam("id");
    const slug = getClientQueryParam("slug");
    if (code || discountCode) {
      localStorage.setItem("coupon", code || discountCode || "");
    }
    let routeParams: any = "/";
    // eslint-disable-next-line no-restricted-globals
    const hashFragment = location.hash;
    let queryParams = "";
    if (location.search.startsWith("?")) {
      queryParams = location.search
        .toLowerCase()
        .split("?")[1]
        .split("&")
        .filter(i => i.startsWith("utm_"))
        .join("&");
    }
    switch (destination) {
      case "shopping-bag":
        routeParams = "/shopping-bag";
        break;
      case "glamm-studio":
        routeParams = slug;
        break;
      case "glamm-studio-category":
        routeParams = "/glammstudio";
        break;
      case "blog":
        routeParams = slug;
        break;
      case "order-detail":
        if (id) {
          routeParams = `/order-details/${id}`;
        }
        break;
      case "product-detail":
        routeParams = slug;
        break;
      case "product-category":
        routeParams = slug;
        break;
      case "party":
        // (routeParams = "party"), params.slug;
        break;
      case "refer-friend":
        routeParams = "/refer";
        break;
      case "lookbook-category":
        routeParams = slug;
        break;
      case "lookbook-detail":
        routeParams = slug;
        break;
      case "checkout":
        routeParams = "/payment";
        break;
      case "profile":
        routeParams = "/my-profile";
        break;
      case "collection":
        routeParams = slug;
        break;
      case "dashboard":
        routeParams = "/dashboard";
        break;
      case "manish-malhotra":
        routeParams = "/manishmalhotra";
        break;
      case "lit":
        routeParams = "/lit";
        break;
      case "scratchCardListing":
        routeParams = "/scratch-and-win";
        break;
      case "add-products":
        break;
      case "add-products-coupon":
        break;
      case "referral-dashboard":
        routeParams = "/dashboard";
        break;

      default:
        routeParams = "/";
        break;
    }
    if (queryParams) {
      routeParams += "?" + queryParams;
    }
    if (hashFragment) {
      routeParams += hashFragment;
    }
    getAction(routeParams);
  };

  const getAction = (routeParams: any) => {
    const ids = getClientQueryParam("ids");
    const slug = getClientQueryParam("slug");
    const code = getClientQueryParam("code");
    const discountCode = getClientQueryParam("discountCode");
    const decoyPriceId = getClientQueryParam("decoyPriceId");
    const subscriptionId = getClientQueryParam("subscriptionId");
    const quantity = getClientQueryParam("quantity");

    switch (getClientQueryParam("action")) {
      case "show":
        router.push(routeParams);
        break;
      case "add":
        if (ids) {
          handleProductIds(ids, routeParams || "/shopping-bag", 1, decoyPriceId, subscriptionId, quantity);
        }
        break;
      case "share":
        if (slug) {
          router.push({
            pathname: routeParams,
            query: { action: "share" },
          });
        }
        break;
      case "apply":
        if (ids) {
          handleProductIds(ids, routeParams || "/shopping-bag");
        }
        if (code || discountCode) {
          localStorage.setItem("coupon", code || discountCode || "");
        }
        break;
      case "discount":
        if (code || discountCode) {
          localStorage.setItem("coupon", code || discountCode || "");
        }
        // router.push({pathname:"/" + params,query: { linkbuilder: true }});
        router.push(routeParams);
        break;
      default:
        router.push(routeParams);
        break;
    }
  };

  /**
   * @description - Add to cart api call and navigation to destination
   * @param productId - productId e.g -> '5e54e97f98da6edd07b879b7'
   * @param destination - destination
   */
  const handleProductIds = async (
    productId: any,
    destination?: any,
    productType?: any,
    decoyPriceId?: any,
    subscriptionId?: any,
    quantity?: any
  ) => {
    const productIds = productId.split(",");
    const productsIdArray: any = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < productIds.length; i++) {
      const productObject = {
        productId: productIds[i],
        quantity: parseInt(quantity) || 1,
        type: productType || 1,
        subProductType: 1,
        ...(decoyPriceId && { decoyPriceId: decoyPriceId }),
        ...(subscriptionId && { subscriptionId: subscriptionId }),
      };
      productsIdArray.push(productObject);
    }
    /**
     * @description it is hook which used add product in cart
     */
    addProduct(productsIdArray, destination);
  };
  return null;
}

LbMiddleWare.getLayout = (page: ReactElement) => (
  <div className="fixed inset-0 h-screen">
    {page}
    <LoadSpinner className="absolute inset-0 h-screen w-16 m-auto" />{" "}
  </div>
);

export default LbMiddleWare;
