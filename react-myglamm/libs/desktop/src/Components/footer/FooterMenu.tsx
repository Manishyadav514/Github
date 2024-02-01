import React from "react";
import Link from "next/link";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

const FooterMenu = () => {
  const { footer } = useSelector((store: ValtioStore) => store.navReducer);

  if (footer?.length > 0) {
    return (
      <div className="flex max-w-screen-xl mx-auto justify-center list-none pt-5">
        {footer.map((item: any) => (
          <ul key={item.label} className="grow max-w-xs pr-4 last:pr-0">
            <li className="text-sm font-light mb-1.5">
              <Link href={item.url} className="relative text-black">
                <h6 className="my-2.5 text-sm font-semibold text-stone-400 opacity-75 uppercase">{item.label}</h6>
              </Link>
            </li>

            {item.child?.length > 1 &&
              item.child.map((childItems: any) => (
                <li key={childItems.label} className="text-sm font-light mb-1.5">
                  <Link href={childItems.url} className="hover:text-color1">
                    {childItems.label}
                  </Link>
                </li>
              ))}
          </ul>
        ))}
      </div>
    );
  }

  return null;
};

export default FooterMenu;
