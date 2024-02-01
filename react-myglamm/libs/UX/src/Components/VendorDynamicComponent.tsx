import { ReactElement } from "react";

import { getVendorCode } from "@libUtils/getAPIParams";

import { AllVendors } from "@typesLib/APIFilters";

type VendorDynComp = {
  [char in AllVendors | "default"]?: ReactElement;
};

const VendorDynamicComponent = (props: VendorDynComp): ReactElement | null => {
  // @ts-ignore
  const otherThenDefault = props[getVendorCode()] || (props[getVendorCode().split("-")[0]] as ReactElement);

  if (otherThenDefault) return otherThenDefault;

  return props.default || null;
};

export default VendorDynamicComponent;
