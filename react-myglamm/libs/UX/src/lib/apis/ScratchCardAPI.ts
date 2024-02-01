import MyGlammAPI from "@libAPI/MyGlammAPI";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { getLocalStorageValue } from "@libUtils/localStorage";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

class ScratchCardAPI extends MyGlammAPI {
  public getScratchCards = (identifier: string, limit = 10, skip = 0) => {
    const filter = {
      limit,
      skip,
    };

    return this.myGlammV2.get(`/quiz-ms/members/${identifier}/scratchCard?filter=${JSON.stringify(filter)}`);
  };

  public updateCardStatus(identifier: string | null, scratchId: string) {
    if (checkUserLoginStatus()) {
      this.HEADERS = {
        ...this.HEADERS,
        "x-access-token": getLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS) || "",
      };
    }
    return this.myGlammV2.put(
      `/quiz-ms/members/${identifier}/scratchCard/${scratchId}/scratched`,
      {},
      {
        headers: this.HEADERS,
      }
    );
  }

  public getScratchCardByOrderId = (identifier: any, orderId: any) => {
    return this.myGlammV2.get(`quiz-ms/members/${identifier}/orders/${orderId}/scratchCard`);
  };
}

export default ScratchCardAPI;
