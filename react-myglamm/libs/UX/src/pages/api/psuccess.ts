import { NextApiRequest, NextApiResponse } from "next";
import PaymentAPI from "@libAPI/apis/PaymentAPI";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const paymentApi = new PaymentAPI();
  const { lang } = req.query;

  const redirectURLFailed = lang ? `/${lang}/order-summary?status=failed` : `/order-summary?status=failed`;

  const redirectURLSuccess = lang ? `/${lang}/order-summary?status=success` : `/order-summary?status=success`;
  console.log("res", res);
  console.log("res", req);

  if (res && req.query.token && req.query.PayerID) {
    console.info(`=========== Call Paypal ==============`);

    console.info(req.query);
    try {
      const signatureRes = await paymentApi.orderSignature({
        gateway: {
          value: "paypal",
        },
        request: {
          tokenId: req.query.token,
          payerId: req.query.PayerID,
          status: true,
        },
      });

      console.info(`Paypal Signature Response ----> `, signatureRes.data.data);

      console.info(`Order Signature Success`);
      res.writeHead(302, {
        Location: redirectURLSuccess,
      });
      return res.end();
    } catch (error: any) {
      console.info(`Order Signature Failed`);

      console.error(`Error Response ----> `, error.response.data);
      res.writeHead(302, {
        Location: redirectURLFailed,
      });
      return res.end();
    }
  }

  if (res && req.body.CHECKSUMHASH) {
    console.info(`========= Call Paytm =============`);

    console.info(req.body);
    try {
      const signatureRes = await paymentApi.orderSignature({
        gateway: {
          value: "paytm",
        },
        request: {
          ...req.body,
        },
      });

      console.info(`PayTM Signature Response----> `, signatureRes.data.data);

      if (signatureRes.data.data.status === "CAPTURED") {
        console.info(`Order Signature Success`);
        res.writeHead(302, {
          Location: redirectURLSuccess,
        });
        return res.end();
      }
    } catch (error: any) {
      console.info(`Order Signature Failed`);

      console.error(`Error Response ----> `, error.response.data);

      res.writeHead(302, {
        Location: redirectURLFailed,
      });
      return res.end();
    }
  }

  if (res && req.body.mihpayid && req.body.status === "success") {
    res.writeHead(302, {
      Location: redirectURLSuccess,
    });
    return res.end();
  }

  console.info(`Signature Call Not Hit`);

  console.log(`Incoming Req ---> `, req.body, req.query);

  res.writeHead(302, {
    Location: redirectURLFailed,
  });
  return res.end();
};
