import * as React from "react";

import ErrorComponent from "@libPages/_error";

function NotFound() {
  return <ErrorComponent statusCode={404} />;
}

export default NotFound;
