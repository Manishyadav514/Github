import { formatPrice, getCurrency } from "@libUtils/format/formatPrice";

/* eslint-disable no-param-reassign */
class FBPixel {
  static currencyType: any;

  static addToCart(addedProduct: any, category?: any) {
    const fbObj: any = {
      gtn: addedProduct?.productMeta?.gtn,
      name: addedProduct?.cms[0]?.content.name,
      category,
      price: formatPrice(addedProduct?.price),
      quantity: 1,
      OfferPrice: formatPrice(addedProduct?.offerPrice),
      Identity: "",
      Shade: addedProduct?.cms[0]?.attributes?.shadeLabel,
      Brand: addedProduct.brand.name,
    };

    if (fbObj.OfferPrice <= 0) {
      fbObj.OfferPrice = null;
    }
    if (fbObj.gtn <= 0) {
      fbObj.gtn = null;
    }
    const contentArray: any = [
      {
        id: fbObj.gtn,
        quantity: fbObj.quantity,
      },
    ];
    const eventObj: any = {
      content_ids: [fbObj.gtn],
      content_name: fbObj.name,
      content_type: "Product",
      contents: contentArray,
      content_category: fbObj.category,
      value: fbObj.price,
      Identity: fbObj.Identity,
      OfferPrice: fbObj.OfferPrice,
      shade: fbObj.Shade,
      currency: getCurrency(),
      Brand: fbObj.Brand,
    };
    ConsoleLog("AddToCart", eventObj);

    // if (process.env.PRODUCT_ENV === "PROD" && "fbq" in window) {
    //   (window as any).fbq("track", "AddToCart", eventObj);
    // }
  }

  static purchase(fbObj: any, productObj: any) {
    const eventObj: any = {
      content_ids: [fbObj.gtnIds],
      content_type: "Product",
      content_name: "NA",
      value: fbObj.value,
      contents: productObj,
      num_items: fbObj.Number_of_items,
      PaymentMethod: fbObj.PaymentMethod,
      Identity: fbObj.Identity,
      Discount: fbObj.Discount,
      currency: getCurrency(),
      OrderNumber: fbObj.OrderNumber,
      PhoneNumber: fbObj.PhoneNumber,
      utm_source: fbObj.utm_source,
      utm_medium: fbObj.utm_medium,
      utm_term: fbObj.utm_term,
      utm_content: fbObj.utm_content,
      utm_campaign: fbObj.utm_campaign,
    };
    ConsoleLog("Purchase", eventObj);
    // if (process.env.PRODUCT_ENV === "PROD" && "fbq" in window) {
    //   (window as any).fbq("track", "Purchase", eventObj);
    // }
  }

  static viewContent(fbObj: any) {
    const eventObj: any = {
      content_type: "Product",
      content_name: fbObj.ProductName,
      content_ids: [fbObj.gtnNo],
      value: parseInt(fbObj.Price ? fbObj.Price : 0),
      currency: getCurrency(),
    };
    ConsoleLog("ViewContent", eventObj);
    // if (process.env.PRODUCT_ENV === "PROD" && "fbq" in window) {
    //   (window as any).fbq("track", "ViewContent", eventObj);
    // }
  }

  static checkoutInitiate(fbObj: any, productObj: any) {
    const eventObj: any = {
      content_ids: [fbObj.gtnIds ? fbObj.gtnIds : ""],
      // content_type: "Product",
      content_category: "NA",
      value: parseInt(fbObj.value ? fbObj.value : 0),
      contents: productObj,
      currency: getCurrency(),
      num_items: fbObj.Number_of_items,
    };
    ConsoleLog("InitiateCheckout", eventObj);
    // if (process.env.PRODUCT_ENV === "PROD" && "fbq" in window) {
    //   (window as any).fbq("track", "InitiateCheckout", eventObj);
    // }
  }
  static completeRegistration(fbObj: any) {
    // var nameResult = fbObj.Name.split(" ");
    // var firstName = nameResult[0];
    // var lastName = nameResult[1];
    // this.windowObj.fbq('init', environment.FB_PIX_ID, {
    //   em: fbObj.Email,
    //   // Data will be hashed automatically via a dedicated function in FB pixel
    //   ph: fbObj.Phone,
    //   fn: firstName,
    //   ln: lastName

    // })
    const eventObj: any = {
      content_name: "Registration",
      // FirstName: firstName,
      // LastName: lastName,
      Identity: fbObj.Identity,
      // Email: fbObj.Email,
      // Phone: fbObj.Phone,
      Gender: fbObj.Gender,
      status: "success",
      value: 0,
      currency: getCurrency(),
    };
    ConsoleLog("CompleteRegistration", eventObj);
    // if (process.env.PRODUCT_ENV === "PROD" && "fbq" in window) {
    //   (window as any).fbq("track", "CompleteRegistration", eventObj);
    // }
  }
}

function ConsoleLog(eventType: any, eventData: any) {}

export default FBPixel;
