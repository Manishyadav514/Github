import React from "react";

import ServiceLanding from "@libComponents/CommonBBC/Services/ServiceLanding";
import ServiceDetail from "@libComponents/CommonBBC/Services/ServiceDetail";
import ReviewListing from "@libComponents/CommonBBC/Services/ReviewListing";

import { serviceGetInitialProps } from "@libUtils/bbcServices";

import Error from "@libPages/_error";

const Services = (props: any) => {
  if (props.isError) {
    return <Error />;
  }
  if (props.pageType === "service-reviews") {
    return <ReviewListing {...props} />;
  }
  if (props.pageType === "service-detail") {
    return <ServiceDetail {...props} />;
  }
  return <ServiceLanding {...props} />;
};

Services.getInitialProps = serviceGetInitialProps;

export default Services;
