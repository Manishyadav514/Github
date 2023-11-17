import {
  ReferralColumnI,
  WalletTransactionsColumnI,
  ListProductColumnI
} from '@/models/member.model';

export const MEMBER_TYPE_COLOR = {
  ambassador: '#8bc34a',
  retailer: '#2f86eb',
  influencer: '#ffc021',
  'beauty guide': '#eb3b8c'
};
export const MEMBER_LEVEL_COLOR = {
  gold: '#fde7a8',
  platinum: '#e4e2f1',
  silver: '#e4e2f1'
};
export const COMMUNICATION_PREFERENCE_STYLE = {
  true: 'e4e2f1'
};

export const REFERRAL_TYPE: ReferralColumnI[] = [
  {
    type: 'Silver',
    value: 'silver'
  },
  {
    type: 'Gold',
    value: 'gold'
  },
  {
    type: 'Platinum',
    value: 'platinum'
  }
];

export const WALLET_TRANSACTIONS: WalletTransactionsColumnI[] = [
  {
    key: 'Date',
    value: 'updatedAt'
  },
  {
    key: 'Points',
    value: 'currentBalance'
  },
  {
    key: 'Remarks',
    value: 'comments'
  }
];

export const COMMUNICATION_PREFERENCE = ['whatsApp', 'sms', 'email'];

export const TABS_ARRAY_OTHER = [
  // { name: 'Send SMS', key: 'sendSMS' },
  { name: 'My Rewards', key: 'gamificationDashboard' },
  { name: 'Addresses', key: 'address' },
  { name: 'Earnings', key: 'earnings' },
  { name: 'Orders', key: 'orders' },
  { name: 'Community', key: 'Community' },
  { name: 'Preferences', key: 'preferences' },
  // { name: 'UTM Source', key: 'utmSource' },
  // { name: 'Parties', key: 'parties' },
  { name: 'Referral Code', key: 'memberReferralCode' },
  { name: 'Scratch Cards', key: 'scratchWin' },
  { name: 'Meta', key: 'memberMeta' }
];

export const TABS_ARRAY_INFLUENCER = [
  // { name: 'Send SMS', key: 'sendSMS' },
  { name: 'My Rewards', key: 'gamificationDashboard' },
  { name: 'Addresses', key: 'address' },
  { name: 'Earnings', key: 'earnings' },
  { name: 'Cash Wallet', key: 'cash-wallet' },
  { name: 'Orders', key: 'orders' },
  { name: 'Community', key: 'Community' },
  { name: 'Preferences', key: 'preferences' },
  // { name: 'UTM Source', key: 'utmSource' },
  // { name: 'Parties', key: 'parties' },
  { name: 'Referral Code', key: 'memberReferralCode' },
  { name: 'Wishlist', key: 'wishlist' },
  { name: 'Scratch Cards', key: 'scratchWin' },
  { name: 'Meta', key: 'memberMeta' }
];

export const TABS_ARRAY_RETAIL = [
  { name: 'Inventory', key: 'inventory' },
  { name: 'Stock', key: 'stock' },
  { name: 'Orders', key: 'orders' },
  { name: 'Earnings', key: 'earnings' },
  { name: 'Earnings Summary', key: 'earningsSummary' },
  { name: 'Meta', key: 'memberMeta' },
  { name: 'Scratch Cards', key: 'scratchWin' }
];

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const EARNING_SUMMARY_COLUMN: ReferralColumnI[] = [
  {
    type: 'Direct Sales',
    value: 'personalSales'
  },
  {
    type: 'Online Sales',
    value: 'onlineSalesReward'
  },
  {
    type: 'Circle Sales',
    value: 'circleSales'
  },
  {
    type: 'Offline Sales',
    value: 'offlineSales'
  }
];

export const TABS_ARRAY_EARNING_SUMMARY = [
  { name: 'Members Onboarded', key: 'membersOnboarded' },
  { name: 'Referral Earnings', key: 'referralEarnings' }
];
export const SUB_TABS_ARRAY = [
  { name: 'Community Feed', key: 'CommunityFeed' },
  { name: 'Community Poll', key: 'CommunityPoll' },
  { name: 'Community Profile', key: 'CommunityProfile' },
];
export const MEMBERS_ONBOARDED_COLUMN: ReferralColumnI[] = [
  {
    type: 'Name',
    value: 'memberName'
  },
  {
    type: 'Contact',
    value: 'phoneNumber'
  },
  {
    type: 'Email Id',
    value: 'email'
  },
  {
    type: 'Registration Date',
    value: 'memberOnboardDate'
  }
];
export const REFERRAL_EARNINGS_COLUMN: ReferralColumnI[] = [
  {
    type: 'Name',
    value: 'memberName'
  },
  {
    type: 'Direct Sales',
    value: 'personalSales'
  },
  {
    type: 'Online Sales',
    value: 'onlineSales'
  },
  {
    type: 'Circle Sales',
    value: 'circleSales'
  },
  {
    type: 'Offline Sales',
    value: 'offlineSales'
  }
];
export const EARNING_SUMMARY_TYPE = ['signup', 'referral'];
export const STOCK_PRODUCT_LIST: ListProductColumnI[] = [
  {
    key: 'Product Name',
    value: 'title',
    subKey: 'imageUrl[200x200]'
  },
  { key: 'SKU', value: 'sku' },
  { key: 'Regular Product Stock', value: 'warehouse[0].stock' },
  { key: 'Free Product Stock', value: 'warehouse[0].freeProductStock' }
];
export const MEMBER_ADDRESS_TYPE = ['Home','Office','Others'];

export const GAMIFICATION_DASHBOARD_DATA = {
  0: {
    "status": 'Unavailable'
  },
  1: {
    "status": 'Eligible'
  },
  2:{
    "status": 'Claimed'
  },
  3:{
    "status": 'Redeemed'
  },
};