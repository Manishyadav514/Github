import { SHOP } from "@libConstants/SHOP.constant";
import React, { useEffect } from "react";

const PDPStyle = () => {
  const handleButtonColor = (color: any) => {
    document.documentElement.style.setProperty("--btnBg", `linear-gradient(${color}, ${color})`);
  };

  const SITE_CODE = SHOP?.SITE_CODE;

  const changeBrandColors = () => {
    console.log(SITE_CODE);
    switch (SITE_CODE) {
      case "mgp":
      case "lit":
      case "popxo":
        handleButtonColor("#ed1b5b");
        return (
          <style jsx global>
            {`
              :root {
                --color1: #ed1b5b;
                --color2: #fef4f7;
                --color3: #ffd6d6;
                --color4: #f25f8c;
                --themeGray: #f4f4f4;
              }
            `}
          </style>
        );

      case "orh":
        handleButtonColor("#14472c");
        return (
          <style jsx global>
            {`
              :root {
                --color1: #14472c;
                --color2: #d6eec5;
                --color3: #ffffff;
                --color4: #238350;
              }
            `}
          </style>
        );

      case "tmc":
        handleButtonColor("#3168b8");
        return (
          <style jsx global>
            {`
              :root {
                --color1: #3168b8;
                --color2: #edf6ff;
                --color3: #b4d0f1;
                --color4: #edf6ff;
              }
            `}
          </style>
        );
      case "srn":
      case "blu":
        handleButtonColor("#fe75a1");
        return (
          <style jsx global>
            {`
              :root {
                --color1: #fe75a1;
                --color2: #ffe0ea;
                --color3: #ffffff;
                --color4: #ffc2d6;
              }
            `}
          </style>
        );
      case "stb":
      case "orb":
        handleButtonColor("#1f2e63");
        return (
          <style jsx global>
            {`
              :root {
                --color1: #1f2e63;
                --color2: #dce5ff;
                --color3: #ffffff;
                --color4: #596fb6;
              }
            `}
          </style>
        );
      default:
        break;
    }
  };

  return <>{changeBrandColors()}</>;
};

export default PDPStyle;
