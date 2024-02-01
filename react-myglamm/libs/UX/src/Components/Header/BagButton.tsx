import React, { ReactElement, useEffect } from "react";
import Link from "next/link";

import Ripples from "@libUtils/Ripples";
import { useSelector } from "@libHooks/useValtioSelector";

import { updateProductCount } from "@libStore/actions/cartActions";

import CartAPI from "@libAPI/apis/CartAPI";

import { ValtioStore } from "@typesLib/ValtioStore";

import { getCartIdentifier } from "@checkoutLib/Storage/HelperFunc";

import BagIcon from "../../../public/svg/carticon.svg";

const BagButton = ({ children, conatinerClass }: { children?: any; conatinerClass?: string }) => {
  const productCount = useSelector((store: ValtioStore) => store.cartReducer.cart.productCount);

  /* Get Cart Products Count on Mount */
  useEffect(() => {
    if (getCartIdentifier()) {
      const cartApi = new CartAPI();
      cartApi
        .getCount()
        .then(({ data: res }) => updateProductCount(res.data?.data?.productCount || res.data?.productCount || 0));
    }
  }, []);

  return (
    <Ripples>
      <Link
        prefetch={false}
        href="/shopping-bag"
        aria-label="Shopping Cart Page"
        className={
          conatinerClass || "p-2 flex-end text-gray-700 text-2xl text-center focus-visible:outline outline-offset-[-2px] "
        }
      >
        {children ? (
          children
        ) : (
          <React.Fragment>
            <BagIcon role="img" aria-labelledby="cart" title="cart" />
            {productCount > 0 && (
              <div className="absolute w-5 h-5 text-xs font-bold flex justify-center items-center rounded-full text-white bg-color1 top-0 right-1">
                {productCount}
              </div>
            )}
          </React.Fragment>
        )}
      </Link>
    </Ripples>
  );
};

export default BagButton;
