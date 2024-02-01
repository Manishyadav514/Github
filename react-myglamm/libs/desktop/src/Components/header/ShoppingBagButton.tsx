import React from "react";

import BagButton from "@libComponents/Header/BagButton";

import { useSelector } from "@libHooks/useValtioSelector";

import { ValtioStore } from "@typesLib/ValtioStore";

import BagIcon from "../../../../UX/public/svg/carticon.svg";
import BagIcontTheme from "../../../../UX/public/svg/carticontheme.svg";

const ShoppingBagButton = ({ themed }: { themed?: boolean }) => {
  const { productCount } = useSelector((store: ValtioStore) => store.cartReducer.cart);

  return (
    <BagButton conatinerClass="flex justify-between items-center text-2xl relative">
      {productCount > 0 && (
        <div
          className={`h-5 w-5 ${
            themed ? "bg-color2 text-color1" : "bg-ctaImg text-white"
          } flex text-sm items-center justify-center font-bold absolute rounded-full -top-2 -right-1`}
        >
          {productCount}
        </div>
      )}

      {themed ? (
        <BagIcontTheme role="img" aria-labelledby="cart" className="w-8 h-8" />
      ) : (
        <BagIcon role="img" aria-labelledby="cart" className="w-8 h-8" />
      )}
    </BagButton>
  );
};

export default ShoppingBagButton;
