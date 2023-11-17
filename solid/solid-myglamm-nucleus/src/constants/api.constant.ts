// any global API config are defined here
export const API_CONFIG = {
  pageSize: 10
};

// All the API endpoints are defined here
export const API_ENDPOINT = {
  customerReview: {
    fetchAll: "/customer-reviews-ms/reviews",
    fetchCount: "/customer-reviews-ms/reviews/count"
  },
  customerParameters: {
    fetchAll: "/customer-reviews-ms/subRating",
    create: "/customer-reviews-ms/subRating",
    fetchById: "/customer-reviews-ms/subRating",
    update: "/customer-reviews-ms/subRating"
  },
  auth: {
    login: "/nucleus/login",
    googleLogin: "/nucleusGoogleLogin", //post
    fetchAllowedDomain: "/allowedGoogleDomains"
  },
  storeManagemnt: {
    fetchAll: "/store-locator-ms/stores",
    fetchById: `/store-locator-ms/stores`,
    fetchCount: "/store-locator-ms/stores/count",
    fetchOperationStatus: "/store-locator-ms/stores/operationStatus",
    create: "/store-locator-ms/stores",
    fetchStateAndCityByPincode: "/location-ms/pincode/details"
  },
  location: {
    country: {
      fetchAll: "/location-ms/countryLanguageDetails",
      fetchByNameOrId: "/location-ms/languagesBycountry",
      fetchCountry: "/location-ms/countries" //get
    },
    state: {
      fetchAll: "/location-ms/states"
    },
    city: {
      fetchAll: "/location-ms/cities"
    }
  },
  brand: {
    update: "/product-catalog-ms/brand",
    fetchAll: "/search-ms/indices/search/brand",
    fetchById: "/search-ms/indices/brand"
  },
  mailTemplate: {
    update: "/notification-ms/communicationTemplate",
    fetchAll: "/notification-ms/communicationTemplate",
    create: "/notification-ms/communicationTemplate",
    fetchById: "/notification-ms/communicationTemplate"
  },
  sticker: {
    fetchAll: "/product-catalog-ms/products/getAllStickerProducts",
    create: "/product-catalog-ms/newGenerateStickers",
    revert: "/product-catalog-ms/newRevertStickers",
    fetchById: "/product-catalog-ms/products/getStickerProductById"
  },
  imageUpload: {
    upload: "/image-ms-v2/services/upload",
    sticker: "/image-ms-v2/services/sticker"
  },
  videoUpload: {
    upload: "/image-ms-v2/services/upload/video"
  },
  taxes: {
    fetchCount: "/taxation-ms/taxes/count",
    fetchAll: "/taxation-ms/taxes",
    fetchById: "/taxation-ms/taxes",
    create: "/taxation-ms/taxes"
  },
  warehouse: {
    fetchAll: "/wms-ms/configs",
    fetchCount: "/wms-ms/configs/count",
    fetchById: "/wms-ms/configs", // configs/{id}
    create: "/wms-ms/configs",
    update: "/wms-ms/configs", //configs/{id} for PATCH and PUT
    products: {
      fetchById: "/wms-ms/products" // products/{id}
    },
    processing: {},
    inventory: {
      fetchAll: "/wms-ms/inventoryLogs", //get
      count: "/wms-ms/inventoryLogs/count", //get
      update: "/wms-ms/inventoryLogs", //put and patch //note: for updating remark and status "/wms-ms/inventoryLogs/{id}/ remark || status "
      create: "/wms-ms/inventoryLogs" // post
    },
    postCodeMapping: {
      fetchAll: "/wms-ms/warehousePostCodeMappingRequests", //get
      create: "/wms-ms/warehousePostCodeMappingRequests/upload", // post
      exportPinCodeUploadLogs: "/wms-ms/exportPostCodeMappingUploadLogs", //get
      export: "/wms-ms/exportPostCodeMapping"
    },
    fetchVendorCodeLists: "/vendorCodes" //get
  },
  category: {
    fetchAll: "/search-ms/indices/search/product-category",
    create: "/product-catalog-ms/productCategory",
    update: "/product-catalog-ms/productCategory",
    fetchById: "/search-ms/indices/product-category/",
    subCategoryCount: "/search-ms/indices/multiple-search",
    displayOrder: "/product-catalog-ms/categories/displayOrder"
  },
  tag: {
    fetchCount: "/tag-manager-ms/tag-masters/count",
    fetchAll: "/tag-manager-ms/tag-masters",
    fetchById: "/tag-manager-ms/tag-masters", // /tag-manager-ms/tag-masters/{id}
    create: "/tag-manager-ms/tag-masters", // put
    update: "/tag-manager-ms/tag-masters" // put
  },
  product: {
    create: "/product-catalog-ms/product",
    update: "/product-catalog-ms/product",
    fetchAll: "/search-ms/indices/search/products",
    fetchById: "/search-ms/indices/products", // Note: eg. /search-ms/indices/products/{id}
    fetchProductTag: "/product-catalog-ms/productTag",
    displayOrder: "/product-catalog-ms/products/displayOrder",
    export: "/search-ms/product/exports",
    productPriceUpload: "/product-catalog-ms/productBulkPrice/upload",
    concernsAndIngredientsUpload: "/product-catalog-ms/productBulkConcernIngredientsUpdate",
    productBulkPriceUploads: "/product-catalog-ms/productBulkPriceUploads",
    concernsAndIngredientsList: "/product-catalog-ms/productBulkConcernIngredients",
    exportPriceUploadLogs: "/product-catalog-ms/exportPriceUploadLogs",
    productBulRatingUploads: "/product-catalog-ms/productBulkRatings/upload",
    fetchAllProductRsting: "/product-catalog-ms/product-bulk-uploads",
    exportRatingUploadLogs: "/product-catalog-ms/exportRatingUploadLogs",
    searchByproductTags: "/search-ms/search/products"
  },
  bundledProduct: {
    create: "/product-catalog-ms/bundledProduct",
    update: "/product-catalog-ms/bundledProduct",
    fetchAll: "/search-ms/indices/search/products",
    fetchById: "/search-ms/indices/products" // Note: eg. /search-ms/indices/products/{id}
  },
  assets: {
    fetchVideoDetails: "/asset-manager-ms/youTubeVideoDetails/" // Note: eg- /asset-manager/youTubeVideoDetails/{youtubeUrl}
  },
  widget: {
    group: {
      create: "/widgets-ms/widgetGroups", // POST
      update: "/widgets-ms/widgetGroups", // PATCH eg:- /widgets/widgetGroups/{id}
      fetchAll: "/search-ms/indices/search/widgets",
      fetchById: "/search-ms/indices/widgets", // eg:- /search-ms/indices/widgets/{id}
      fetchWidgetGroupWithItemsByIdOrSlug: "/search-ms/widgetGroupByID" // NOTE: it returns widget group along with item list(products/categories, etc) for each widget
    },
    create: "/widgets-ms/widgetGroups/widgets",
    update: "/widgets-ms/widgetGroups/widget",
    fetchAll: "/widgets-ms/widgetGroups",
    fetchById: "/widgets-ms/widgetGroups",
    uploadCsv: "/product-catalog-ms/productValidate/upload",
    downloadRunLog: "/product-catalog-ms/exportUploadRunLogs", // get - used to get runlogs csv
    postionUpdate: "/widgets-ms/widget/reorder", // PATCH - to update a widget position on drag
    cloneWidgetGroup: {
      create: "/widgets-ms/widgetGroups/clone"
    },
    cloneWidget: {
      create: "/widgets-ms/widgets/clone"
    }
  },
  cronJob: {
    fetchAll: "/cron-service-ms/cronjobs",
    fetchById: "/cron-service-ms/cronjob", //cronjob/{id}
    fetchCount: "/cron-service-ms/cronjobs/count",
    update: "/cron-service-ms/cronEdit", //cronEdit/{id}
    deleteHard: "/cron-service-ms/cronDelete", //cronDelete/{id}
    create: "/cron-service-ms/cronPost",
    updateStatus: "/cron-service-ms/cronStatus", //cronStatus/{id}
    export: "/cron-service-ms/exportLog" //exportLog/{id}
  },

  discounts: {
    // Create Discount
    create: "/discount-ms/discount", // put
    // updates discount
    update: "/discount-ms/discount", // put
    // get count for particular discount coupon
    count: "/discount-ms/discountUsage", // get
    // get rules config for coupon code generation
    fetchConfig: "/discount-ms/operatorFieldsRelation", //get
    // fetches discount as per filter
    fetchAll: "/search-ms/discounts", //post
    fetchAllBulkDiscount: "/discount-ms/bulkDiscount", //get
    downloadCouponCsv: "/discount-v2-ms/v1/bulkDiscounts/exportBatchCSV", //get
    createBulkCoupon: "/discount-v2-ms/v1/bulkDiscounts/bulkCreateDiscounts", //put
    fetchById: "/search-ms/indices/discount", // get
    uploadCsv: "/product-catalog-ms/productValidate/upload", //post
    downloadRunLog: "/product-catalog-ms/exportUploadRunLogs", // get - used to get runlogs csv
    createSubscription: "/cart-manager-ms/config/subscriptions",
    updateSubscription: "/cart-manager-ms/config/subscriptions",
    listSubscription: "/cart-manager-ms/config/subscriptions",
    updateCount: "/discount-v2-ms/v1/bulkDiscounts/updateCount"
  },
  look: {
    fetchAll: "/search-ms/indices/search/lookbook",
    looksInCategory: "/search-ms/indices/multiple-search",
    create: "/lookbook-ms/lookbookWrapper", //put
    update: "/lookbook-ms/lookbookWrapper", //put
    fetchById: "/search-ms/indices/lookbook" //get lookbook/{id}
  },
  productOrCartDiscount: {
    fetchCount: "",
    fetchAll: "/search-ms/indices/search/discount",
    fetchById: "/search-ms/indices/discount/", // Note: eg. /service/discount/products/{id}
    create: "/discount-ms/discount",
    update: "/discount-ms/discount",
    // fetchAllBulkDiscount
    productDiscountUpload: "/discount-ms/bulkpwps", //post
    fetchLogListing: "/discount-ms/bulkpwps", //get
    productEntryLogDownload: "/discount-ms/bulkpwpentrylog", //get
    productSystemLevelDiscountDownload: "/discount-ms/discount/download/productDiscount", //get
    productDiscount: "/search-ms/discount/product"
  },
  pageCategory: {
    create: "/pages-ms/categoryWrapper",
    update: "/pages-ms/categoryWrapper",
    fetchAll: "/search-ms/indices/search/pagescategory",
    fetchById: "/search-ms/indices/pagescategory/" // Note: eg. /search-ms/indices/pagescategory/{id}
  },
  lookCategory: {
    fetchAll: "/search-ms/indices/search/lookbook-category", // post
    fetchById: "/search-ms/indices/lookbook-category", // post
    create: "/lookbook-ms/lookbookCategoryWrapper", // put
    update: "/lookbook-ms/lookbookCategoryWrapper", // put
    subCategoryCount: "/search-ms/indices/multiple-search"
  },
  // Note: eg. /search-ms/indices/pagescategory/{id}
  collection: {
    getConfig: "/collection-ms/config ", //get
    create: "/collection-ms/collectionWrapper", //put
    fetchAll: "/search-ms/indices/search/collection",
    fetchById: "/search-ms/indices/collection/",
    uploadCsv: "/product-catalog-ms/productValidate/upload",
    downloadRunLog: "/product-catalog-ms/exportUploadRunLogs" // get - used to get runlogs csv
  },
  page: {
    create: "/pages-ms/pageWrapper",
    update: "/pages-ms/pageWrapper",
    fetchAll: "/search-ms/indices/search/pages",
    fetchById: "/search-ms/indices/pages/" // Note: eg. /search-ms/indices/pages/{id}
  },
  linkBuilder: {
    create: "/url-shortener-ms/shorten",
    update: "/url-shortener-ms/shorten",
    fetchAll: "/url-shortener-ms/shorten",
    fetchById: "/url-shortener-ms/shorten"
  }, // Note: eg. /url-shortener-ms/shorten/{id}
  member: {
    fetchAll: "/members-ms/v2/members/list",
    fetchCount: "/members-ms/members/count",
    fetchMemberCount: "/members-ms/v2/members/count",
    fetchGlamPoints: "/wallet-ms/wallet",
    fetchSalesManager: "/nucleusUsers",
    fetchTypeLevel: "/members-ms/type-levels",
    fetchById: "/members-ms/members",
    create: "/members-ms/members",
    fetchGlammReferralCount: "/members-ms/membersGlammCirclesCount/",
    fetchGlammCircleMembers: "/members-ms/membersGlammCircles/",
    fetchAddresses: "/members-ms/membersAddresses",
    fetchQuestionnaire: "/customer-profile-ms/questionnaire",
    fetchQuestionnaireAnswer: "/customer-profile-ms/questionnaireAnswer",
    fetchEarningSummary: "/members-ms/membersRetailerDashboard/",
    fetchAllSalesCommission: "/members-ms/sales-commission-logs",
    fetchStock: "/wms-ms/products​/warehouse​/",
    fetchStateAndCityByPincode: "/location-ms/pincode/details",
    saveAndEditAddress: "/members-ms/membersAddresses",
    fetchPosMember: "/nucleusUsers",
    bulkUpload: "/members-ms/members/bulk-upload",
    bulkUploadDownloadUrl: "/members-ms/bulk-upload-log/",
    fetchReferralCode: "/members-ms/members",
    getMetaSkipObject: "/members-ms/members/getMetaSkipObjects",
    update: "/members-ms/members",
    updateCommunicationPreference: "/members-ms/updateCommunicationsData",
    isCodEnabled: "/members-ms/member/",
    fetchFscore: "/fraud-v2-ms/getMembersFscore",
    fetchGamificationFriendsList: "/order-ms/contests/dashboard/members/", //get
    fetchGamificationData: "/dump-ms/dump", //get
    fetchGamificationRewardsList: "/order-ms/contests/", //get
    fetchGamificationOrderIdList: "/discount-ms/discountlogs", //get
    fetchCashWalletList: "/payout-ms/v1/payout", //Get
    fetchCashWalletEarningList: "/affiliate-ms/cashWalletTransaction/cashEarningHistory/",
    fetchMemberOrderHistory: "/members-ms/affiliate/orderHistory/",
    fetchMemberWalletDetails: "/affiliate-ms/trend/",
    fetchMemberOrderHistoryOrderCount: "/order-v2-ms/order/count/orderStatus",
    fetchAllMemberSegments: "/dump-ms/memberSegments",
    fetchAllScratchCardList: "/quiz-ms/members",
    fetchUserInterest: "/search-ms/community/user",
    updateUserInterest: "/community-post-ms/v1/users/updateUser"
  },
  navigation: {
    // fetchAll: '/navigation-ms/navigations', // get
    fetchAll: "/navigation-ms/navigations/listings",
    count: "/navigation-ms/navigations/count", // get
    create: "/navigation-ms/navigations", // post
    update: "/navigation-ms/navigations", // patch /{id}
    fetchById: "/navigation-ms/navigations", // get/{id}
    fetchDetailsByUrl: "/search-ms/indices/multiple-search" // to search entire data and get required object
  },
  order: {
    fetchAll: "/order-ms/v2/orders/listing",
    count: "/order-ms/v2/orders/count",
    ordersCount: "/order-ms/v2/orders/count",
    create: "/order-ms/order",
    update: "/order-ms/order", // Note: eg. /order-ms/order/{id}
    updateStatus: "/order-ms/order", // Note: eg. /order-ms/order/{orderId}/updateStatus/{updateStatusId}
    fetchById: "/order-ms/order", // Note: eg. /order-ms/order/{id}
    fetchInvoiceById: "/order-ms/getOrderInvoice", // Note: eg. /order-ms/getOrderInvoice/{id}
    trackOrder: "/order-ms/orders-trackings",
    addToCart: "/cart-manager-ms/add",
    getCartByIdentifier: "/cart-manager-ms/user", // Note: /cart-manager-ms/user/{identifier}
    checkout: "/cart-manager-ms/checkout",
    commission: "/members-ms/order", // note: /members-ms/order/{orderId}/commission
    exportOrder: "/order-ms/order/export", // order export by order wise
    exportProductWise: "/order-ms/order/exportProductWise", // export order by product wise
    rePush: "/order-ms/order/",
    reFund: "/order-ms/refundNucleus",
    replace: "/order-ms/order/replace",
    opratorList: "/cart-manager-ms/abandonedCart/list",
    opratorCall: "/cart-manager-ms/abandonedCart/myOperator/call/",
    opratorCallRetry: "/cart-manager-ms/abandonedCart/myOperator/callRetry/",
    opratorCount: "/cart-manager-ms/abandonedCart/count",
    orderCommentUpload: "/order-ms/ordersBulkComments/upload",
    orderCommentListing: "/order-ms/ordersBulkComments/list",
    orderExportComment: "/order-ms/exportBulkCommentUploadLogs"
  },
  otpVerification: {
    sendMFAOTP: "v4/sendMFAOTP",
    verifyMFAOTP: "v4/verifyMFAOTP"
  },
  party: {
    create: "/bit-sized-ms/parties-wrapper",
    fetchAll: "/search-ms/indices/search/parties"
  },
  notification: {
    send: "/notification-ms/notificationLog"
  },
  csvUpload: {
    upload: "/image-ms-v2/services/upload"
  },
  s3FileUpload: {
    upload: "/s3-upload-ms/AWS/upload/original"
  },
  aclEndpoint: {
    fetchAll: "/endpoints", // get
    count: "/endpoints/count", // get
    create: "/identity/endpoints", // post
    update: "/identity/endpoints", // patch
    fetchById: "/identity/endpoints", // get 'endpoint/{id}'
    deleteById: "/identity/endpoints", // delete 'endpoint/{id}',
    bulkEndPointMapping: "/bulkEndpointMapping" //put
  },
  aclUsers: {
    fetchAll: "/nucleusUsers", //get
    fetchCount: "/nucleusUsers/count", //get
    create: "/nucleusUsers", // post
    update: "/nucleusUsers/", //patch
    fetchById: "/nucleusUsers", //get,
    fetchVendorCode: "/vendorCodes", //get
    fetchRoles: "/identity/roles" //get
  },
  aclRole: {
    fetchAll: "/roles", // get
    count: "/roles/count", // get
    create: "/identity/roles", // post
    update: "/identity/roles", // patch
    fetchById: "/identity/roles", // get 'roles/{id}'
    deleteById: "/identity/roles", // delete 'roles/{id}'
    fetchEndpointForRole: "/identity/roles/", //get
    prefix: "/rolePrefix"
  },
  qrCode: {
    create: "/qr-code-ms/qr/batch/create", // post
    update: "/qr-code-ms/updateQRCodeBatch", // patch
    fetchAll: "/qr-code-ms/qr/batches", // get
    fetchById: "/qr-code-ms/qr/qr-single", // get
    search: "/qr-code-ms/searchBatch" //get
  },

  offers: {
    create: "/offer-ms/offers", // put
    update: "/offer-ms/offers", // put
    fetchAll: "/search-ms/indices/search/offers", // post,
    fetchById: "/search-ms/indices/offers",
    displayOrder: "/offer-ms/offer/sortOrder"
  },
  offersCategories: {
    create: "/offer-ms/category", // put
    update: "/offer-ms/category", // put
    fetchAll: "/search-ms/indices/search/offer-category", // post,
    fetchById: "/search-ms/indices/offer-category"
  },
  partyTheme: {
    create: "/parties-ms/theme-wrapper", // put
    update: "/parties-ms/theme-wrapper", // put
    fetchAll: "/search-ms/indices/search/party-theme", // get
    fetchById: "/search-ms/indices/party-theme/" // get
  },
  bytes: {
    create: "/bit-sized-ms/bitesize", // put
    update: "/bit-sized-ms/bitesize", // put
    fetchAll: "/search-ms/indices/search/bitesize", // POST
    fetchById: "/search-ms/indices/bitesize/", // get
    fetchTags: "/bit-sized-ms/bitesizeImage/tag" //get
  },
  moderatePage: {
    create: "/pages-ms/pageWrapper",
    update: "/pages-ms/pageWrapper",
    bulkUpdate: "/pages-ms/bulkUpdate",
    fetchAll: "/search-ms/indices/search/pages",
    fetchById: "/search-ms/indices/pages/" // Note: eg. /search-ms/indices/pages/{id}
  },
  purge: {
    create: "/cache-ms/cache/purge", //Post
    fetchAll: "/cache-ms/purge-logs", //Get
    fetchCount: "/cache-ms/purge-logs/count" //Get
  },
  wishlist: {
    create: "/wishlist-ms/wishlist", //Put
    fetchAll: "/search-ms/indices/search/wishlists", //Get
    delete: "/wishlist-ms/wishlist", //delete
    update: "/wishlist-ms/wishlist" // put
  },
  moderatePolls: {
    update: "/poll-ms/pollWrapper", //Put
    fetchAll: "/search-ms/polls", //Get
    create: "/poll-ms/pollWrapper", //Post
    fetchById: "/poll-ms/poll"
  },
  glammPoints: {
    update: "/poll-ms/pollWrapper", //Put
    fetchAll: "/wallet-ms/wallet/bulk", //Get
    bulkUpload: "/wallet-ms/wallet/bulk", //Post
    bulkGlammPointsUploadDownloadUrl: "/wallet-ms/wallet/bulk/" //Get
  },
  moderateQuestions: {
    update: "/post-ms/postAdmin", //Put
    fetchAll: "/search-ms/productPost", //Get
    updateAnswer: "/post-ms/productAnswer" //Post
  },
  moderatePosts: {
    update: "/post-ms/postAdmin", //Put
    fetchAll: "/search-ms/posts" //Get
  },
  gamification: {
    update: "/order-ms/contests", //Put
    fetchAll: "/order-ms/contests/list", //Get
    fetchById: "/order-ms/contests" // Note: eg. /order-ms/contests/{{contestId}}
  },
  retailInventory: {
    inventory: {
      fetchAll: "/wms-ms/inventoryLogs", //get
      count: "/wms-ms/inventoryLogs/count", //get
      update: "/wms-ms/inventoryLogs", //put and patch //note: for updating remark and status "/wms-ms/inventoryLogs/{id}/ remark || status "
      create: "/wms-ms/inventoryLogs" // post
    }
  },
  logger: {
    fetchAll: "/worker-ms/loggerListing", //Get
    fetchById: "/worker-ms/loggerListing/distinctFields", // Note: eg. /order-ms/contests/{{contestId}}
    fetchAllModules: "/worker-ms/loggerListing/modules"
  },
  anyMeThingAsk: {
    update: "/worker-ms/askMeHow/questions",
    getToken: "/worker-ms/customToken"
  },
  faqQuestion: {
    fetchAll: "/knowledgebase-ms/questions", //Get
    fetchAllBaseOnId: "/knowledgebase-ms/questions/getQuestions", //Get
    fetchById: "/knowledgebase-ms/questions",
    create: "/knowledgebase-ms/questions", //post
    update: "/knowledgebase-ms/questions" //post
  },
  faqCategory: {
    fetchAll: "/knowledgebase-ms/category", //Get
    fetchById: "/knowledgebase-ms/category",
    create: "/knowledgebase-ms/category", //post
    update: "/knowledgebase-ms/category" //post
  },
  urlRedirection: {
    create: "/url-manager-ms/urlLogs", // post
    update: "/url-manager-ms/urlLogs", // patch
    fetchAll: "/url-manager-ms/urlRedirect", // get
    fetchById: "/url-manager-ms/urlRedirect", // get
    search: "/url-manager-ms/urlRedirect", //get
    delete: "/url-manager-ms/urls", // patch
    slugSearch: "/url-manager-ms/slug-search?" // patch
  },
  earnItems: {
    fetchAll: "/share-and-earn-ms/config/earn", // get
    fetchById: "/share-and-earn-ms/config/update", // post
    update: "/share-and-earn-ms/config/update", // post
    fetchAllVendorCode: "/search-ms/indices/search/burnvendorconfig", // post
    fetchBurnCoupon: "/search-ms/indices/search/burncouponconfig",
    earnItemBulkUpload: "/share-and-earn-ms/multiplexer/glampoints"
  },
  earnbybrands: {
    fetchAll: "/share-and-earn-ms/config/earn", // get
    fetchById: "/share-and-earn-ms/config/update", // post
    update: "/share-and-earn-ms/config/update", // post
    fetchAllVendorCode: "/search-ms/indices/search/burnvendorconfig", // post
    fetchBurnCoupon: "/search-ms/indices/search/burncouponconfig"
  },
  rewardsMaster: {
    fetchAll: "/search-ms/indices/search/burncouponconfig", //Get
    getBYId: "/search-ms/indices/burncouponconfig", //Get
    update: "/crud-ms/operation/burncouponconfig", //PUT
    fetchAllVendorCode: "/search-ms/indices/search/burnvendorconfig", //Get
    displayOrder: "/crud-ms/operation/burncouponconfig/displayOrder/master", //PATCH
    fetchMysteryRewards: "/quiz-ms/createMySteryQuizConfig", //get
    fetchJackpotRewardConfig: "/quiz-ms/createJackpotQuizConfig" //get
  },
  popularRewards: {
    fetchAll: "/search-ms/indices/search/burncouponconfig", //Get
    getBYId: "/search-ms/indices/burncouponconfig", //Get
    update: "/crud-ms/operation/burncouponconfig", //PUT
    fetchAllVendorCode: "/search-ms/indices/search/burnvendorconfig", //Get
    displayOrder: "/crud-ms/operation/burncouponconfig/displayOrder/popular" //PATCH
  },
  rewardsByBrands: {
    fetchAll: "/search-ms/indices/search/burncouponconfig", //Get
    getBYId: "/search-ms/indices/burncouponconfig", //Get
    update: "/crud-ms/operation/burncouponconfig", //PUT
    fetchAllVendorCode: "/search-ms/indices/search/burnvendorconfig", //Get
    displayOrder: "/crud-ms/operation/burncouponconfig/displayOrder/brands" //PATCH
  },
  shippingCharges: {
    fetchAll: "/tms-ms/api/shippings", //Get
    getBYId: "/tms-ms/api/shippings", //Get
    create: "/tms-v2-ms/shippings", //POST
    update: "/tms-v2-ms/shippings", //PUT
    fetchALlfreeShippingNode: "/tms-v2-ms/goodPointsTierShippingMasterConfig", //Get
    updateFreeShippingNode: "/tms-v2-ms/goodPointsTierShippingConfig" //PUT
  },
  rewardRedemption: {
    fetchAll: "/search-ms/memberRewards",
    count: "/search-ms/memberRewardsCount",
    update: "/crud-ms/operation/memberburnconfig/miscellaneous/updateRewardStatus",
    export: "/search-ms/memberRewards/downloadCSV",
    upload: {
      create: "/crud-ms/operation/bulkRewardUpload",
      fetchAll: "/crud-ms/operation/bulkRewardUpload",
      export: "/crud-ms/operation/bulkRewardUpload/exportData"
    }
  },
  community: {
    feed: {
      fetchAll: "/search-ms/community/post", //Get
      getBYId: "/community-feed-ms/v1/feed/detail", //Get
      create: "/community-post-ms/v1/posts",
      update: "/community-post-ms/v1/posts/updatePost/", //Patch
      users: "/search-ms/community/user",
      createUser: "/community-post-ms/v1/users",
      comment: "/search-ms/community/comments",
      commentReply: "/community-user-actions-ms/v1/comments",
      delComment: "/community-user-actions-ms/v1/comments/"
    },
    topics: {
      fetchAll: "/search-ms/community/topics",
      update: "/community-post-ms/v1/topic/updateTopic", // patch /{id}
      create: "/community-post-ms/v1/topic",
      fetchVendorCodeLists: "/vendorCodes" //get
    },
    tag: "/search-ms/community/tag",
    moderation: {
      fetchAll: "/search-ms/community/report",
      delete: "/community-post-ms/v1/posts/updatePost", // :id (statusId:2) Patch
      ignore: "/community-user-actions-ms/v1/report" // Put
    },
    contest: {
      fetchAll: "/search-ms/contest",
      createAndUpdate: "/crud-ms/operation/bbcContest"
    },
    contestEntry: {
      fetchAll: "/search-ms/contest-entry",
      createAndUpdate: "/crud-ms/operation/bbcContestEntries"
    }
  },
  skinAnalyser: {
    fetchAll: "/search-ms/skin/problems",
    crud: "/crud-ms/operation/skinAnalyser" // create, update, delete
    // update: '/crud-ms/operation/skinAnalyser',
    // delete: '/crud-ms/operation/skinAnalyser',
  },
  syncProduct: {
    fetchAll: "/product-catalog-ms/globalConfig",
    create: "/product-catalog-ms/globalConfig",
    update: "/product-catalog-ms/globalConfig"
  },
  AclMicroservice: {
    fetch: "/microservices",
    crud: "/microservices"
  },
  discountUpsell: {
    fetch: "/upsell-personalization-ms/couponUpsellRules",
    create: "/upsell-personalization-ms/couponUpsellRules",
    update: "/upsell-personalization-ms/couponUpsellRules",
    getBYId: "/upsell-personalization-ms/couponUpsellRule",
    delete: "/upsell-personalization-ms/couponUpsellRules"
  }
};

