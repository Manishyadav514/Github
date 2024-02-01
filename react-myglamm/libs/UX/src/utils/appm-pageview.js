import {
  buildProductString,
  getCollectionProducts,
  getGlammPointsApplied,
  getProductGMV,
  getProductMRP,
  getCheckoutDiscount,
  scrambleEmail,
  scrambleMobile,
} from "./appm-common";
export const adobeView = digitalData => {
  const {
    common,
    user,
    shoppingBag,
    orderSummary,
    whatsAppConsent,
    dsRecommendationWidget,
    login,
    search,
    guestCheckout,
    category,
    lookbook,
    look,
    product,
    offer,
    checkout,
    payment,
  } = digitalData;

  s.channel = common?.channel;
  s.pageName = common?.pageName?.toLowerCase();

  s.prop1 = common?.newPageName?.toLowerCase();
  s.prop2 = common?.subSection && common.subSection.toString().toLowerCase();
  s.prop3 = common?.pageLocation?.toLowerCase();
  s.prop5 = common?.ctaName?.toLowerCase();
  s.prop9 = user?.customerID;
  s.prop10 = scrambleEmail(user);
  s.prop12 = scrambleMobile(user);

  s.prop14 = common?.newAssetType?.toLowerCase();
  s.prop15 = common?.flowName;
  s.prop20 = user?.loginStatus;
  s.prop21 = offer?.couponCode;
  s.prop23 = getCollectionProducts(digitalData);
  s.prop25 = user?.loginStatus == "login" ? user?.membershipLevel : undefined;
  s.prop30 = getProductGMV(digitalData);
  s.prop31 = common?.widgetEntry;
  s.prop32 = common?.assetType;
  s.prop33 = getProductMRP(digitalData);
  s.prop36 = getGlammPointsApplied(digitalData);
  s.prop40 = common?.platform;
  s.prop50 = common?.bannerSource;
  s.prop51 = common?.source?.toLowerCase(); // verify
  s.prop52 = common?.upsellProductPosition;
  s.prop53 = common?.dsProductSKUs;
  s.prop54 = common?.filterSortApplied;
  s.prop55 = common?.filterSortSelected;
  s.prop57 = common?.dsProductSKUs1;
  s.prop64 = common?.dsProductSKUs2;

  s.eVar2 = "D=c46";
  s.eVar5 = "D=c1";
  s.eVar9 = "D=c9";
  s.eVar10 = "D=c10";
  s.eVar12 = "D=c12";
  s.eVar14 = "D=c14";
  s.eVar18 = window.evars.evar18;
  s.eVar20 = "D=c20";
  s.eVar23 = getCollectionProducts(digitalData);
  s.eVar25 = "D=c25";
  s.eVar26 = "D=c26";
  s.eVar28 = shoppingBag?.offerAvailable;
  s.eVar30 = getProductGMV(digitalData);
  s.eVar32 = "D=c32";
  s.eVar33 = getProductMRP(digitalData);
  s.eVar34 = getCheckoutDiscount(digitalData);
  s.eVar40 = "D=c40";
  s.eVar43 = orderSummary?.netPayable;
  s.eVar46 = whatsAppConsent;
  // s.eVar63 = common?.pageName; // set in doPlugins
  s.eVar64 = `D=c8`; // ? where does this come from
  s.eVar76 = dsRecommendationWidget?.type;
  s.eVar77 = dsRecommendationWidget?.title;
  s.eVar79 = login?.loginType;
  s.eVar81 = common?.language;
  s.eVar85 = window.experimentVariant1;
  // s.eVar95 = common?.contentType;
  // s.eVar96 = common?.contentId;
  s.eVar140 = user?.webengageId;

  //To track icid
  if (document.URL.indexOf("icid=") > -1) {
    var url = document.URL;
    var query_string_paramter = url.split("icid=")[1];
    s.eVar3 = query_string_paramter.replace(/%20/g, " ");
  }
  // Set product string only if we have product object in digitalData
  s.products = buildProductString(product);

  // For Data Science - Recommendation Widget [27052020.1] [@author: sameer s.]____________________________________________________________________________________________________
  if (dsRecommendationWidget) {
    s.evar76 = dsRecommendationWidget.type;
    s.evar77 = dsRecommendationWidget.title;
    s.events = "DSWidgetload";
    s.events = s.apl(s.events, "event201", ",", 1);
  }

  //For PDP___________________________________________________________________________________________________________________________________________________________
  try {
    if (s.pageName.indexOf("product description page") > -1) {
      s.events = "prodView,event36=" + product[0].productPrice;
      s.prop44 = s.eVar57 = product[0].productPrice;
      s.events = s.apl(s.events, "event39", ",", 1);
    }
  } catch (e) {}

  //For Free Product Selection

  try {
    if (common.newPageName == "free product selection") {
      s.events = s.apl(s.events, "event68", ",", 1);
    }
  } catch (e) {}

  //Track search data___________________________________________________________________________________________________________________________________________________________
  try {
    if (common.assetType.indexOf("search") > -1) {
      s.eVar19 = s.prop19 =
        "product-" + search.noOfProducts + "|" + "looks-" + search.noOfLooks + "|" + "tutorial and blogs-" + search.noOfBlogs;
      s.eVar17 = s.prop17 = search.searchTerm;
      s.eVar18 = s.prop18 = search.searchType;
    }
    try {
      if (typeof search.noOfProducts !== "undefined") {
        s.events = s.apl(s.events, "event7=" + search.noOfProducts, ",", 1);
      }

      if (typeof search.noOfBlogs !== "undefined") {
        s.events = s.apl(s.events, "event45=" + search.noOfBlogs, ",", 1);
      }

      if (typeof search.noOfProducts !== "undefined") {
        s.events = s.apl(s.events, "event46=" + search.noOfLooks, ",", 1);
      }
    } catch (e) {}
  } catch (e) {}

  //[PP]
  try {
    if (common.newPageName == "search initiated") {
      s.events = s.apl(s.events, "event110", ",", 1);
    }
    if (common.newPageName == "search suggestion" || common.newPageName == "No results found") {
      s.events = s.apl(s.events, "event111", ",", 1);
    }
  } catch (e) {}
  //set event for international checkout page___________________________________________________________________________________________________________________________________________________________
  try {
    if (common.pageName.indexOf("ship international") > -1) {
      s.events = s.apl(s.events, "event32", ",", 1);
    }
  } catch (e) {}

  //Track data on plp page___________________________________________________________________________________________________________________________________________________________
  try {
    if (common.ctaName == "sort applied" || common.ctaName == "filter applied") {
      s.events = s.apl(s.events, "event38", ",", 1);
    }
    if (s.pageName.trim().endsWith("add coupon")) {
      s.events = s.apl(s.events, "event148", ",", 1);
    } else if (s.pageName.indexOf("product listing page") > -1) {
      s.eVar23 = getCollectionProducts(digitalData);
      s.events = s.apl(s.events, "event38", ",", 1);
    }
  } catch (e) {}

  //For checkout page___________________________________________________________________________________________________________________________________________________________
  try {
    if (common.newPageName.indexOf("checkout") > -1) {
      s.eVar43 = checkout.netPayable;
      s.eVar23 = s.prop23 = checkout.numberOfProducts;
      s.eVar28 = checkout.offerAvailable;
      s.eVar34 = checkout.cartDiscount;
      s.eVar21 = s.prop21 = checkout.couponCode;
      s.eVar36 = checkout.glammPointsApplied;
      s.eVar33 = s.prop33 = checkout.gmv;
      s.eVar30 = s.prop30 = checkout.mrp;
      s.events = s.apl(s.events, "event14", ",", 1);
      s.events = s.apl(s.events, "event6=" + checkout.numberOfProducts, ",", 1);
      try {
        if (common.newPageName.indexOf("checkout") > -1 && user?.loginStatus?.indexOf("login") > -1) {
          s.events = "scCheckout";
        } else {
          if (common.newPageName.indexOf("checkout") > -1 && user?.loginStatus?.indexOf("guest") > -1) {
            s.events = s.apl(s.events, "event31", ",", 1);
          }
        }
      } catch (e) {}

      // For payment page___________________________________________________________________________________________________________________________________________________________
    } else {
      if (common.pageName.indexOf("select payment method") > -1) {
        s.eVar43 = payment.netPayable;
        s.eVar23 = s.prop23 = payment.numberOfProducts;
        s.eVar28 = payment.offerAvailable;
        s.eVar34 = payment.cartDiscount;
        s.eVar21 = s.prop21 = payment.couponCode;
        s.eVar36 = payment.glammPointsApplied;
        s.eVar33 = s.prop33 = payment.gmv;
        s.eVar30 = s.prop30 = payment.mrp;
        s.events = s.apl(s.events, "event14", ",", 1);
        s.events = s.apl(s.events, "event30", ",", 1);
        s.eVar54 = "NA";
        s.events = s.apl(s.events, "event6=" + payment.numberOfProducts, ",", 1);
      } else {
        // For shopping bag page___________________________________________________________________________________________________________________________________________________________
        if (common.newPageName.indexOf("shopping bag") > -1) {
          s.eVar43 = shoppingBag.netPayable;
          s.eVar23 = s.prop23 = shoppingBag.numberOfProducts;
          s.eVar28 = shoppingBag.offerAvailable;
          s.eVar33 = s.prop33 = shoppingBag.gmv;
          s.eVar30 = s.prop30 = shoppingBag.mrp;
          s.eVar21 = s.prop21 = shoppingBag.couponCode;
          s.events = s.apl(s.events, "event11=" + shoppingBag.mrp, ",", 1);
          s.events = s.apl(s.events, "event12=" + shoppingBag.gmv, ",", 1);
          s.events = s.apl(s.events, "event60=" + shoppingBag.netPayable, ",", 1);
          s.events = s.apl(s.events, "event14", ",", 1);
          s.events = s.apl(s.events, "event40", ",", 1);
          s.events = s.apl(s.events, "event6=" + shoppingBag.numberOfProducts, ",", 1);
          s.events = "scView";
        } else {
          //For order summary page___________________________________________________________________________________________________________________________________________________________
          if (common.pageName.indexOf("payment success") > -1 || common.pageName.indexOf("payment failed") > -1) {
            s.eVar43 = orderSummary.netPayable;
            s.eVar23 = s.prop23 = orderSummary.numberOfProducts;
            s.eVar28 = orderSummary.offerAvailable;
            s.eVar34 = orderSummary.cartDiscount;
            s.eVar21 = s.prop21 = orderSummary.couponCode;
            s.eVar36 = orderSummary.glammPointsApplied;
            s.eVar33 = s.prop33 = orderSummary.gmv;
            s.eVar30 = s.prop30 = orderSummary.mrp;
            s.events = s.apl(s.events, "purchase", ",", 1);
            s.events = s.apl(s.events, "event61=" + orderSummary.mrp, ",", 1);
            s.events = s.apl(s.events, "event62=" + orderSummary.gmv, ",", 1);
            s.events = s.apl(s.events, "event63=" + orderSummary.netPayable, ",", 1);
            s.events = s.apl(s.events, "event64=" + orderSummary.cartDiscount, ",", 1);
            s.events = s.apl(s.events, "event4=" + orderSummary.shippingCharges, ",", 1);
            s.events = s.apl(s.events, "event5=" + orderSummary.glammPointsApplied, ",", 1);

            if (common.pageName.toLowerCase().indexOf("myglammxogamification") > -1) {
              s.events = s.apl(s.events, "event33", ",", 1);
            }

            s.eVar1 = orderSummary.transactionNo;
            s.prop29 = s.eVar29 = orderSummary.paymentMethod;
            s.purchaseID = orderSummary.transactionNo;

            if (common.pageName.indexOf("payment failed") > -1) {
              s.events = s.apl(s.events, "event34", ",", 1);
              s.events = s.apl(s.events, "event43", ",", 1);
              s.events = s.apl(s.events, "event25=" + orderSummary.netPayable, ",", 1);
            }
          } else {
            //For guest checkout___________________________________________________________________________________________________________________________________________________________
            if (common.pageName.indexOf("enter address") > -1 && user?.loginStatus?.indexOf("guest") > -1) {
              s.eVar43 = guestCheckout.netPayable;
              s.eVar23 = s.prop23 = guestCheckout.numberOfProducts;
              s.eVar28 = guestCheckout.offerAvailable;
              s.eVar33 = s.prop33 = guestCheckout.gmv;
              s.eVar30 = s.prop30 = guestCheckout.mrp;
              s.events = s.apl(s.events, "event14", ",", 1);
              s.events = s.apl(s.events, "event31", ",", 1);
              s.events = s.apl(s.events, "event6=" + guestCheckout.numberOfProducts, ",", 1);
            }
          }
        }
      }
    }
  } catch (e) {}

  //Payment Pedning
  try {
    if (common.pageName.includes("order placed payment pending")) {
      s.events = s.apl(s.events, "event150", ",", 1);
    }
  } catch (e) {}

  try {
    if (common.assetType.indexOf("category") > -1) {
      s.eVar23 = s.prop23 = category.numberOfProducts;
      s.events = s.apl(s.events, "event6=" + category.numberOfProducts, ",", 1);
    }
  } catch (e) {}

  //Set event for homepage___________________________________________________________________________________________________________________________________________________________
  try {
    if (s.pageName.indexOf("home") > -1) {
      s.events = s.apl(s.events, "event37", ",", 1);
    }
  } catch (e) {}

  //[PP] - For GlammStudio Page - Looks
  try {
    if (common.newAssetType == "content" && common.newPageName == "lookbook category") {
      s.prop60 = s.eVar60 = lookbook.lookCategory;
      s.events = s.apl(s.events, "event44", ",", 1);
    } else {
      if (common.newAssetType == "content" && common.newPageName == "lookbook detail") {
        s.prop60 = s.eVar60 = lookbook.lookCategory;
        s.prop61 = s.eVar61 = look.lookName;
        s.events = s.apl(s.events, "event73,event44", ",", 1);
      }
    }
  } catch (e) {}

  //[PP] - For GlammStudio Page - Blog
  try {
    if (common.newAssetType == "content" && common.newPageName == "blog category") {
      s.prop62 = s.eVar62 = look.blogCategory;
      s.events = s.apl(s.events, "event44", ",", 1);
    } else {
      if (common.newAssetType == "content" && common.newPageName == "blog detail") {
        s.prop62 = s.eVar62 = look.blogCategory;
        s.prop63 = s.eVar72 = look.blogName;
        s.events = s.apl(s.events, "event74,event44", ",", 1);
      }
    }
  } catch (e) {}

  //[PP] -  For login Pages
  try {
    if (common.newAssetType == "login" && common.newPageName == "login enter details") {
      s.events = s.apl(s.events, "event103", ",", 1);
    }
    if (common.newAssetType == "login" && common.newPageName == "login enter otp") {
      s.events = s.apl(s.events, "event104", ",", 1);
    }

    if (common.newAssetType == "login" && common.newPageName == "login success") {
      s.evar79 = (login && login.loginType) || "otp";
      s.evar80 = (login && login.silentAuthSupported) || "no";
      s.events = "event42";
      s.events = s.apl(s.events, "event69", ",", 1);
    }

    if (common.newAssetType == "login" && common.newPageName == "login failure") {
      s.evar79 = login.loginType;
      s.evar80 = login.silentAuthSupported;
      s.events = "event43";
      s.events = s.apl(s.events, "event70", ",", 1);
    }
  } catch (e) {}

  //[PP] -  For Search Auto Suggestion
  try {
    if (common.newPageName == "search auto complete suggestion") {
      s.events = "event113".concat("=").concat(common.count || "0");
    }
  } catch (e) {}

  //[PP] -  For Signup Pages
  try {
    if (common.newAssetType == "registration" && common.newPageName == "signup") {
      s.events = s.apl(s.events, "event105", ",", 1);
    }

    if (
      common.pageName.indexOf("web|order checkout|register|success") > -1 ||
      common.pageName.indexOf("web|order checkout|simplified login|registration success") > -1
    ) {
      s.events = s.apl(s.events, "event71", ",", 1);
    }

    if (
      common.newAssetType == "registration" &&
      common.newPageName == "signup success" &&
      common.pageName.indexOf("web|order checkout|register|failure") > -1
    ) {
      s.events = s.apl(s.events, "event72", ",", 1);
    }

    if (
      common.newAssetType == "registration" &&
      common.newPageName == "signup failure" &&
      common.pageName.indexOf("web|order checkout|register|failure") > -1
    ) {
      s.events = s.apl(s.events, "event72", ",", 1);
    }
  } catch (e) {}

  //[PP] -  For MyAccount Pages
  try {
    if (common.newAssetType == "my account") {
      s.events = s.apl(s.events, "event75", ",", 1);
    }
  } catch (e) {}

  //[21092020] -  Wishlist Page Load
  try {
    if (common.newAssetType == "wishlist") {
      s.events = "event136";
      //s.events=s.apl(s.events,"event136",",",1);
    }
  } catch (e) {}

  //[21092020] -  Wishlist Page Load
  try {
    if (common.newAssetType == "remove product") {
      s.events = "event137";
      //s.events=s.apl(s.events,"event136",",",1);
    }
  } catch (e) {}

  //[15122020] - New Registration Event
  try {
    if (common.newAssetType.toLowerCase() == "signup") {
      if (common.newPageName.toLowerCase() == "signupsuccess") {
        s.events = "event71";
      }
    }
  } catch (e) {}

  //[16122020] - MINI PDP Page Load Event
  try {
    if (common.newAssetType.toLowerCase() == "product") {
      if (common.newPageName.toLowerCase() == "mini pdp") {
        s.events = "prodView,event36=" + product[0].productPrice;
        s.prop44 = s.eVar57 = product[0].productPrice;
        s.events = s.apl(s.events, "event39", ",", 1);
      }
    }
  } catch (e) {}

  // Community Events
  try {
    if (common.newAssetType == "community") {
      if (common.newPageName == "community feed") {
        s.events = "event125";
      } else if (["community question", "community post", "community poll"].includes(common.newPageName)) {
        s.events = "event127";
      } else if (common.newPageName.includes("community ")) {
        s.events = "event128";
      }

      //s.events=s.apl(s.events,"event136",",",1);
    }
  } catch (e) {}

  // tryon - page load
  try {
    if (common.pageName == "web|product-tryon" && common.newAssetType == "product-tryon") {
      s.events = s.apl(s.events, "event49", ",", 1);
    }
  } catch (e) {}

  s.t();
};
