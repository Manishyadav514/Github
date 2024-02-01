export const experimentVars = [
  35, // Adding a comment is a hack to force multi-line arrays. This improves readability.
  85,
  86,
  87,
  88,
  89,
  91,
  92,
  93,
  94,
  96,
  97,
  98,
  99,
  100,
  101,
  103,
  104,
  105,
  106,
  107,
  108,
  109,
  110,
  111,
  112,
  113,
  114,
  115,
  116,
  117,
  119,
  121,
  122,
  124,
  125,
  126,
  128,
  129,
  130,
  131,
  133,
  134,
  135,
  136,
  137,
  138,
  139,
  142,
  143,
  144,
  145,
  146,
  147,
  148,
  149,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  159,
  161,
  163,
  164,
  165,
  166,
  168,
  169,
  170,
  171,
  172,
  173,
  175,
  176,
  177,
  178,
  181,
  182,
  183,
  184,
  185,
  188,
  189,
];
export const linkTrackVars = [
  "products",
  "events",
  "list1",
  // props
  "prop2",
  "prop3",
  "prop5",
  "prop6",
  "prop7",
  "prop8",
  "prop9",
  "prop10",
  "prop11",
  "prop12",
  "prop13",
  "prop14",
  "prop20",
  "prop23",
  "prop25",
  "prop26",
  "prop29",
  "prop30",
  "prop33",
  "prop31",
  "prop32",
  "prop40",
  "prop50",
  "prop51",
  "prop52",
  "prop53",
  "prop54",
  "prop55",
  "prop56",
  "prop57",
  "prop64",
  // evars
  "eVar9",
  "eVar10",
  "eVar11",
  "eVar12",
  "eVar13",
  "eVar14",
  "eVar16",
  "eVar18",
  "eVar20",
  "eVar21",
  "eVar25",
  "eVar26",
  "eVar29",
  "eVar23",
  "eVar28",
  "eVar30",
  "eVar32",
  "eVar33",
  "eVar34",
  "eVar35",
  "eVar36",
  "eVar38",
  "eVar40",
  "eVar43",
  "eVar46",
  "eVar56",
  "eVar64",
  "eVar69",
  "eVar70",
  "eVar74",
  "eVar77",
  "eVar79",
  "eVar80",
  "eVar81",
  "eVar85",
  "eVar86",
  "eVar87",
  "eVar88",
  "eVar89",
  "eVar91",
  "eVar92",
  "eVar93",
  "eVar94",
  "eVar96",
  "eVar99",
  "eVar100",
  "eVar101",
  "eVar104",
  "eVar106",
  "eVar105",
  "eVar108",
  "eVar109",
  "eVar110",
  "eVar111",
  "eVar112",
  "eVar113",
  "eVar114",
  "eVar115",
  "eVar117",
  "eVar119",
  "eVar121",
  "eVar122",
  "eVar125",
  "eVar128",
  "eVar133",
  "eVar134",
  "eVar136",
  "eVar138",
  "eVar139",
  "eVar140",
  "eVar143",
  "eVar144",
  "eVar145",
  "eVar146",
  "eVar148",
  "eVar151",
  "eVar153",
  "eVar154",
  "eVar155",
  "eVar156",
  "eVar157",
  "evar159",
  "eVar161",
  "eVar164",
  "eVar165",
  "eVar166",
  "eVar171",
  "eVar172",
  "eVar182",
  "eVar183",
  "eVar184",
  "eVar185",
  "eVar188",
  "eVar191",
  "eVar192",
  "eVar193",
  "eVar194",
  "eVar195",
  "eVar196",
  "eVar197",
  "eVar198",
  "eVar199",
  "eVar200",
];
export const linkTrackEvents = [
  "scAdd",
  "scRemove",
  "event13",
  "event27",
  "event28",
  "event29",
  "event35",
  "event41",
  "event51",
  "event49",
  "event52",
  "event55",
  "event59",
  "event66",
  "event67",
  "event68",
  "event69",
  "event70",
  "event77",
  "event79",
  "event80",
  "event81",
  "event82",
  "event83",
  "event84",
  "event85",
  "event86",
  "event87",
  "event89",
  "event90",
  "event107",
  "event108",
  "event114",
  "event118",
  "event119",
  "event122",
  "event123",
  "event124",
  "event126",
  "event127",
  "event132",
  "event133",
  "event134",
  "event136",
  "event151",
  "event152",
  "event162",
  "event140",
  "event141",
  "event143",
  "event144",
  "event145",
  "event159",
  "event160",
  "event165",
  "event166",
  "event176",
  "event177",
  "event178",
  "event205",
];
export function buildProductString(arrProduct) {
  try {
    if (!arrProduct.length) {
      return "";
    }
    var currentProduct = [];
    var products = "";
    for (var i = 0, len = arrProduct.length; i < len; i++) {
      currentProduct = arrProduct[i];

      products += ";" + currentProduct.productSKU + ";";
      if (currentProduct.productQuantity) {
        products += currentProduct.productQuantity + ";";
      } else {
        products += ";";
      }

      if (currentProduct.productPrice) {
        products += currentProduct.productPrice + ";";
      } else {
        products += ";";
      }

      products += "eVar54=NA |";

      if (currentProduct.PWP) {
        products += "eVar4=" + currentProduct.PWP + " | ";
      } else {
        products += "eVar4=NA | ";
      }

      if (currentProduct.productOfferPrice) {
        products += "eVar48=" + currentProduct.productOfferPrice + " | ";
      } else {
        products += "eVar48=NA | ";
      }

      if (currentProduct.productDiscountedPrice) {
        products += "eVar67=" + currentProduct.productDiscountedPrice + " | ";
      } else {
        products += "eVar67=NA | ";
      }

      if (currentProduct.productOfferPrice) {
        if (typeof currentProduct.productOfferPrice !== "")
          products += "eVar49=" + currentProduct.productOfferPrice + "-yes" + " | ";
      } else {
        products += "eVar49=" + currentProduct.productPrice + "-No" + " | ";
      }

      if (currentProduct?.stockStatus) {
        products += "eVar50=" + currentProduct?.stockStatus + " | ";
      } else {
        products += "eVar50=NA | ";
      }

      if (currentProduct.isPreOrder) {
        products += "eVar51=" + currentProduct.isPreOrder + " | ";
      } else {
        products += "eVar51=NA | ";
      }

      if (currentProduct.productRating) {
        products += "eVar52=" + currentProduct.productRating + " | ";
      } else {
        products += "eVar52=NA | ";
      }

      if (currentProduct.widget) {
        products += "eVar7=" + currentProduct.widget;
      } else {
        products += "eVar7=NA";
      }

      if (i < arrProduct.length - 1) {
        products += ",";
      }
      return products;
    }
  } catch (e) {}
}
export function getCheckoutDiscount({ common, checkout, payment }) {
  try {
    if (common.pageName.indexOf("proceed to payment") > -1) {
      return checkout.cartDiscount;
    } else {
      if (
        common.pageName.indexOf("select payment method") > -1 ||
        common.pageName.indexOf("payment success") > -1 ||
        common.pageName.indexOf("payment failed") > -1
      ) {
        return payment.cartDiscount;
      }
    }
  } catch (e) {}
}
export function getGlammPointsApplied({ common, checkout, payment, orderSummary }) {
  try {
    if (common.pageName.indexOf("proceed to payment") > -1) {
      return checkout.glammPointsApplied;
    } else {
      if (
        common.pageName.indexOf("select payment method") > -1 ||
        common.pageName.indexOf("payment success") > -1 ||
        common.pageName.indexOf("payment failed") > -1
      ) {
        return payment.glammPointsApplied;
      } else {
        if (common.pageName.indexOf("payment success") > -1 || common.pageName.indexOf("payment failed") > -1) {
          return orderSummary.glammPointsApplied;
        }
      }
    }
  } catch (e) {}
}
export function getProductMRP({ common, shoppingBag, checkout, payment }) {
  try {
    if (common.channel.indexOf("web|cart summary page") > -1) {
      return shoppingBag.mrp;
    } else {
      if (common.pageName.indexOf("proceed to payment") > -1) {
        return checkout.mrp;
      } else {
        if (
          common.pageName.indexOf("select payment method") > -1 ||
          common.pageName.indexOf("payment success") > -1 ||
          common.pageName.indexOf("payment failed") > -1
        ) {
          return payment.mrp;
        }
      }
    }
  } catch (e) {}
}
export function getProductGMV({ common, shoppingBag, checkout, payment }) {
  try {
    if (common.channel.indexOf("web|cart summary page") > -1) {
      return shoppingBag.gmv;
    } else {
      if (common.pageName.indexOf("proceed to payment") > -1) {
        return checkout.gmv;
      } else {
        if (
          common.pageName.indexOf("select payment method") > -1 ||
          common.pageName.indexOf("payment success") > -1 ||
          common.pageName.indexOf("payment failed") > -1
        ) {
          return payment.gmv;
        }
      }
    }
  } catch (e) {}
}
export function getCollectionProducts({ common, collection, category, shoppingBag, checkout, payment, orderSummary }) {
  try {
    if (window.location.href.indexOf("collection") > -1) {
      return collection.numberOfProducts;
    } else if (window.location.href.indexOf("category") > -1) {
      return category.numberOfProducts;
    } else if (window.location.href.indexOf("shopping-bag") > -1) {
      return shoppingBag.numberOfProducts;
    } else if (window.location.href.indexOf("checkout") > -1) {
      return checkout.numberOfProducts;
    } else if (common.pageName.indexOf("select payment method") > -1) {
      return payment.numberOfProducts;
    } else if (window.location.href.indexOf("payment success") > -1 || window.location.href.indexOf("payment failed") > -1) {
      return orderSummary.numberOfProducts;
    } else {
      return collection.numberOfProducts || category.numberOfProducts;
    }
  } catch (e) {}
}

export function scrambleEmail(user) {
  try {
    var t = "";
    if (typeof user?.email !== "undefined" && user?.loginStatus == "login") {
      var a = user?.email.toUpperCase();
      for (var i = 0; i < a.length; i++) {
        var q = a.charCodeAt(i);
        var w = q.toString();
        if (w.length == 2) {
          var k = "0" + w;
        } else if (w.length == 3) {
          k = w;
        }
        t += k;
      }
    }
    return t;
  } catch (e) {}
}
export function scrambleMobile(user) {
  if (user?.mobileNo) {
    try {
      function encodeMobile(s, k) {
        var enc = "";
        for (var i = 0; i < s.length; i++) {
          // create block
          var a = s.charCodeAt(i);
          // bitwise XOR
          var b = a ^ k;
          enc = enc + String.fromCharCode(b);
        }
        return enc;
      }

      var b = user?.mobileNo;
      var c = b.toString();
      var e = encodeMobile(c, "123");

      return e.toLowerCase();
    } catch (e) {}
  }
}
