import React, { ReactElement } from "react";

import TVCHead from "@libComponents/TVC/TVCHead";

import TVCLayout from "@layout/TVCLayout";

import TVCWidgets from "@components/TVC/TVCWidgets";

import { getTVCInitialProps } from "@libUtils/homeUtils";

const TVC = ({ widgets }: any) => (
  <section className="h-auto min-h-screen">
    <TVCHead />

    {widgets?.map((widget: any, index: number) => (
      <TVCWidgets key={widget.id} widget={widget} index={index} />
    ))}
  </section>
);

TVC.getLayout = (children: ReactElement) => <TVCLayout>{children}</TVCLayout>;

TVC.getInitialProps = getTVCInitialProps;

export default TVC;
