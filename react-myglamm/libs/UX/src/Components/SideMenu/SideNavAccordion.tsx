import React, { memo, useState } from "react";
import Link from "next/link";

import Ripples from "@libUtils/Ripples";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

// @ts-ignore
import styles from "@libStyles/css/sideNav.module.css";

const AccordianPanel = ({ header, subitem, adobeClick, profile }: any) => {
  const [category, setCategory] = useState<Array<string>>([]);

  /* insert category name into an array on click, if category name exist in array then set empty array */
  const toggleLevelOneDetails = (e: any) => {
    e.preventDefault();

    if (category[0] === header) {
      setCategory([]);
    } else {
      setCategory([header]);
    }
  };

  /* insert sub category name into an array on click, if sub category name exist in array then set empty array */
  const toggleLevelTwoDetails = (e: any, label: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (category[1]) {
      setCategory([header]);
    } else {
      setCategory([header, label]);
    }
  };

  const toggleLevelThreeDetails = (e: any, level2: any, label: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (category[2]) {
      setCategory([header, level2]);
    } else {
      setCategory([header, level2, label]);
    }
  };

  const FILTER_MENU = (menuItems: any) =>
    menuItems.filter((x: any) => (x.visibility === "loggedIn" && checkUserLoginStatus()) || x.visibility === "both");

  return (
    <details
      className={`${styles["level-1-details"]} ${styles.levels}
       ${category[0] === header && !category[1] ? "bg-color2 border-l-3 border-color1" : ""}
      
      `}
      onClick={e => {
        toggleLevelOneDetails(e);
      }}
      open={category[0] === header}
      role="menu"
      aria-labelledby="menubutton"
      aria-busy="true"
    >
      <summary
        className="text-sm flex items-center py-3 px-4 leading-relaxed relative focus-visible:outline outline-offset-[-1px] "
        onClick={() => adobeClick(header)}
      >
        <span className={`w-4/5 ${category[0] === header && !category[1] ? "font-bold" : ""} `}>{header}</span>
      </summary>
      <div role="presentation">
        {FILTER_MENU(subitem).map((item: any) => {
          const label = item.label.trim();

          return (
            <div className="outline-none pl-0  text-sm" key={item.label} role="menuitem">
              <div className="flex w-full pl-0 ">
                {item.child?.length > 0 && (
                  /* 2 level Accordions  -  Shop By Category */
                  <details
                    className={`${styles["level-2-details"]} pl-6 ${styles.levels} py-2 w-full ${
                      category[1] === label ? "bg-color2 border-l-3 border-color1" : ""
                    }`}
                    open={category[1] === label}
                    onClick={e => {
                      toggleLevelTwoDetails(e, label);
                    }}
                    role="menu"
                    aria-labelledby="menubutton"
                    aria-busy="true"
                  >
                    <summary
                      className="text-sm flex relative focus-visible:outline outline-offset-[-1px] "
                      onClick={() => adobeClick(`${header}|${label}`)}
                    >
                      <span
                        className={`w-full justify-start items-center text-sm  ${category[1] === label ? "font-bold" : ""} `}
                      >
                        {label}
                      </span>
                    </summary>

                    <div role="presentation">
                      {FILTER_MENU(item.child).map((list: any) => {
                        return (
                          <div className="outline-none pl-0  text-sm flex w-full" key={list.label} role="menuitem">
                            {list.child?.length > 0 ? (
                              <details
                                className={`${styles["level-2-details"]}  ${styles.levels}
                                    pl-4 py-2 w-full  ${category[2] === list.label ? "bg-color2" : ""}`}
                                open={category[2] === list.label}
                                onClick={e => {
                                  toggleLevelThreeDetails(e, label, list.label);
                                }}
                              >
                                <summary
                                  className="text-sm flex relative focus-visible:outline outline-offset-[-1px] "
                                  onClick={() => adobeClick(`${header}|${label}|${list.label}`)}
                                >
                                  <span
                                    className={`w-full justify-start items-center text-sm  ${
                                      category[2] === list.label ? "font-bold" : ""
                                    } `}
                                  >
                                    {list.label}
                                  </span>
                                </summary>

                                {FILTER_MENU(list.child).map((subChildItem: any) => {
                                  return (
                                    <div className="w-full  pr-4" key={subChildItem.label}>
                                      <Link
                                        href={subChildItem.url}
                                        prefetch={false}
                                        aria-hidden
                                        className="py-2 px-4 block text-sm"
                                        onClick={e => {
                                          e.stopPropagation();
                                          adobeClick(`${header}|${label}|${list.label}|${subChildItem.label}`);
                                        }}
                                        aria-label={subChildItem.label}
                                      >
                                        {subChildItem.label}
                                      </Link>
                                    </div>
                                  );
                                })}
                              </details>
                            ) : (
                              <div className="w-full pr-4" key={list.label}>
                                <Link
                                  href={list.url}
                                  prefetch={false}
                                  aria-hidden
                                  className="py-2 px-4 block text-sm"
                                  onClick={e => {
                                    e.stopPropagation();

                                    adobeClick(`${header}|${label}|${list.label}`);
                                  }}
                                  aria-label={list.label}
                                >
                                  {list.label}
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}

                {(!item?.child || item?.child.length === 0) && (
                  /* 1 level Accordions */
                  <Ripples className="inline-block w-full">
                    <Link
                      href={item.url}
                      prefetch={false}
                      aria-hidden
                      className="py-2 justify-start pl-6 items-center w-full text-sm focus-visible:outline outline-offset-[-1px]"
                      onClick={() => {
                        adobeClick(`${header}|${label}`);
                      }}
                      aria-label={label}
                    >
                      {label}
                    </Link>
                  </Ripples>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </details>
  );
};

export default memo(AccordianPanel);
