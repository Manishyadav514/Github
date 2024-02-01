import React, { Fragment, ReactElement } from "react";

import AmpHeader from "@libComponents/AMP/AmpHeader";

const AMPLayout = ({ children }: { children: ReactElement }) => (
  <Fragment>
    <AmpHeader />

    {children}
  </Fragment>
);

export default AMPLayout;
