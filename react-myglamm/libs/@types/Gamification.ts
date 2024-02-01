export type PrizeListing = {
  count: number;
  cta: string;
  eventName: string;
  subtitle: string;
  status?: 1 | 2 | 3;
  rewardAmount: number;
};

export type UserStats = {
  count: number;
  usedCount: number;
  rewards: any;
};

export type GamificationConfig = {
  dumpKey: string;
  earnedText: string;
  earnBanner: string;
  howItWorks: string;
  floaterPNG?: string;
  installApp: boolean;
  claimedText: string;
  balanceText: string;
  blockerText1: string;
  blockerText2: string;
  bravoBgBanner: string;
  friendsClaimed: string;
  guestBannerText: string;
  trackHeaderText: string;
  friendsLeftBgImg: string;
  confirmationBgImg: string;
  prizeBackgroundImg: string;
  logginedBannerText: string;
  myRewardsBranchUrl: string;
  friendsNotYetClaimed: string;
  claimConfirmationText: string;
  rewardsBackgroundBanner: string;
  trackYourFriendsBranchUrl: string;
  AppInstallOnClaimReward: boolean;
  bountyRewardsBranchUrl: string;
  installAppBounty: boolean;
  rewardsBountyBackgroundBanner: string;
  rewardsBountyEarnBanner: string;
  bountyBannerText: string;
};

export type ReferralData = {
  onlyRegistered: number;
  purchased: number;
  totalRegistered: number;
  onlyRegisteredConsumers: RegisteredConsumer[];
};

export type RegisteredConsumer = {
  createdAt: string;
  firstName: string;
  lastName: string;
  id: string;
  phoneNumber: string;
};

export type FriendClaimed = {
  createdAt: string;
  firstName: string;
  lastName: string;
  discountAmount: number;
  discountCode: string;
};
