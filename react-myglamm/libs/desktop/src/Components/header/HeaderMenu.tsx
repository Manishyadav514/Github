import React, { useState } from "react";
import Link from "next/link";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import Spinner from "@libComponents/Common/LoadSpinner";

import { SHOP } from "@libConstants/SHOP.constant";

import MenuContent from "./MenuContent";

const HeaderMenu = ({ setShowOverlay, themed }: { setShowOverlay: (arg: boolean) => void; themed?: boolean }) => {
  const { headerMenu } = useSelector((store: ValtioStore) => store.navReducer);
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [showMenu, setShowMenu] = useState(true);
  const [menuOpened, setMenuOpened] = useState(false);
  const [widgets, setWidgets] = useState<any>({});
  const [loader, setLoader] = useState(false);

  const handleMenuClick = (e: Event, url: string) => {
    if (url.includes("/")) {
      closeMenu();
    } else {
      e.preventDefault();
      if (url === "#login") {
        SHOW_LOGIN_MODAL({ show: true });
      }
    }
  };

  const closeMenu = () => {
    setTimeout(() => {
      setShowMenu(false);
      setShowOverlay(false);
    }, 300);
    setTimeout(() => {
      setShowMenu(true);
    }, 600);
  };

  const getWidgetData = async (slug: string, headerClass: string) => {
    if (!widgets[slug] && headerClass !== "js-no-api" && !slug.includes("/")) {
      setLoader(true);

      const widgetApi = new WidgetAPI();
      widgetApi
        .getHomeWidgets({ where: { slugOrId: slug } }, 4, 0, !!userProfile?.id)
        .then(({ data: widget }) => {
          setLoader(false);
          setWidgets({
            ...widgets,
            [slug]: widget?.data?.data?.widget,
          });
        })
        .catch(_ => setLoader(false));
    }
  };

  const themeColorVal = themed ? "color2" : "color1";

  return (
    <nav className="relative w-full">
      <ul className="w-full flex text-center mt-2 pb-1 mb-0 relative">
        {headerMenu?.map((header: any) => {
          return (
            <li
              className={`mainnav-submenu hoverable border-b-2 border-transparent hover:border-${themeColorVal} block z-50 cursor-pointer ${
                SHOP.SITE_CODE.match(/tmc|orh/) ? "px-5" : "px-6" // on tmc/orh font takes a bit more space then normal
              }`}
              key={header.label}
              onMouseEnter={() => {
                if (header.child?.length > 0) {
                  getWidgetData(header.url, header.class);
                  setShowOverlay(true);
                }
              }}
              onMouseLeave={() => {
                setMenuOpened(!menuOpened);
                setShowOverlay(false);
              }}
            >
              {header.url === "/blog/" ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={header.url}
                  className="relative flex border-b-2 border-transparent text-uppercase p-1.5 text-sm"
                >
                  <span>{header.label}</span>
                </a>
              ) : (
                <Link
                  href={header.url}
                  onClick={(e: any) => handleMenuClick(e, header.url)}
                  className={`relative flex border-b-2 border-transparent uppercase p-0.5 text-xs ${
                    themed ? "text-color2" : "text-gray-800"
                  } font-medium py-3`}
                >
                  <span>{header.label}</span>
                </Link>
              )}
              {showMenu && header.child?.length > 0 && (
                <div
                  style={{ minHeight: "280px" }}
                  className={`p-4 mb-16 sm:mb-0 mt-0.5 mega-menu shadow-xl border-t border-solid	border-slate-50 hidden absolute left-0 text-left w-full ${
                    themed ? "bg-color1 text-color2" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between">
                    {header.class !== "hide-left-menu" && (
                      <div
                        className="flex"
                        style={{
                          width: header.class ? (header.class === "makeup-grid-view" ? "70%" : "20%") : "100%",
                        }}
                      >
                        {header.child.map((subHeader: any) => (
                          <div className="menu-column mr-2.5 w-52 inline-block mb-1" key={subHeader.label}>
                            <div className="uppercase text-left mb-1">
                              <Link
                                href={subHeader.url}
                                onClick={(e: any) => handleMenuClick(e, subHeader.url)}
                                className={`no-linkclevrtap relative font-bold mb-1 text-${themeColorVal} pb-0.5`}
                              >
                                <span className="relative text-uppercase text-sm">{subHeader.label}</span>
                              </Link>
                            </div>
                            <ul className="list-none menu-list text-left w-auto p-0 pr-6">
                              {subHeader.child?.map((subHeaderItems: any) => {
                                return (
                                  <React.Fragment key={subHeaderItems.label}>
                                    {subHeaderItems.child?.length > 0 ? (
                                      <>
                                        <div className="uppercase text-left mb-2 mt-6">
                                          <Link
                                            href={subHeaderItems.url}
                                            onClick={(e: any) => handleMenuClick(e, subHeaderItems.url)}
                                            className={`no-linkclevrtap relative font-bold mb-1 text-${themeColorVal} pb-0.5`}
                                          >
                                            <span className="relative text-uppercase text-sm">{subHeaderItems.label}</span>
                                          </Link>
                                        </div>
                                        <ul className="list-none menu-list text-left w-auto p-0 pr-6">
                                          {subHeaderItems.child.map((childItemsHeader: any) => (
                                            <li
                                              key={childItemsHeader.label}
                                              className="text-left relative mb-1"
                                              onClick={(e: any) => handleMenuClick(e, childItemsHeader.url)}
                                            >
                                              <Link
                                                href={childItemsHeader.url}
                                                className={`no-linkclevrtap w-full ${themed ? "text-color2" : "text-black"}`}
                                              >
                                                <span
                                                  className={`cate-menu relative inline-block text-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto ${
                                                    themed ? "after:bg-color2" : "after:bg-color1"
                                                  } after:w-0 after:h-0.5 after:duration-500 hover:after:w-full`}
                                                >
                                                  {childItemsHeader.label}
                                                </span>
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </>
                                    ) : (
                                      <li
                                        className="text-left relative mb-1"
                                        onClick={(e: any) => handleMenuClick(e, subHeaderItems.url)}
                                      >
                                        <Link
                                          href={subHeaderItems.url}
                                          className={`no-linkclevrtap w-full ${themed ? "text-color2" : "text-black"}`}
                                        >
                                          <span
                                            className={`cate-menu relative inline-block text-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:m-auto ${
                                              themed ? "after:bg-color2" : "after:bg-color1"
                                            } after:w-0 after:h-0.5 after:duration-500 hover:after:w-full`}
                                          >
                                            {subHeaderItems.label}
                                          </span>
                                        </Link>
                                      </li>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {widgets && widgets[header.url] ? (
                      <div
                        className={`rhs text-right w-auto  ${
                          header.class === "makeup-grid-view"
                            ? "banner-divider"
                            : header.class === "hide-left-menu"
                            ? "w-full"
                            : "w-4/5"
                        }`}
                      >
                        <MenuContent data={header} widgets={widgets[header.url]} closeMenu={closeMenu} />
                      </div>
                    ) : (
                      loader && <Spinner className="absolute h-10 w-10 m-auto inset-0" />
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <style jsx>
        {`
          .hoverable:hover .mega-menu {
            display: block;
          }
          .toggle-input:not(checked) ~ .mega-menu {
            display: none;
          }
          .toggle-input:checked ~ .mega-menu {
            display: block;
          }
          .main-nav ul li:nth-child(5):hover > .mainnav-submenu .menu-body .menu-column:first-child ul {
            width: 212px;
          }
          .main-nav ul li:nth-child(5):hover > .mainnav-submenu .menu-body .menu-column ul {
            width: 180px;
          }
          .menu-content div > div.collectionProduct:nth-child(4) {
            margin-right: 4px;
          }
          @media screen and (min-width: 1260px) and (max-width: 1550px) {
            .main-nav ul li:hover > .mainnav-submenu ul {
              width: 135px;
              padding-right: 15px !important;
            }
            .mainnav-submenu .menu-column:last-child ul {
              padding-right: 0 !important;
            }
          }
          @media screen and (min-width: 1024px) and (max-width: 1259px) {
            .main-nav ul li:hover > .mainnav-submenu ul {
              width: 116px;
              padding-right: 15px !important;
            }
            .main-nav ul li {
              width: 16.2%;
            }
            .mainnav-submenu .menu-column:last-child ul {
              padding-right: 0 !important;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default HeaderMenu;
