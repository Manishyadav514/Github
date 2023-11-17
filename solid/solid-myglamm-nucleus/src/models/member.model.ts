export interface MemberI {
  id: string;
  vendorCode?: string;
  firstName: string; // note: used for storeName when type is 'retailer'
  lastName: string;
  email: string;
  phoneNumber: string;
  location?: LocationI;
  role?: string[] | null;
  meta: MetaI;
  communicationPreference?: CommunicationPreferenceI;
  referenceCode?: string;
  parentReferenceCode?: string;
  memberType: MemberTypeI;
  commission?: CommissionI;
  shareUrl?: string;
  statusId: number;
  createdAt?: string;
  updatedAt?: string;
  isPosUser: boolean;
  salesManager?: number;
  warehouseId?: string;
  pincode?: string;
  posId?: string;
  posUserList?: string[];
  isMyglammStore: boolean;
  totalNetworkCount?: number;
}
export interface LocationI {
  countryName: string;
  countryCode: string;
  phoneCode: string;
}
export interface MetaI {
  misInfo: MisInfoI;
  registrationInfo: RegistrationInfoI;
  tags?: object[];
  note?: string;
  maxInviteCode?: number;
  excludeInSales?: boolean;
  wishlists?: [];
  isCodEnabled?: boolean;
  isPowerUser?:number,
}
export interface CommunityProfileI {
  vendorCode:string,
  memberId: string,
  meta: {
    isPowerUser: number
  }
}
export interface MisInfoI {
  gender: string;
}
export interface RegistrationInfoI {
  dob: string;
  appVersion?: string;
  deviceType?: string;
  deviceId?: string;
  utm?: UtmI;
}
export interface UtmI {
  channel: string;
  utmCampaign: string;
  utmContent: string;
  utmMedium: string;
  utmSource: string;
  utmTerm: string;
}
export interface CommunicationPreferenceI {
  email: boolean;
  sms: boolean;
  whatsApp: boolean;
}
export interface MemberTypeI {
  typeName: MemberTypeEnum;
  levelName: string;
}

export interface CommissionI {
  summary?: Summary;
}

export interface Summary {
  personalSales: number;
  personalSalesCommission: number;
  circleSales: number;
  circleSalesCommission: number;
  onlineSales: number;
  offlineSales: number;
  totalSales: number;
  directSales:any
}

export interface TypeAndLevelI {
  id: string;
  vendorCode: string;
  type: MemberTypeEnum;
  level: string;
  commissionLevel: number;
  sales: SalesI;
  commission: TypeCommissionI;
  changeLevel: boolean;
  status: number;
}
export interface SalesI {
  directSales: number;
  circleSales: number;
  personalSales: number;
  offlineSales: number;
  companySales: number;
}
export interface TypeCommissionI {
  directSales: number;
  circleSales: number;
  personalSales: number;
  offlineSales: number;
}
export interface GlammPointsI {
  lastModifiedBy: string;
  statusId: number;
  _id: string;
  vendorCode: string;
  identifier: string;
  currentBalance: number;
  meta: GlammPointsMetaI;
  createdAt: string;
  updatedAt: string;
}
export interface GlammPointsMetaI {
  name: string;
  email: string;
  contact: string;
}
export interface SalesManagerI {
  _id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  allowedVendorCodes?: string[];
  allowedCountries?: string[];
  role?: string[];
}

export interface ReferralColumnI {
  type?: string;
  value: string;
}
export interface GlammPointsDetailI {
  currentBalance: number;
  totalRecords: number;
  walletTransactionsResponses: WalletTransactionsResponsesI[];
}
export interface WalletTransactionsResponsesI {
  source: string;
  _id: string;
  currentBalance: number;
  previousBalance: number;
  comments: string;
  transactionAmount: number;
  transactionType: number;
  transactionUniqueId: string;
  identifier: string;
  vendorCode: string;
  createdAt: string;
  updatedAt: string;
}
export interface WalletTransactionsColumnI {
  key: string;
  value: number | string;
}

