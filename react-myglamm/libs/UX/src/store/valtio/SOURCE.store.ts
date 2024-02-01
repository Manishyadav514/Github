import { proxy } from "valtio";

export const SOURCE_STATE = proxy({
  pdpSource: "",
  addToBagSource: "",
  previousCoupon: "",
  firstMilestoneAttempt: true,
  secondMilestoneAttempt: true,
  thirdMilestoneAttempt: true,
  isXoUser: false,
});
