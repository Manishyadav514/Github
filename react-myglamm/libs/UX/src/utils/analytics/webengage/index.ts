import { getCurrency } from "@libUtils/format/formatPrice";

class Webengage {
  static currencyType: any;

  static Track(webengageevent: any) {
    ConsoleLog(webengageevent.eventname, webengageevent);
    if (window.webengage) {
      // (window as any).webengage.track(
      //   webengageevent.eventname,
      //   webengageevent.eventobject
      // );
    }
  }

  // static WebengageEvents(webengagevent: any) {
  //   if ((window as any).webengage) {
  //     // (window as any).webengage.track(
  //     //   webengagevent.eventname,
  //     //   webengagevent.eventobject
  //     // );
  //   }
  // }

  static getCurrencyType() {
    this.currencyType = getCurrency();

    return this.currencyType;
  }

  static webengage_user(webengageuserdata: any) {
    if (window.webengage) {
      window.webengage.user.setAttribute({
        "Customer ID": webengageuserdata.id,
        "Registration Date": new Date(webengageuserdata.Registration_date),
        "Facebook Registered": webengageuserdata.facebookRegistered,
        "Google+ Registered": webengageuserdata.googleRegistered,
        "Referral Code": webengageuserdata.referral_code,
        "Parent Referral Code": webengageuserdata.parentReferalCode,
        we_first_name: webengageuserdata.firstName,
        we_last_name: webengageuserdata.lastName,
        we_phone: (webengageuserdata.mobile.length === 10 ? "+91" : "") + webengageuserdata.mobile,
        Platform: "Web",
        we_email: webengageuserdata.email,
        we_gender: webengageuserdata.Gender,
        // Enable sms notifications
      });
    }
  }

  static webEngageLoggedIn(memberId: any) {
    if (window.webengage) {
      ConsoleLog("login", memberId);
      // (window as any).webengage.user.login(memberId);
    }
  }

  static webEngageLogOut() {
    if (window.webengage) {
      ConsoleLog("logout", {});
      // (window as any).webengage.user.logout();
    }
  }
}

function ConsoleLog(eventType: any, eventData: any) {}

export default Webengage;
