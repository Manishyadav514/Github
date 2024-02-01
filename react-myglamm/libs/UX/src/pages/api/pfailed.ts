import { NextApiRequest, NextApiResponse } from "next";
import PaymentAPI from "@libAPI/apis/PaymentAPI";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const paymentApi = new PaymentAPI();
  const { lang } = req.query;

  const redirectURL = lang ? `/${lang}/order-summary?status=failed` : `/order-summary?status=failed`;

  /**
   * PayPal Signature Call
   */
  if (req.query.token) {
    console.info(`========= Call Paypal Failed ===========`);

    console.info(req.query);

    try {
      const PaypalRes = await paymentApi.orderSignature({
        gateway: {
          value: "paypal",
        },
        request: {
          tokenId: req.query.token,
          status: false,
        },
      });

      console.info(`Paypal Failed`);

      console.info(PaypalRes.data.data);

      res.writeHead(302, {
        Location: redirectURL,
      });
      return res.end();
    } catch (error: any) {
      console.error(error.response.data);
      console.info(`Order Signature Failed`);

      res.writeHead(302, {
        Location: redirectURL,
      });
      return res.end();
    }
  }

  /**
   * PayTM Signature Call
   */
  if (req.body) {
    console.info(`========= Call Paytm Failed ===========`);

    console.info(req.body);
    try {
      await paymentApi.orderSignature({
        gateway: {
          value: "paytm",
        },
        request: {
          ...req.body,
        },
      });

      res.writeHead(302, {
        Location: redirectURL,
      });
      return res.end();
    } catch (error: any) {
      console.error(error.response.data);
      console.info(`Order Signature Failed`);

      res.writeHead(302, {
        Location: redirectURL,
      });
      return res.end();
    }
  }

  console.info(`Signature Call Not Hit`);

  console.log(`Incoming Req ---> `, req.body, req.query);

  res.writeHead(302, {
    Location: redirectURL,
  });
  return res.end();
};
