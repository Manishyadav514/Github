import React, { ReactElement, Fragment } from "react";

import MyGlammXOHeader from "@libComponents/MyGlammXO/MyGlammXOHeader";

interface SurveyLayoutProps {
  pageURL: string;
  header: string;
  children: ReactElement;
}

const SurveyLayout = ({ children, pageURL, header }: SurveyLayoutProps) => {
  return (
    <Fragment>
      <MyGlammXOHeader pageURL={pageURL} header={header} />

      {children}
    </Fragment>
  );
};

export default SurveyLayout;
