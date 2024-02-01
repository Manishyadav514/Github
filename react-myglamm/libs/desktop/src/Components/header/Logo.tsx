import React from "react";
import Link from "next/link";
import { SHOP } from "@libConstants/SHOP.constant";

const Logo = ({ themed }: { themed?: boolean }) => (
  <div className={`logo ${themed ? "w-1/3" : "w-1/6"} flex items-center justify-center`}>
    <Link href="/" className="flex items-center justify-between">
      <img alt="logo" className="m-auto object-contain h-14" src={SHOP.LOGO} />
    </Link>
  </div>
);

export default Logo;
