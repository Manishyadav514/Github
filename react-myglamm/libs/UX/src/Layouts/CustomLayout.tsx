import React, { Fragment, ReactElement } from "react";

import useTranslation from "@libHooks/useTranslation";
import BackBtn from "@libComponents/LayoutComponents/BackBtn";
import BagButton from "@libComponents/Header/BagButton";

interface CustomLayProps {
  header?: string;
  fallback?: any;
  showCart?: boolean;
  children: ReactElement;
}

const CustomLayout = ({ header, fallback, children, showCart = false }: CustomLayProps) => {
  const { t, isConfigLoaded } = useTranslation();

  return (
    <Fragment>
      <header className="flex w-full items-center sticky h-12 top-0 z-50 bg-white shadow">
        <BackBtn />

        {isConfigLoaded && <h2 className="font-semibold capitalize">{t(header || "") || fallback}</h2>}

        {showCart && (
          <div className="ml-auto flex items-center mr-1">
            <BagButton />
          </div>
        )}
      </header>

      {children}
    </Fragment>
  );
};

export default CustomLayout;
