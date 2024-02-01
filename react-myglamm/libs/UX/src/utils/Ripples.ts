import { createRipples } from "react-ripples";

import { SHOP } from "@libConstants/SHOP.constant";
import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import React from "react";

const Ripples = IS_DESKTOP ? React.Fragment : createRipples({ color: SHOP.PRIMARY_COLOR });

export default Ripples;
