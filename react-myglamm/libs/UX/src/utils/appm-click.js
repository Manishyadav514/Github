import { scrambleEmail, scrambleMobile, buildProductString } from "./appm-common";
export const adobeClick = digitalData => {
  const {
    common,
    user,
    shoppingBag,
    orderSummary,
    dsRecommendationWidget,
    guestCheckout,
    offer,
    product,
    filters,
    checkout,
    payment,
  } = digitalData;

  s.channel = common?.channel;
  s.pageName = common?.pageName?.toLowerCase();

  s.prop1 = common?.newPageName?.toLowerCase();
  s.prop2 = common?.subSection?.toLowerCase();
  s.prop3 = common?.pageLocation?.toLowerCase();
  s.prop5 = common?.ctaName?.toLowerCase();
  s.prop6 = common?.newLinkPageName?.toLowerCase();
  s.prop7 = common?.linkPageName?.toLowerCase();
  s.prop8 = common?.linkName?.toLowerCase();
  s.prop9 = user?.customerID;
  s.prop10 = scrambleEmail(user);
  s.prop12 = scrambleMobile(user);
  s.prop14 = common?.newAssetType?.toLowerCase();
  s.prop20 = user?.loginStatus;
  s.prop25 = user?.loginStatus == "login" ? user?.membershipLevel : undefined;
  s.prop32 = common?.assetType?.toLowerCase();
  s.prop40 = common?.platform;
  s.prop50 = common?.source?.toLowerCase();
  s.prop56 = common?.filterSortClicked;

  s.eVar5 = "D=c1";
  s.eVar9 = "D=c9";
  s.eVar10 = "D=c10";
  s.eVar12 = "D=c12";
  s.eVar14 = "D=c14";
  s.eVar20 = "D=c20";
  s.eVar25 = "D=c25";
  s.eVar32 = "D=c32";
  s.eVar40 = "D=c40";
  s.eVar45 = "D=c14";
  s.eVar63 = common?.pageName;
  s.eVar64 = `D=c8`;
  s.eVar66 = "D=c11";
  s.eVar69 = common?.ctaName;
  s.eVar70 = "D=c6";
  s.eVar81 = common?.language;
  s.eVar95 = common?.contentType;
  s.eVar96 = common?.contentId;

  s.products = buildProductString(product);

  try {
    if (
      common.linkName.indexOf("add 2 products to bag") > -1 ||
      s.prop8.indexOf("Add to Bag") > -1 ||
      common.linkName.indexOf("ADD TO BAG") > -1 ||
      s.prop8.indexOf("add to bag") > -1 ||
      common.ctaName.indexOf("Check GC") > -1 ||
      common.ctaName.indexOf("Continue GC") > -1
    ) {
      s.events = "scAdd";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  try {
    if (
      s.prop8.indexOf("cart summary page|remove") > -1 ||
      common.ctaName.indexOf("Uncheck GC") > -1 ||
      common.ctaName.indexOf("Remove GC") > -1
    ) {
      s.events = "scRemove";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  try {
    if (common.ctaName === "uncheck addon gc") {
      s.events = "event178";
    }
  } catch (e) {}

  try {
    if (common.ctaName === "check addon gc") {
      s.events = "event177";
    }
  } catch (e) {}

  // for new icon widget___________________________________________________________________________________________________________________________________________________________
  try {
    if (common.linkName.indexOf("home|refer and earn") > -1) {
      s.eVar38 = common.widgetName;
    }
  } catch (e) {}

  //for order checkout page___________________________________________________________________________________________________________________________________________________________
  try {
    if (common.linkPageName.indexOf("checkout") > -1) {
      s.eVar43 = checkout.netPayable;
      s.eVar23 = s.prop23 = checkout.numberOfProducts;
      s.eVar28 = checkout.offerAvailable;
      s.eVar34 = checkout.cartDiscount;
      s.eVar21 = s.prop21 = checkout.couponCode;
      s.eVar36 = checkout.glammPointsApplied;
      s.eVar33 = s.prop33 = checkout.gmv;
      s.eVar30 = s.prop30 = checkout.mrp;
      s.events = s.apl(s.events, "event41", ",", 1);
      try {
        if (common.linkName.indexOf("apply promo code-error") > -1) {
          s.eVar35 = checkout.validationMessage;
        }
      } catch (e) {}
      try {
        if (s.prop8.indexOf("apply promo code") > -1) {
          s.prop8 = s.prop8 + "-" + checkout.couponCode;
          s.events = s.apl(s.events, "event41", ",", 1);
        }
      } catch (e) {}

      //for payment page___________________________________________________________________________________________________________________________________________________________
    } else {
      if (common.linkPageName.indexOf("select payment method") > -1) {
        s.eVar43 = payment.netPayable;
        s.eVar23 = s.prop23 = payment.numberOfProducts;
        s.eVar28 = payment.offerAvailable;
        s.eVar34 = payment.cartDiscount;
        s.eVar21 = s.prop21 = payment.couponCode;
        s.eVar36 = payment.glammPointsApplied;
        s.eVar33 = s.prop33 = payment.gmv;
        s.eVar30 = s.prop30 = payment.mrp;
        s.events = s.apl(s.events, "event41", ",", 1);
      } else {
        //For Shopping Bag Page___________________________________________________________________________________________________________________________________________________________
        if (common.channel.indexOf("cart summary page") > -1) {
          s.eVar43 = shoppingBag.netPayable;
          s.eVar23 = s.prop23 = shoppingBag.numberOfProducts;
          s.eVar28 = shoppingBag.offerAvailable;
          s.events = s.apl(s.events, "event41", ",", 1);
        } else {
          //for order summary page___________________________________________________________________________________________________________________________________________________________
          if (common.linkPageName.indexOf("payment success") > -1 || common.pageName.indexOf("payment failed") > -1) {
            s.eVar43 = orderSummary.netPayable;
            s.eVar23 = s.prop23 = orderSummary.numberOfProducts;
            s.eVar28 = orderSummary.offerAvailable;
            s.eVar34 = orderSummary.cartDiscount;
            s.eVar21 = s.prop21 = orderSummary.couponCode;
            s.eVar36 = orderSummary.glammPointsApplied;
            s.eVar33 = s.prop33 = orderSummary.gmv;
            s.eVar30 = s.prop30 = orderSummary.mrp;
          } else {
            //for guest checkout___________________________________________________________________________________________________________________________________________________________
            if (common.linkPageName.indexOf("enter address") > -1 && user?.loginStatus?.indexOf("guest") > -1) {
              s.eVar43 = guestCheckout.netPayable;
              s.eVar23 = s.prop23 = guestCheckout.numberOfProducts;
              s.eVar28 = guestCheckout.offerAvailable;
              s.eVar33 = s.prop33 = guestCheckout.gmv;
              s.eVar30 = s.prop30 = guestCheckout.mrp;
            }
          }
        }
      }
    }
  } catch (e) {}

  //[PP] - Submit Review
  try {
    if (common.newAssetType == "product" && common.ctaName.indexOf("submit review") > -1) {
      s.eVar74 = product.starCount;
      s.events = s.apl(s.events, "event107", ",", 1);
      s.events = s.apl(s.events, "event77", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[SS] - Submit Question
  try {
    if (common.newAssetType == "product" && common.ctaName.indexOf("submit question") > -1) {
      s.eVar74 = product.starCount;
      s.events = s.apl(s.events, "event108", ",", 1);
    }
  } catch (e) {}

  //[PP] - Promocode apply Success

  try {
    if (common.ctaName == "promocode apply success") {
      s.events = s.apl(s.events, "event86", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[PP] - Promocode remove Success

  try {
    if (common.ctaName == "promocode remove success" || common.ctaName == "remove promocode success") {
      s.events = s.apl(s.events, "event87", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[PP] - apply glammpoints success

  try {
    if (common.ctaName == "apply glammpoints success") {
      s.events = s.apl(s.events, "event84", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[PP] - remove glammpoints success

  try {
    if (common.ctaName == "remove glammpoints success") {
      s.events = s.apl(s.events, "event85", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[PP] - cross sell widget

  try {
    if (common.ctaName == "cross sell widget") {
      s.events = s.apl(s.events, "event85", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[PP] - Payment Initiated

  try {
    if (common.ctaName == "payment initiated") {
      s.prop29 = s.eVar29 = common.paymentMethodSelected;
      s.events = s.apl(s.events, "event55", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  try {
    if (common.ctaName.includes("checkout")) {
      s.prop29 = s.eVar29 = common.paymentMethodSelected;
      s.events = s.apl(s.events, "event55", ",", 1);
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[02062020] - Offer Page - Coupon Code_______________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName == "copy code") {
      s.eVar21 = offer.couponCode;
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[15072020] - Adobe Filters____________________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName == "filter apply" && filters) {
      var strFilterList = "";
      filters.list.map(function (filter, index) {
        strFilterList +=
          filter.category.toString().replace(/ /g, "_").toLowerCase() +
          ":" +
          filter.value.toString().replace(/ /g, "+").toLowerCase() +
          (index + 1 < filters.list.length ? ";" : "");
      });
      s.list1 = strFilterList || "";
      s.events = s.apl(s.events, "event80", ",", 1);
    }
    if (common.ctaName == "filter clear") {
      s.events = s.apl(s.events, "event81", ",", 1);
    }
    if (common.ctaName == "filter close") {
      s.events = s.apl(s.events, "event82", ",", 1);
    }
    if (common.ctaName == "filter click" || common.ctaName == "sort click") {
      s.events = s.apl(s.events, "event79", ",", 1);
    }
  } catch (e) {}

  // Payment : Keep the gift added by default on payment page
  try {
    if (common.ctaName == "Keep Gift card") {
      s.events = s.apl(s.events, "event176", ",", 1);
    }
  } catch (e) {}

  //[21072020] - Order Details: View Order / Track Order________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName == "view order details") {
      s.events = s.apl(s.events, "event27", ",", 1);
    }
    if (common.ctaName == "track order") {
      s.events = s.apl(s.events, "event28", ",", 1);
    }
    if (common.ctaName == "reorder") {
      s.events = s.apl(s.events, "event29", ",", 1);
    }
  } catch (e) {}

  //[21072020] - PDP: Read More / Open Tab / Close Tab________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName == "pdp read more") {
      s.events = s.apl(s.events, "event66", ",", 1);
    }
    if (
      common.ctaName == "what it is" ||
      common.ctaName == "how to use" ||
      common.ctaName == "what else you need to know" ||
      common.ctaName == "what's in it" ||
      common.ctaName == "faq" ||
      common.ctaName == "review"
    ) {
      if (common.linkName.indexOf("open") > -1) {
        s.events = s.apl(s.events, "event67", ",", 1);
      }
      if (common.linkName.indexOf("close") > -1) {
        s.events = s.apl(s.events, "event68", ",", 1);
      }
    }
  } catch (e) {}

  //[23072020] - Shade Finder - Select Color________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName.indexOf("shade") > -1 && common.assetType.indexOf("shade finder") > -1) {
      s.events = s.apl(s.events, "event69", ",", 1);
    }
  } catch (e) {}

  //[31082020] - MyGlammXO - Survey : Copy Code______________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName.indexOf("copy code") > -1 && common.assetType.indexOf("surveythankyou") > -1) {
      s.events = s.apl(s.events, "event151", ",", 1);
    }
  } catch (e) {}

  //[31082020] - MyGlammXO - Survey : Start Survey______________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName.includes("take survey") && common.assetType.indexOf("myglammxo survey") > -1) {
      s.events = s.apl(s.events, "event162", ",", 1);
    }

    if (common.ctaName.indexOf("take quiz") > -1 && common.assetType.indexOf("myglammxo quiz") > -1) {
      s.events = s.apl(s.events, "event162", ",", 1);
    }
  } catch (e) {}

  //[21092020] - Wishlisht Header Heart On click_________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName.includes("my wishlist") && common.assetType.indexOf("wishlist") > -1) {
      s.events = s.apl(s.events, "event136", ",", 1);
    }
  } catch (e) {}

  //[21092020] - Wishlisht PDP Added To Wishlist / Removed From Wishlist On click_________________________________________________________________________________________________________________________________________
  try {
    if (
      common.ctaName.includes("add to wishlist") &&
      (common.assetType.indexOf("product") > -1 ||
        common.assetType.indexOf("category") > -1 ||
        common.assetType.indexOf("collection") > -1 ||
        common.assetType.indexOf("shopping bag") > -1)
    ) {
      s.events = s.apl(s.events, "event140", ",", 1);
    }

    if (
      common.ctaName.includes("remove from wishlist") &&
      (common.assetType.indexOf("product") > -1 ||
        common.assetType.indexOf("category") > -1 ||
        common.assetType.indexOf("collection") > -1)
    ) {
      s.events = s.apl(s.events, "event141", ",", 1);
    }

    if (common.ctaName.includes("move to bag") && common.assetType.indexOf("wishlist") > -1) {
      s.events = "scAdd";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[28092020] - Order Summary -> Review Start Clicks_________________________________________________________________________________________________________________________________________
  try {
    // Review Start Clicks__________________________________________________
    if (common.ctaName.includes("rating") && common.assetType.indexOf("payment success") > -1) {
      s.events = "event13";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
    // Review Start Clicks__________________________________________________
    if (
      (common.ctaName.includes("estimated delivery date") || common.ctaName.includes("track my order")) &&
      common.assetType.indexOf("payment success") > -1
    ) {
      s.events = "event28";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[09102020] - Free Shipping Upsell -> Click on Free Shipping_________________________________________________________________________________________________________________________________________
  try {
    // Free Shipping Clicks__________________________________________________
    if (common.ctaName.includes("upsell top - cart upsell") && common.assetType.indexOf("shopping bag") > -1) {
      s.events = "event70";
      s.events = s.apl(s.events, "event41", ",", 1);
    }

    if (common.ctaName.includes("upsell top - free shipping") && common.assetType.indexOf("shopping bag") > -1) {
      s.events = "event70";
      s.events = s.apl(s.events, "event41", ",", 1);
    }

    if (common.ctaName.includes("add to bag") && common.assetType.indexOf("shopping bag") > -1) {
      s.events = "scAdd";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[10052022] -Shopping Bag Quantity Increase click_________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName.includes("quantity change") && common.assetType.indexOf("shopping bag") > -1) {
      s.events = "scAdd";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[20112020] - Initiate Exchange Product - Order Listing Page -> Click on Exchange _________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName.includes("replace") && common.assetType.indexOf("my order") > -1) {
      s.events = "event89";
      s.events = s.apl(s.events, "event41", ",", 1);
    }

    if (common.ctaName.includes("replace select product") && common.assetType.indexOf("my order") > -1) {
      s.events = "event90";
      s.events = s.apl(s.events, "event41", ",", 1);
    }

    if (common.ctaName.includes("replace select shade") && common.assetType.indexOf("my order") > -1) {
      s.events = "event90";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[18122020] - Product Add To cart from MINI PDP /  Survey Page _________________________________________________________________________________________________________________________
  try {
    if (common.linkName.toLowerCase().indexOf("claim your reward") > -1 && common.ctaName.includes("claim free lipstick")) {
      s.events = "scAdd";
      s.events = s.apl(s.events, "event41", ",", 1);
    }
  } catch (e) {}

  //[15022021] - Gamification _________________________________________________________________________________________________________________________
  try {
    if (common.linkName.toLowerCase().indexOf("invite friend") > -1) {
      if (
        common.ctaName.toLowerCase().includes("message") ||
        common.ctaName.toLowerCase().includes("whatsapp") ||
        common.ctaName.toLowerCase().includes("facebook") ||
        common.ctaName.toLowerCase().includes("sms")
      ) {
        s.events = "event133";
      }
    }
    if (common.linkName.toLowerCase().indexOf("gamification") > -1 && common.ctaName.includes("invite multiple friend")) {
      s.events = "event134";
    }
  } catch (e) {}

  //[13052021] - Hamburger Menu Item Click _________________________________________________________________________________________________________________________________________
  try {
    if (common.assetType.indexOf("menu") > -1 && common.linkName.toLowerCase().indexOf("web|hamburger") > -1) {
      s.events = "event35";
    }
  } catch (e) {}

  //[15022021] - Mobile Get OTP Simplified Click _________________________________________________________________________________________________________________________
  try {
    if (common.linkName.toLowerCase().indexOf("send otp") > -1 && common.ctaName.toLowerCase().includes("send otp")) {
      s.events = "event118";
    }
  } catch (e) {}

  // community click events
  try {
    if (common.ctaName.toLowerCase().match(/post share|question share/)) {
      s.events = "event132";
    } else if (common.ctaName.toLowerCase().includes("video play")) {
      s.events = "event159";
    } else if (common.ctaName.toLowerCase().includes("poll share")) {
      s.events = "event160";
    } else if (common.ctaName.toLowerCase().includes("product tag")) {
      s.events = "event205";
    }
  } catch (e) {}

  // bigboss click events
  try {
    if (common.ctaName.toLowerCase().includes("bigg boss vote now")) {
      s.events = "event143";
    } else if (common.ctaName.toLowerCase().includes("bigg boss contestant select")) {
      s.events = "event144";
    } else if (common.ctaName.toLowerCase().includes("bigg boss contestant submit")) {
      s.events = "event145";
    } else if (common.ctaName.toLowerCase().includes("bigg boss claim reward")) {
      s.events = "event151";
    } else if (
      common.ctaName.toLowerCase().match(/bigg boss thank you share|bigg boss leaderboard share|bigg boss profile share/)
    ) {
      s.events = "event52";
    }
  } catch (e) {}

  // mysteryRewards click events
  try {
    if (common.ctaName.toLowerCase().includes("logo slider")) {
      s.events = "event119";
    } else if (common.ctaName.toLowerCase().includes("copy code")) {
      s.events = "event151";
    } else if (common.ctaName.toLowerCase().includes("place order")) {
      s.events = "event152";
    }
  } catch (e) {}

  // bounty rewards click events
  try {
    if (common.ctaName.toLowerCase().includes("bounty play now")) {
      s.events = "event41";
    }
  } catch (e) {}

  // payment error debug click events
  try {
    if (common.ctaName.toLowerCase().trim().includes("pay now")) {
      s.eVar35 = window.evars.evar35;

      if (window.evars.evar35 && window.evars.evar35.includes("No message received on the socket for more than 5 seconds")) {
        s.events = "event165";
      } else {
        s.events = "event166";
      }
    }
  } catch (e) {}

  // on change shade in mini pdp
  try {
    // on change shade success
    if (common.ctaName.toLowerCase().trim().includes("change shade success")) {
      s.events = s.apl(s.events, "event123", ",", 1);
      // on change shade in mini pdp
    } else if (common.ctaName.toLowerCase().trim().includes("change shade")) {
      s.events = s.apl(s.events, "event122", ",", 1);
    }
  } catch (e) {}

  /* Event to Trigger on ATB failed */
  try {
    if (common.ctaName.toLowerCase().includes("cart additional fail")) {
      s.events = "event124";
    }
  } catch (e) {}

  try {
    if (common.ctaName.toLowerCase().includes("native survey submit")) {
      if (window.evars.evar35 && window.evars.evar35.includes("native survey")) {
        s.events = "event127";
      } else {
        s.events = "event126";
      }
    }
  } catch (e) {}

  //on Tag Filter click
  try {
    if (common.ctaName.toLowerCase().trim().includes("tag filter")) {
      s.events = "event114";
    }
  } catch (e) {}

  // Try on CTA click
  try {
    if (common.linkName.indexOf("web|try on") > -1) {
      s.events = "event41";
    }
  } catch (e) {}

  // when error occured while using tryon
  try {
    if (common.ctaName.indexOf("error-tryon") > -1) {
      s.events = "event51";
    }
  } catch (e) {}

  // Glammclub CTA event 152
  try {
    if (["shop now", "free exclusive benefits", "glammclub benefits"].includes(common.ctaName?.toLowerCase())) {
      s.events = "event152";
    }
  } catch (e) {}

  s.tl(true, "o", "link clicked");
};
