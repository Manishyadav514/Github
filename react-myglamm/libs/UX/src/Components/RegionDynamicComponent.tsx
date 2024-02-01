import { ReactElement } from "react";

import { Regions } from "@typesLib/APIFilters";

import { SHOP } from "@libConstants/SHOP.constant";

type RegionProps = {
  [char in Regions | "default"]?: ReactElement;
};

const RegionDynamicComponent = (props: RegionProps) => props[SHOP.REGION] || props.default || null;

export default RegionDynamicComponent;
