/**
 * STATUS - 1: CLAIM (Enable/Disabled based on points left(balance))
 *          2: REDEEM (Already Claimed Prize)
 *          3: REDEEMED (Already Redeemed Prize i.e ordered)
 */
export const CTA_PRIZE = [
  { label: "LOCKED", key: "lockedTitle", class: "bg-white text-gray-400/75" },
  { label: "CLAIM", key: "claimTitle", class: "bg-black text-white" },
  { label: "REDEEM", key: "redeem", class: "bg-black text-white" },
  { label: "REDEEMED", key: "redeemedTitle", class: "bg-themePink text-white" },
];
