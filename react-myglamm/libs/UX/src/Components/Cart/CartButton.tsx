import * as React from "react";
import Link from "next/link";
import { GiNextIco } from "@libComponents/GlammIcons";
import { formatPrice } from "@libUtils/format/formatPrice";

const CartButton = ({ btnText, amount, content, reverseText }: any) => (
  <div className="fixed bottom-0 w-full" style={{ zIndex: 1, boxShadow: "rgba(0, 0, 0, 0.2) 0px -4px 4px 0px" }}>
    <div
      className="flex justify-between bg-white"
      style={{
        padding: "10px 10px 10px 16px",
        boxShadow: "0 0 3px 0 rgba(0,0,0,.19)",
      }}
    >
      <div className={`flex ${reverseText ? "flex-col-reverse" : "flex-col"} `}>
        <p className="font-semibold text-xl">{formatPrice(amount, true, false)}</p>
        <p className="text-xs">{content}</p>
      </div>
      <Link
        href="/payment"
        className="text-sm flex items-center text-white font-semibold"
        type="button"
        style={{
          padding: "12px 15px",
          width: "170px",
          height: "49px",
          background: "linear-gradient(to left,#000,#454545)",
          justifyContent: "space-evenly",
        }}
        aria-label={btnText}
      >
        {btnText}
        <GiNextIco width="14" height="21" viewBox="10 400 500 50" fill="#ffffff" />
      </Link>
    </div>
  </div>
);

export default CartButton;
