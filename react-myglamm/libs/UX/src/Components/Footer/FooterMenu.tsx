import { ValtioStore } from "@typesLib/ValtioStore";
import Link from "next/link";
import React, { Fragment } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
interface FooterMenuProps {
  textStyle?: string;
}
const FooterMenu = ({ textStyle }: FooterMenuProps) => {
  const footerMenus = useSelector((store: ValtioStore) => store.navReducer.footer);

  if (!footerMenus?.length) return null;

  return (
    <>
      <div className="mx-4 pt-4">
        {footerMenus?.map((menu: any, index: number) => (
          <div key={`${menu.label}_${index}`}>
            <Link
              href={menu.url.includes("javascript") ? "#" : menu.url}
              prefetch={false}
              className={`text-lg font-extrabold tracking-widest max-w-xs ${textStyle || "text-white"}`}
              role="button"
              aria-label={menu.label}
            >
              {menu.label}
            </Link>
            <div className="flex flex-wrap mb-6" role="list">
              {menu?.child.map((childItem: any, childIndex: number) =>
                childItem?.child?.length >= 1 ? (
                  <Fragment key={`${childItem.label}_${childIndex}`}>
                    <div className={`flex py-1 ${textStyle || "text-white"}`} role="listitem">
                      <Link
                        href={childItem.url.includes("javascript") ? "#" : childItem.url}
                        prefetch={false}
                        aria-label={childItem.label}
                      >
                        <p className="text-xs font-bold">{childItem.label}</p>
                      </Link>
                      {childIndex !== menu?.child?.length && <p className="text-xs mx-1">/</p>}
                    </div>
                    {childItem?.child?.map((subChild: any, subIndex: number) => (
                      <div
                        key={`${subChild.label}_${subIndex}`}
                        className={`flex py-1 ${textStyle || "text-white"}`}
                        role="listitem"
                      >
                        <Link
                          href={subChild.url.includes("javascript") ? "#" : subChild.url}
                          prefetch={false}
                          aria-label={subChild.label}
                        >
                          <p className="text-xs">{subChild.label}</p>
                        </Link>
                        {subIndex !== childItem?.child?.length && <p className="text-xs mx-1">/</p>}
                      </div>
                    ))}
                  </Fragment>
                ) : (
                  <div
                    key={`${childItem.label}_${childIndex}`}
                    className={`flex py-1 ${textStyle || "text-white"}`}
                    role="listitem"
                  >
                    <Link
                      href={childItem.url.includes("javascript") ? "#" : childItem.url}
                      prefetch={false}
                      aria-label={childItem.label}
                    >
                      <p className="text-xs">{childItem.label}</p>
                    </Link>
                    {childIndex + 1 !== menu?.child?.length && <p className="text-xs mx-1">/</p>}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FooterMenu;
