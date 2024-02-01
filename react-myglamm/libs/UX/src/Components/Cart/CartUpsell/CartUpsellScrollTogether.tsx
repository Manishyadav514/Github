import CartUpsellProduct from "./CartUpsellProduct";

import { getCustomDataToDisplayUpsellProduct } from "@checkoutLib/Cart/HelperFunc";

import { WidgetProduct } from "@typesLib/Cart";

interface ICartUpsellProducts {
  upsellData: any;
  loader?: string;
  withCustomData?: boolean;
  handleAddToBag: (product: WidgetProduct) => void;
  openMiniPdpModal: (product: WidgetProduct) => void;
  variants?: {
    giftCardUpsellVariant: string;
    glammClubUpsell: string;
    scrollUpsellRowsTogether: string;
  };
}

const CartUpsellScrollTogether = ({
  upsellData,
  loader,
  withCustomData,
  handleAddToBag,
  openMiniPdpModal,
  variants,
}: ICartUpsellProducts) => {
  const { firstHalfProducts, secondHalfProducts } = upsellData;
  if (!firstHalfProducts?.length && !secondHalfProducts?.length) {
    return null;
  }
  const mergedUpsellJSX: Array<JSX.Element> = [];

  for (let i = 0; i < firstHalfProducts?.length; i++) {
    const key = `${firstHalfProducts?.[i]?.productId || firstHalfProducts?.[i]?.id}-${
      secondHalfProducts?.[i]?.productId || secondHalfProducts?.[i]?.id
    }`;
    mergedUpsellJSX.push(
      <div className="w-1/3 flex-sliderChild m-1" key={key}>
        <CartUpsellProduct
          product={withCustomData ? getCustomDataToDisplayUpsellProduct(firstHalfProducts[i]) : firstHalfProducts[i]}
          loader={loader}
          handleAddToBag={handleAddToBag}
          openMiniPdpModal={openMiniPdpModal}
          variants={variants}
          isScrollTogether
        />
        {secondHalfProducts?.[i] && (
          <CartUpsellProduct
            product={withCustomData ? getCustomDataToDisplayUpsellProduct(secondHalfProducts[i]) : secondHalfProducts[i]}
            loader={loader}
            handleAddToBag={handleAddToBag}
            openMiniPdpModal={openMiniPdpModal}
            variants={variants}
            isScrollTogether
          />
        )}
      </div>
    );
  }

  return <>{mergedUpsellJSX}</>;
};

export default CartUpsellScrollTogether;