// Status Enum for all modules
export enum StatusEnum {
  INACTIVE,
  ACTIVE,
  DELETED,
  DRAFT,
  HIDDEN,
  MODERATE,
  SCHEDULE
}

// Status Enum for purge modules
export enum PurgeStatusEnum {
  Incompleted,
  Completed
}

// Product Type Enum for all modules
export enum ProductTypeEnum {
  SINGLE = 1,
  BUNDLE
}

// Product Type Enum for all modules
export enum BulkUploadState {
  STEADY = 1,
  START,
  SUCCESS,
  PARTIAL,
  FAILURE,
  OVERLOADED
}

//sticker ur;
export const STICKER_URL460 =
  "https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-beta/original/Myglamm-Quickies--logo-1080-x-1920-card.png";
export const STICKER_URL255 = "https://files.myglamm.com/site-images/original/Myglamm-Quickies--logo-255-x-1920-card-copy.png";
export const vendorDomainUrlMap = [
  //Myglamm
  {
    key: "MyGlamm",
    vendorCode: "mgp",
    vendorName: "MyGlamm",
    domain: "http://localhost:4200",
    env: "dev",
    slugBaseUrl: "https://alpha-mr.myglamm.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://alpha-mr.myglamm.net/lbmiddleware",
      desktop: "https://alpha-mr.myglamm.net/lbmiddleware",
      ios: "https://alpha-mr.myglamm.net/lbmiddleware"
    }
  },
  {
    key: "MyGlamm",
    vendorCode: "mgp",
    vendorName: "MyGlamm",
    domain: "https://nucleus-alpha.myglamm.net",
    env: "alpha",
    slugBaseUrl: "https://alpha-mr.myglamm.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://alpha-mr.myglamm.net/lbmiddleware",
      desktop: "https://alpha-mr.myglamm.net/lbmiddleware",
      ios: "https://alpha-mr.myglamm.net/lbmiddleware"
    }
  },
  {
    key: "MyGlamm", //Preprod
    vendorCode: "mgp",
    vendorName: "MyGlamm",
    domain: "https://pp.nucleus.myglamm.net",
    env: "preprod",
    slugBaseUrl: "https://pp.myglamm.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://pp.myglamm.net/lbmiddleware",
      desktop: "https://pp.myglamm.net/lbmiddleware",
      ios: "https://pp.myglamm.net/lbmiddleware"
    }
  },
  {
    key: "MyGlamm",
    vendorCode: "mgp",
    vendorName: "MyGlamm",
    domain: "https://nucleus.myglamm.com",
    env: "prod",
    slugBaseUrl: "https://www.myglamm.com",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://m.myglamm.com/lbmiddleware",
      desktop: "https://www.myglamm.com/lbmiddleware",
      ios: "https://m.myglamm.com/lbmiddleware"
    }
  },
  //BabyChakra
  {
    key: "BabyChakra",
    vendorCode: "bbc",
    vendorName: "BabyChakra",
    domain: "https://manage-staging.babychakra.net",
    env: "dev",
    slugBaseUrl: "https://bbc.alpha.babychakra.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.babychakra.net/lbmiddleware",
      desktop: "https://shop.staging.babychakra.net/lbmiddleware",
      ios: "https://shop.staging.babychakra.net/lbmiddleware"
    }
  },
  {
    key: "BabyChakra",
    vendorCode: "bbc",
    vendorName: "BabyChakra",
    domain: "https://manage-staging.babychakra.net",
    env: "alpha",
    slugBaseUrl: "https://shop.staging.babychakra.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.babychakra.net/lbmiddleware",
      desktop: "https://shop.staging.babychakra.net/lbmiddleware",
      ios: "https://shop.staging.babychakra.net/lbmiddleware"
    }
  },
  {
    key: "BabyChakra",
    vendorCode: "bbc",
    vendorName: "BabyChakra",
    domain: "https://pp.manage.babychakra.net",
    env: "preprod",
    slugBaseUrl: "https://pp.babychakra.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://pp.babychakra.net/lbmiddleware",
      desktop: "https://pp.babychakra.net/lbmiddleware",
      ios: "https://pp.babychakra.net/lbmiddleware"
    }
  },
  {
    key: "BabyChakra",
    vendorCode: "bbc",
    vendorName: "BabyChakra",
    domain: "https://manage.babychakra.com",
    env: "prod",
    slugBaseUrl: "https://shop.babychakra.com",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.babychakra.com/lbmiddleware",
      desktop: "https://shop.babychakra.com/lbmiddleware",
      ios: "https://shop.babychakra.com/lbmiddleware"
    }
  },
  //StBotanic
  {
    key: "StBotanic",
    vendorCode: "stb",
    vendorName: "StBotanica",
    domain: "http://localhost:4500",
    env: "dev",
    slugBaseUrl: "https://stb.alpha.myglamm.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.stbotanica.net/lbmiddleware",
      desktop: "https://shop.staging.stbotanica.net/lbmiddleware",
      ios: "https://shop.staging.stbotanica.net/lbmiddleware"
    }
  },
  {
    key: "StBotanic",
    vendorCode: "stb",
    vendorName: "StBotanica",
    domain: "https://manage-staging.stbotanica.net",
    env: "alpha",
    slugBaseUrl: "https://shop.staging.stbotanica.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.stbotanica.net/lbmiddleware",
      desktop: "https://shop.staging.stbotanica.net/lbmiddleware",
      ios: "https://shop.staging.stbotanica.net/lbmiddleware"
    }
  },
  {
    key: "StBotanic", //Preprod
    vendorCode: "stb",
    vendorName: "StBotanica",
    domain: "https://pp.manage.stbotanica.net",
    env: "preprod",
    slugBaseUrl: "https://pp.stbotanica.net/",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://pp.stbotanica.net/lbmiddleware",
      desktop: "https://pp.stbotanica.net/lbmiddleware",
      ios: "https://pp.stbotanica.net/lbmiddleware"
    }
  },
  {
    key: "StBotanic",
    vendorCode: "stb",
    vendorName: "StBotanica",
    domain: "https://manage.stbotanica.com",
    env: "prod",
    slugBaseUrl: "https://www.stbotanica.com",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://www.stbotanica.com/lbmiddleware",
      desktop: "https://www.stbotanica.com/lbmiddleware",
      ios: "https://www.stbotanica.com/lbmiddleware"
    }
  },
  //TheMomsCo
  {
    key: "TheMomsCo",
    vendorCode: "tmc",
    vendorName: "theMomsCo",
    domain: "http://localhost:3200",
    env: "dev",
    slugBaseUrl: "https://shop.staging.themomsco.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.themomsco.net/lbmiddleware",
      desktop: "https://shop.staging.themomsco.net/lbmiddleware",
      ios: "https://shop.staging.themomsco.net/lbmiddleware"
    }
  },
  {
    key: "TheMomsCo",
    vendorCode: "tmc",
    vendorName: "theMomsCo",
    domain: "https://manage-staging.themomsco.net",
    env: "alpha",
    slugBaseUrl: "https://shop.staging.themomsco.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.themomsco.net/lbmiddleware",
      desktop: "https://shop.staging.themomsco.net/lbmiddleware",
      ios: "https://shop.staging.themomsco.net/lbmiddleware"
    }
  },
  {
    key: "TheMomsCo", //Preprod
    vendorCode: "tmc",
    vendorName: "theMomsCo",
    domain: "https://pp.manage.themomsco.net",
    env: "preprod",
    slugBaseUrl: "https://pp.themomsco.net/",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://pp.themomsco.net/lbmiddleware",
      desktop: "https://pp.themomsco.net/lbmiddleware",
      ios: "https://pp.themomsco.net/lbmiddleware"
    }
  },
  {
    key: "TheMomsCo",
    vendorCode: "tmc",
    vendorName: "theMomsCo",
    domain: "https://manage.themomsco.com",
    env: "prod",
    slugBaseUrl: "https://www.themomsco.com",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://www.themomsco.com/lbmiddleware",
      desktop: "https://www.themomsco.com/lbmiddleware",
      ios: "https://www.themomsco.com/lbmiddleware"
    }
  },
  //OrganicHarvest
  {
    key: "OrganicHarvest",
    vendorCode: "orh",
    vendorName: "OrganicHarvest",
    domain: "http://localhost:4000",
    env: "dev",
    slugBaseUrl: "https://shop.staging.organicharvest.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.organicharvest.net/lbmiddleware",
      desktop: "https://shop.staging.organicharvest.net/lbmiddleware",
      ios: "https://shop.staging.organicharvest.net/lbmiddleware"
    }
  },
  {
    key: "OrganicHarvest",
    vendorCode: "orh",
    vendorName: "OrganicHarvest",
    domain: "https://manage-staging.organicsharvest.net",
    env: "alpha",
    slugBaseUrl: "https://shop.staging.organicsharvest.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.organicsharvest.net/lbmiddleware",
      desktop: "https://shop.staging.organicsharvest.net/lbmiddleware",
      ios: "https://shop.staging.organicsharvest.net/lbmiddleware"
    }
  },
  {
    key: "OrganicHarvest", //Preprod
    vendorCode: "orh",
    vendorName: "OrganicHarvest",
    domain: "https://pp.manage.organicsharvest.net/",
    env: "preprod",
    slugBaseUrl: "https://pp.organicsharvest.net/",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://pp.organicsharvest.net/lbmiddleware",
      desktop: "https://pp.organicsharvest.net/lbmiddleware",
      ios: "https://pp.organicsharvest.net/lbmiddleware"
    }
  },
  {
    key: "OrganicHarvest",
    vendorCode: "orh",
    vendorName: "OrganicHarvest",
    domain: "https://manage.organicharvest.in",
    env: "prod",
    slugBaseUrl: "https://www.organicharvest.in",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://www.organicharvest.in/lbmiddleware",
      desktop: "https://www.organicharvest.in/lbmiddleware",
      ios: "https://www.organicharvest.in/lbmiddleware"
    }
  },
  //Sirona
  {
    key: "Sirona",
    vendorCode: "srn",
    vendorName: "Sirona",
    domain: "http://localhost:4100",
    env: "dev",
    slugBaseUrl: "https://shop.staging.thesirona.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.thesirona.net/lbmiddleware",
      desktop: "https://shop.staging.thesirona.net/lbmiddleware",
      ios: "https://shop.staging.thesirona.net/lbmiddleware"
    }
  },
  {
    key: "Sirona",
    vendorCode: "srn",
    vendorName: "Sirona",
    domain: "https://manage-staging.thesirona.net/",
    env: "alpha",
    slugBaseUrl: "https://shop.staging.thesirona.net",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://shop.staging.thesirona.net/lbmiddleware",
      desktop: "https://shop.staging.thesirona.net/lbmiddleware",
      ios: "https://shop.staging.thesirona.net/lbmiddleware"
    }
  },
  {
    key: "Sirona", // Preprod
    vendorCode: "srn",
    vendorName: "Sirona",
    domain: "https://pp.manage.thesirona.net/",
    env: "preprod",
    slugBaseUrl: "https://pp.thesirona.net/",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://pp.thesirona.net/lbmiddleware",
      desktop: "https://pp.thesirona.net/lbmiddleware",
      ios: "https://pp.thesirona.net/lbmiddleware"
    }
  },
  {
    key: "Sirona",
    vendorCode: "srn",
    vendorName: "Sirona",
    domain: "https://manage.thesirona.com",
    env: "prod",
    slugBaseUrl: "https://www.thesirona.com",
    productDiscount: 10,
    linkBuilderBaseUrl: {
      android: "https://www.thesirona.com/lbmiddleware",
      desktop: "https://www.thesirona.com/lbmiddleware",
      ios: "https://www.thesirona.com/lbmiddleware"
    }
  }
];
