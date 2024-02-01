export const FallBackPaymentOrder = [
  { position: 0, fields: [], active: true, name: "UPI" },
  { position: 1, fields: [], active: true, name: "creditCard" },
  { position: 2, fields: [], active: true, name: "COD" },
  { position: 3, fields: [], active: true, name: "paytm" },
  {
    position: 4,
    fields: ["UTIB", "ICIC", "HDFC", "SBIN", "YESB"],
    active: true,
    name: "netBanking",
  },
  { position: 5, fields: [], active: true, name: "wallets" },
  { position: 6, fields: [], active: true, name: "paypal" },
];

export const FallBackJuspayPaymentOrder = [
  {
    position: 0,
    name: "CASH",
    icon: {
      default: "https://files.myglamm.com/site-images/original/cash_default.png",
    },
    active: true,
    autoExpand: true,
    fields: [],
    gateway: "juspay",
  },
];
