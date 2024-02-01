import React from "react";

import ServiceDetail from "@libComponents/CommonBBC/Services/ServiceDetail";

import ReviewListing from "../Components/common/bbc/services/ReviewListing";
import ServiceLanding from "../Components/common/bbc/services/ServiceLanding";

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
