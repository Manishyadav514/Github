import React from "react";

import TVCHead from "@libComponents/TVC/TVCHead";

import Widgets from "@libDesktop/Components/home/Widgets";

import { getTVCInitialProps } from "@libUtils/homeUtils";

const TVC = ({ widgets }: any) => (
  <div className="bg-gray-100 pull-left fullwidth">
    <TVCHead />

    <Widgets widgets={widgets} />
  </div>
);

TVC.getInitialProps = getTVCInitialProps;

export default TVC;
