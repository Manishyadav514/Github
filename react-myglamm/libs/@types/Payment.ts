import { userCart } from "./Cart";
import { UserAddress } from "./Consumer";

export type PaymentOrder = {
  position: number;
  fields: Array<string>;
  active: boolean;
  isBin?: boolean;
  downtimes?: Downtimes;
  autoExpand?: boolean;
  gateway: Gateways;
  icon?: any;
  data?: any;
  isSaveCardEnabled?: boolean;
  name:
    | "WALLET"
    | "NB"
    | "CARD"
    | "CASH"
    | "UPI"
    | "creditCard"
    | "netBanking"
    | "netBankingBin"
    | "wallets"
    | "PAYPAL"
    | "COD"
    | "SIMPL"
    | "PAYTM"
    | "giftcard"
    | "CRED"
    | "Pay with Rewards";
};

export type UpiData = {
  code: string;
  imageUrl: string;
  name: string;
  android_package: string;
  ios_package: string;
  web_package: string;
  android_scheme: string;
};

export type Downtimes = {
  message: string;
  status?: string;
  unavailablePaymentMethods?: { collect?: string[]; intent?: string[] };
};

export type Gateways = "razorpay" | "payu" | "juspay";

export type JuspayPaymentOrder = {
  juspay_merchant_key?: string;
  payment_methods: PaymentOrder[];
};

export type UpiIntent = {
  code: string;
  offer_description: string;
  discount_amount: string;
  offer_id: string;
  effective_amount: string;
};

export type UpiCollect = {
  vpa_handle: string;
  offer_description: string;
  discount_amount: string;
  offer_id: string;
  effective_amount: string;
};

export type WalletOffer = {
  discount_amount: string;
  effective_amount: string;
  offer_description: string;
  offer_id: string;
  wallet: string;
};

export type NetBankingOffer = {
  discount_amount: string;
  effective_amount: string;
  offer_description: string;
  offer_id: string;
  bank: string;
};

export type BestOffers = {
  contains_offer: boolean;
  best_offer: string;
  offer_id?: string;
  effective_amount?: string;
  wallet_offers?: WalletOffer[];
  nb_offers?: NetBankingOffer[];
  upi_offers?: {
    intent: UpiIntent[];
    collect: UpiCollect[];
  };
};

export type SavedCardList = {
  card_brand: string;
  card_exp_month: string;
  card_exp_year: string;
  card_fingerprint: string;
  card_global_fingerprint: string;
  card_isin: string;
  card_issuer: string;
  card_issuer_country: string;
  card_number: string;
  card_reference: string;
  card_sub_type: string;
  card_token: string;
  card_type: string;
  expired: boolean;
  extended_card_type: string;
  juspay_bank_code: string;
  metadata: { origin_merchant_id: string };
  name_on_card: string;
  nickname: string;
  provider: string;
  provider_category: string;
  tokenize_support: boolean;
  imageUrl: string;
  short_label: string;
  long_label: string;
};

export type paymentMethods =
  | "upi"
  | "NB"
  | "WALLET"
  | "emi"
  | "cardless_emi"
  | "paylater"
  | "emandate"
  | "creditCard"
  | "UPI"
  | "netbanking"
  | "wallet"
  | "simpl"
  | "paytm"
  | "paypal"
  | "CRED"
  | "TWID"
  | "CARD"
  | "COD"
  | "cash"
  | "card"
  | "wallets";

export type PaymentData = {
  name?: string;
  type?: string;
  iconUrl?: string;
  method: paymentMethods;
  bank?: string;
  wallet?: string;
  vpa?: string;
  card?: {
    name: string;
    number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
  };
  upiFlowType?: string;
  selectedAppForUpiIntent?: UpiIntentApp;
  saveCardDetails?: boolean;
  bankName?: string;
};

export type PaymentType = "paytm" | "paypal" | "cash" | "razorpay" | "simpl" | "payu" | "giftCard" | "juspay";

export type RazorListData = Array<{ value: string; name: string }>;

export type RZPayData = { RazorBankList: RazorListData; RazorWallets: RazorListData };

export type communicationPreference = {
  email: boolean;
  whatsApp: boolean;
  sms: boolean;
};

export type SuggestedPaymentPayload = {
  paymentMethod: {
    method: string;
    details: {
      type?: string;
      name: string;
      value: {
        razorpay: string;
        payu: string;
      };
    };
  };
  consent: boolean;
};

export type SimplState = {
  chargeToken?: string;
  redirectionURL?: string;
  message?: string;
  creditLimit?: number;
};

export type CreditFromValues = {
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
};

export type UpiIntentApp = {
  ios_package: string;
  code: string;
  name: string;
  imageUrl: string;
  android_package?: string;
  web_package: string;
};

export type CustomEvents = "LOADING_START" | "LOADING_STOP" | "COUPON_EXPIRED";

export type GiftCardFormValues = {
  cardNumber: string;
  cardPin: string;
};

export type GiftCard = { cardNumber: string; balance: number; used: number; cardPin: string };

export type DutyModalProps = { rawCartData: any; cartData: userCart; shippingAddress: UserAddress };

export type ClientAuthDetails = {
  customerId?: string;
  clientAuthToken: string;
  clientAuthTokenExpiry?: string;
  userId?: string;
};

export type credData = { isEligible: boolean; layout: { title: string; icon: string; sub_text: string } };

export type twidData = { balance: number; isEligible: boolean };

export interface PaymentMethodProps {
  payment: PaymentOrder;
  handleCreateOrder: (arg1: PaymentType, arg2?: PaymentData) => any;
}

export type PayNBData = { code: string; name: string; imageUrl: string };
export type PaymentOffers = {
  customer: {
    id: string;
  };
  order: {
    amount: string;
    currency: string;
    merchant_id: string;
    payment_channel: string;
  };
  payment_method_info?:
    | {
        payment_method_type: string;
        payment_method_reference?: string;
        payment_method?: string;
      }[]
    | {
        payment_method_type: string;
        payment_method: string;
        card_type: string;
        card_bin: string;
      }[];
};
