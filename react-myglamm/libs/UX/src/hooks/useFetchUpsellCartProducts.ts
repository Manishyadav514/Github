import { useEffect, useState } from "react";

import { useSelector } from "./useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";
import { cartProduct } from "@typesLib/Cart";

import CartAPI from "@libAPI/apis/CartAPI";

import { createDSUpsellPayload } from "@checkoutLib/Cart/HelperFunc";
import { upsellTagClickEvent } from "@checkoutLib/Cart/Analytics";

export const useFetchUpsellCartProduct = ({
  upsellType,
  couponFreeProductData,
  variant,
  progressbarNextMilestone,
  progressbarMilestoneUpsellLabel,
  giftCardUpsellVariant,
  warehouseVariant,
  upsellComboVariant,
}: {
  upsellType: "upsell" | "personalizedUpsell" | "progressBarUpsell";
  couponFreeProductData?: any;
  variant?: string;
  progressbarNextMilestone?: any;
  progressbarMilestoneUpsellLabel?: any;
  giftCardUpsellVariant?: string;
  warehouseVariant?: string;
  upsellComboVariant?: string;
}) => {
  const [upsellProducts, setUpsellProducts] = useState<any>([]);
  const [upsellData, setUpsellData] = useState<any>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [globalDsTags, setGlobalDsTags] = useState<string[]>([]);
  const [showPersonalizedDsTags, setShowPersonalizedDsTags] = useState<boolean>(false);
  const [categories, setCategories] = useState<any>([]);
  const [showNucleusUpsellProducts, setShowNucleusUpsellProducts] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { cart, userProfile } = useSelector((store: ValtioStore) => ({
    cart: store.cartReducer.cart,
    userProfile: store.userReducer.userProfile,
  }));

  const getCartUpsellEndpoint = () => {
    const cartApi = new CartAPI();

    switch (upsellType) {
      case "upsell":
        return cartApi.getUpsellData({
          payload: createDSUpsellPayload({ cart, couponFreeProductData, progressbarMilestoneUpsellLabel }),
          lowerCogsVariant: variant,
          giftCardUpsellVariant: giftCardUpsellVariant,
          warehouseVariant,
          upsellComboVariant,
        });

      case "personalizedUpsell":
        return cartApi.getPersonalizedUpsellData(createDSUpsellPayload({ cart, couponFreeProductData }));

      case "progressBarUpsell":
        return cartApi.getUpsellOnProgressBar(createDSUpsellPayload({ cart, couponFreeProductData, progressbarNextMilestone }));

      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchUpsell = async () => {
      try {
        const response = await getCartUpsellEndpoint();

        if (response?.data.data) {
          const result = response.data.data;

          /* Check if category tags need to be shown */
          if (result?.showTags) {
            setTabIndex(0);
            const isDsTagsPresent = result.products?.every(
              (product: cartProduct) => product.dsProductTags && product.dsProductTags.length > 0
            );
            // experiment for personalized tags vs normal tags
            if (result.globalTags?.length > 2 && isDsTagsPresent) {
              setShowPersonalizedDsTags(true);
              setGlobalDsTags(result.globalTags);
            } else {
              /* get all parent category array of objects from the cart upsell */
              const categories = result.products?.reduce((accum: any, product: any) => {
                product.productCategory.forEach((category: any) => {
                  if (category.type === "parent" && !accum?.some((accumElement: any) => accumElement.id === category.id)) {
                    accum.push(category);
                  }
                });
                return accum;
              }, []);

              if (categories.length > 0) {
                const categoryArr = [...categories];
                categoryArr.unshift({ name: "ALL" });
                setCategories(categoryArr);
              }
            }
          }

          setUpsellData(result);

          if (result.products?.length) {
            setUpsellProducts(result.products.map((prod: any) => ({ ...prod, widgetName: "upsell" })));
          } else {
            // fallback incase no products present
            setShowNucleusUpsellProducts(true);
          }
          setShowSkeleton(false);
        }
      } catch (err) {
        setShowNucleusUpsellProducts(true);
        setShowSkeleton(false);
        setUpsellData([]);
        setUpsellProducts([]);
        console.error(err);
      }
    };

    if (
      cart.netAmount &&
      ((userProfile?.id && userProfile.id === cart.identifier) || !userProfile?.id) && // waiting for loggedin user data getting populated properly in cart also
      (variant || giftCardUpsellVariant || upsellType !== "upsell")
    ) {
      fetchUpsell();
    }
  }, [cart.netAmount, variant, giftCardUpsellVariant, userProfile]);

  const getCategoryProducts = (category: any, index: any) => {
    upsellTagClickEvent(userProfile, category.name || category);
    setTabIndex(index);

    /* Show the products based on the tags  selected */
    if (showPersonalizedDsTags) {
      const updatedProducts = upsellData.products.filter((product: cartProduct) => product.dsProductTags?.includes(category));
      setUpsellProducts(updatedProducts);
    } else if (category?.id) {
      const updatedProducts = upsellData.products?.filter((product: any) =>
        product.productCategory?.some((c: any) => c.id === category.id)
      );
      setUpsellProducts(updatedProducts);
    } else {
      setUpsellProducts(upsellData.products);
    }
  };

  return {
    upsellData,
    upsellProducts,
    tabIndex,
    categories,
    showNucleusUpsellProducts,
    showSkeleton,
    showPersonalizedDsTags,
    getCategoryProducts,
    globalDsTags,
  };
};