export interface GlammReferralI {
  total: number;
  directReferrals: DirectReferralsOrIndirectReferralsI;
  indirectReferrals: DirectReferralsOrIndirectReferralsI;
}
export interface DirectReferralsOrIndirectReferralsI {
  total: number;
  gold: number;
  silver: number;
  platinum: number;
}
export interface GlammCircleI {
  total: number;
  circles?: CirclesI[];
}
export interface CirclesI {
  id: string;
  firstName: string;
  lastName: string;
  levelName: string;
  createdAt: string;
}
export interface MemberPreferenceQuestionI {
  choices?: ChoiceI[];
  required?: number;
  status: number;
  _id: string;
  tag?: string;
  vendorCode: string;
  type: 'multiselect' | 'singleselect' | 'range' | 'freetext';
  question: string;
  shortDescription?: string;
  ans?: string[];
  meta?: MemberPreferenceMetaI;
}
export interface ChoiceI {
  choice: string;
  isSelected?: boolean;
}
export interface MemberPreferenceMetaI {
  url: string;
}
export interface MemberPreferenceQuestionAnswerI {
  [key: string]: string[];
}
export interface ResultI {
  [key: string]: string[];
}
export interface MemberAddressI {
  id?: string;
  identifier?: string;
  cityId: string;
  cityName: string;
  stateName: string;
  stateId: string;
  countryName: string;
  countryId: string;
  name: string;
  email: string;
  phoneNumber: string;
  addressNickName: string;
  landmark: string;
  societyName: string;
  flatNumber: string;
  buildingNumber: string;
  latitude?: string;
  longitude?: string;
  location: string;
  zipcode: string;
  defaultFlag: string; //NOTE: It should be boolean but backend is accepting true/false as string and they dont have bandwidth to change it.
  meta?: AddressMetaI;
  statusId?: number;
  createdAt?: string;
  updatedAt?: string;
  addressType?: string; //NOTE :This key is created at front end for internal use.It is used to check address type in order right panel.
}

export interface AddressMetaI {
  source: string;
  deviceType: string;
  deviceId: string;
  addressId: number;
}

// note: used only for form component
export interface MemberRetailFormI {
  storeName: string;
  location: string;
  posId: string;
  pincode: string;
  warehouseId: string;
  posUserList: string[];
  excludeInSales: boolean;
  isMyglammStore: boolean;
  dob: string;
}

// note: used only for form component
export interface MemberOtherFormI {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  maxInviteCode: number;
  salesManager: number;
  isPosUser: boolean;
}

/*
  note: fields when type is 'ambassador', 'influencer' or 'beauty guide' 
  firstName,
  lastName,
  gender,
  salesManager,
  maxInviteCode,
  pointOfSaleMember
*/

/*
  note: fields when type is 'retailer'
  firstName (save storeName here),
  lastName (save as location),
  posId,
  pincode,
  warehouseId,
  doNotCountInSalesReport,
  isMyglammStore
*/

export enum MemberTypeEnum {
  RETAILER = <any>'retailer',
  AMBASSADOR = <any>'ambassador',
  BEAUTY_GUIDE = <any>'beauty guide',
  INFLUENCER = <any>'influencer'
}
export interface SalesDetailsI {
  type: string;
  onlineSalesReward: number;
  circleSales: number;
  personalSales: number;
  offlineSales: number;
  total: number;
}
export interface MemberOnBoardedI {
  memberId: string;
  memberName: string;
  email: string;
  phoneNumber: string;
  memberOnboardDate: string;
  memberParentName?: string;
  personalSales?: number;
  circleSales?: number;
  onlineSales?: number;
  offlineSales?: number;
  totalSales?: number;
}
export interface EarningSummaryI {
  firstName: string;
  lastName: string;
  networkCount: number;
  referenceCode: string;
  shareUrl: string;
  phoneNumber: string;
  email: string;
  glammPoints: number;
  saleDetails?: SalesDetailsI[];
  memberDetails: MemberDetailsI;
  fileUrl?: string;
}

