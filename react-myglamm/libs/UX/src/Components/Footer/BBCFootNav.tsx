import React from "react";
import Link from "next/link";

import HomeIcon from "../../../public/svg/bbcHome.svg";
import ShopIcon from "../../../public/svg/bbcShop.svg";
import StoreIcon from "../../../public/svg/bbcStore.svg";
import CommunityIcon from "../../../public/svg/bbcCommunity.svg";

const BBCFootNav = () => (
  <div
    style={{ boxShadow: "0 -5px 5px -5px rgb(0 0 0 / 20%)" }}
    className="h-14 flex justify-between items-center z-10 w-full bg-white sticky bottom-0 inset-x-0 rounded-t-md"
  >
    <a href="https://www.babychakra.com" className="flex flex-col justify-center items-center w-1/5" aria-label="HOME">
      <HomeIcon />
      <p className="text-xs tracking-widest">HOME</p>
    </a>

    <a
      href="https://www.babychakra.com/community"
      className="flex flex-col justify-center items-center w-1/5"
      aria-label="COMMUNITY"
    >
      <CommunityIcon className="z-50" />
      <p className="text-xs tracking-widest">COMMUNITY</p>
    </a>

    <div className="w-1/12" />
    <a
      href="https://www.babychakra.com/babychakra-select?bbc_source=bbc_tabs&bbc_medium=bbc_bottom_nav"
      className="h-14 w-14 rounded-full absolute -top-7 inset-0 mx-auto flex justify-center items-center bg-pink-200"
      aria-label="link"
    >
      <svg width="52px" height="52px" viewBox="0 0 52 52" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient x1="50%" y1="100%" x2="50%" y2="3.061617e-15%" id="linearGradient-1">
            <stop stopColor="#D32B34" offset="0%" />
            <stop stopColor="#F7434C" offset="100%" />
          </linearGradient>
          <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stopColor="#FFE28B" offset="0%" />
            <stop stopColor="#FF6C02" offset="100%" />
          </linearGradient>
        </defs>
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Artboard" transform="translate(-5.000000, -6.000000)">
            <g id="Group" transform="translate(6.000000, 7.000000)">
              <g id="Group-17" transform="translate(11.000000, 11.000000)" fillRule="nonzero">
                <path
                  d="M2.29605375,12.8821789 L26.9786315,12.8821789 L26.9786315,24.6641852 C26.9786315,26.1863931 25.8924383,27.4918495 24.3956056,27.7686311 C21.0352943,28.3899917 17.7347055,28.7006718 14.4938393,28.7006718 C11.2827599,28.7006718 8.0726736,28.3956762 4.86358042,27.7856852 C3.37398542,27.5025397 2.29605375,26.2004119 2.29605375,24.6841452 L2.29605375,12.8821789 L2.29605375,12.8821789 Z"
                  id="Rectangle"
                  fill="url(#linearGradient-1)"
                />
                <polygon
                  id="Rectangle"
                  fill="url(#linearGradient-2)"
                  points="11.7672755 12.8821789 17.5074099 12.8821789 17.5074099 28.7006718 11.7672755 28.7006718"
                />
                <rect
                  id="Rectangle"
                  fill="#000000"
                  opacity="0.3"
                  x="2.00904702"
                  y="12.8821789"
                  width="24.9695845"
                  height="1.43503359"
                />
                <rect
                  id="Rectangle"
                  fill="#F7434C"
                  x="0"
                  y="7.42905127"
                  width="29.2746853"
                  height="5.45312766"
                  rx="1.14802687"
                />
                <rect id="Rectangle" fill="#FFDB57" x="11.193262" y="7.42905127" width="6.88816124" height="5.45312766" />
                <path
                  d="M11.3918426,7.46913132 L3.51149624,7.46913132 C3.21626391,6.61129016 3.06864774,5.9552957 3.06864774,5.50114791 C3.06864774,4.81992623 3.15929071,3.97321576 3.51149624,3.66993161 C3.86370178,3.36664746 4.73369511,3.43785134 5.35407767,3.5331645 C5.97446021,3.62847765 5.78293961,3.42536791 7.23024517,4.16599779 C8.67755072,4.90662766 9.00097018,5.18565028 9.72929815,5.7720967 C10.2148501,6.163061 10.7690316,6.72873919 11.3918426,7.46913132 Z"
                  id="Path-12"
                  fill="#EF9323"
                />
                <path
                  d="M26.2277966,7.46913132 L18.3474503,7.46913132 C18.052218,6.61129016 17.9046018,5.9552957 17.9046018,5.50114791 C17.9046018,4.81992623 18.0066031,3.83644865 18.3588086,3.5331645 C18.7110142,3.22988034 19.5707289,3.3557241 20.1911114,3.45103726 C20.811494,3.54635042 20.6188936,3.42536791 22.0661993,4.16599779 C23.5135048,4.90662766 23.8369242,5.18565028 24.5652522,5.7720967 C25.0508041,6.163061 25.6049856,6.72873919 26.2277966,7.46913132 Z"
                  id="Path-12"
                  fill="#EF9323"
                  transform="translate(22.066199, 5.405659) scale(-1, 1) translate(-22.066199, -5.405659) "
                />
                <path
                  d="M3.49152239,3.73561342 C3.75864356,2.91544142 4.0183259,2.30031733 4.27056941,1.89024116 C4.52281291,1.48016498 4.97544321,0.937271383 5.62846031,0.261560359 C6.0914595,-0.0871867866 6.63329987,-0.0871867866 7.25398138,0.261560359 C8.18500366,0.78468108 9.02457525,1.44012539 9.81095611,2.09000964 C10.33521,2.52326578 10.8841238,3.07180039 11.4576974,3.73561342 L12.2408545,4.70600627 L16.8979606,4.70600627 C17.8451852,3.61752581 18.6002909,2.81658301 19.1632778,2.3031779 C19.7262646,1.78977278 20.3885897,1.29811678 21.1502528,0.828209878 C22.0107358,0.253987691 22.888323,0.168464336 23.7830147,0.571639816 C24.6777064,0.974815295 25.3412314,1.94842772 25.7735896,3.4924771 C25.1769804,3.43773026 24.7185519,3.43773026 24.3983037,3.4924771 C23.9179317,3.57459734 23.1327003,3.81134275 21.8560809,4.52535049 C21.0050016,5.00135566 20.2801361,5.50166385 19.6814848,6.02627507 L18.1349459,7.46913132 L11.0164404,7.46913132 C10.2519367,6.55952275 9.64410354,5.92428596 9.19294089,5.56342089 C8.74177825,5.20255582 8.01827046,4.77291184 7.02241755,4.27448895 C6.07776861,3.82837519 5.35898617,3.56770458 4.86607025,3.4924771 C4.37315432,3.41724962 3.9149717,3.49829507 3.49152239,3.73561342 Z"
                  id="Path-13"
                  fill="#FFDB57"
                />
                <rect id="Rectangle" fill="#F5BB3C" x="12.3412889" y="4.8459908" width="4.5921075" height="2.58306046" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </a>

    <a className="flex flex-col justify-center items-center w-1/5" href="https://www.babychakra.com/learn" aria-label="STORIES">
      <StoreIcon />
      <p className="text-xs tracking-widest">STORIES</p>
    </a>

    <Link href="/" className="flex flex-col justify-center items-center w-1/5" aria-label="shop">
      <ShopIcon />
      <p className="text-xs tracking-widest">SHOP</p>
    </Link>
  </div>
);

export default BBCFootNav;
