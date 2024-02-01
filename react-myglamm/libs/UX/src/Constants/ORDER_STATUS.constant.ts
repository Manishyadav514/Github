enum ORDER_STATUS_CONSTANT {
  Pending = 11,
  Confirmed = 12,
  Cancelled = 13,
  In_Transit = 14,
  Completed = 15,
  Expired = 16,
  Return_Initiated = 17,
  Return_Completed = 18,
  Return_To_Origin = 19,
  Pending_Approval = 20,
  Reject = 71,
  Pre_Ordered = 72,
  Partial = 73,
  Ready_To_Ship = 74,
  Out_For_Delivery = 75,
  Failed = 81,
  Replaced = 82,
  Processing = 83,
}

export const getOrderStatusIds = (arr: string[]) => {
  return arr?.map((item: any) => ORDER_STATUS_CONSTANT[item]);
};