export interface MemberDetailsI {
  data?: MemberOnBoardedI[] | null;
  totalPersonalSales: number;
  totalOnlineSales: number;
  totalCircleSales: number;
  totalOfflineSales: number;
  indirectSales: number;
  total: number;
}
export interface ListProductColumnI {
  key: string;
  value: string;
  subKey?: string;
}
export interface MemberProductStockDetailsI {
  sku: string;
  title: string;
  imageUrl: object;
  warehouse?: WarehouseI;
}

export interface WarehouseI {
  warehouseId: string;
  stock: number;
  threshold: number;
}
export interface StockDetailsI {
  product: number;
  availableStock: number;
  outOfStockProduct: number;
  freeProductStock: number;
}
export interface PinCodeI {
  pincode: string;
  cityId: number;
  cityName: string;
  stateId: number;
  stateName: string;
  countryId: number;
  countryName: string;
  countryLabel: string;
  countryCurrency: string;
  currencyDenomination: number;
}

export interface MemberInventoryI {
  id?: string;
  userId: string;
  identifier: string;
  vendorCode: string;
  dispatchNumber: string;
  selectedDate: string;
  data?: MemberInventoryDataI[];
  log?: MemberInventoryLogI[];
  fileName?: string;
  status: MemberInventoryStatusEnum;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemberInventoryDataI {
  identifier: string;
  sku: string;
  stock: number;
  freeProductStock: number;
  remark?: string;
}

export interface MemberInventoryLogI {
  name: string;
  userId: string;
  action: string;
  datetime: string;
}


export interface BulkUpload {
  fileUrl: string;
  syncWebengage: boolean;
  email?: string;
  welcomePoints?: boolean;
  sendCommunication?: boolean;
  tags?: string[]
}

export enum MemberInventoryStatusEnum {
  APPROVED = <any>'APPROVED',
  IN_PROGRESS = <any>'IN_PROGRESS',
  RECALL = <any>'RECALL',
  REJECTED = <any>'REJECTED',
  FAILED = <any>'FAILED'
}

// used only for displaying inventory table
export interface MemberInventoryDataViewI extends MemberInventoryDataI {
  productName?: string;
  image?: string;
}

export interface POSRetailI {
  _id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  __v: number;
  statusId: number;
  allowedVendorCodes?: (string)[] | null;
  allowedCountries?: (string)[] | null;
  role?: (string)[] | null;
}
export interface SendSMSI{
  priority : number,
  provider : string,
  type : string,
  subject : string,
  isShortenUrl:boolean,
  vendorCode : string,
  functionalType : string,
  message : string,
  sendTime : Date,
  recipient : string
}
export interface memberWishlistI{
  default: boolean,
  identifier: string,
  type: string,
  value:string,
  title:string
}
export interface memberWishlistListingI{
  country: string,
  createdAt: string,
  default: boolean,
  hash: string,
  id: string,
  identifier: string,
  languages: string[];
  message: string,
  meta: {}
  properties: {
    filter: string[]
  }
  statusId: number,
  title: string,
  type: string,
  updatedAt: string,
  value:string[],
  vendorCode: string,
}
export const PRODUCT_LIST = [
  {
    name: 'Product Name',
    key: 'cms[0].content.name',
    subKey: 'assets[0].imageUrl[200x200]'
  },
  { name: 'SKU', key: 'sku' }
];
export interface MemberMetaI {
  meta: MetaI
}

export interface GamificationCountDataI{
  count:number;
  usedCount:number;
  rewards:any;

}

export interface GamificationRewardsListI{
  count:number;
  cta:string;
  eventName:string;
  image:string;
  subtitle:string;
  title:string
}
export interface WalletHistoryI {
  orders: {
    total: number;
    trendDiff: number;
    changeExists: boolean;
};
  earnings: {
    total: number;
    trendDiff: number;
    changeExists: boolean;
};
  cycles: Cycle[];
}
export interface Cycle {
    key: string;
    startDate: Date;
    endDate: Date;
}
export interface userIterest {
  id?: string;
  name: string;
}

export interface userIterestList {
  data:Array<userIterestTags>
}
export interface userIterestTags {
  tags?:Array<userIterest>
}



