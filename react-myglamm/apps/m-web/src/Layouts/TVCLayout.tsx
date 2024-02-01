import React, { Fragment, ReactElement } from "react";

import TVCFooter from "@components/TVC/TVCFooter";
import Header from "@libComponents/Header/Header";

const TVCLayout = ({ children }: { children: ReactElement }) => (
  <Fragment>
    <Header />

    {children}

    <TVCFooter />
  </Fragment>
);

export default TVCLayout;
