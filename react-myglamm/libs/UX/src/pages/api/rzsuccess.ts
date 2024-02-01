import { NextApiRequest, NextApiResponse } from "next";
import PaymentAPI from "@libAPI/apis/PaymentAPI";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const paymentApi = new PaymentAPI();
  const { lang } = req.query;

  const redirectURLFailed = lang ? `/${lang}/order-summary?status=failed` : `/order-summary?status=failed`;

  const redirectURLSuccess = lang ? `/${lang}/order-summary?status=success` : `/order-summary?status=success`;

  console.info(`RazorPay Request body---> `, req.body);
  if (req && req.body) {
    console.info(`======== Razorpay Call ==========`);
    try {
      const signatureRes = await paymentApi.orderSignature({
        gateway: {
          value: "razorpay",
        },
        request: {
          ...req.body,
        },
      });

      console.info(`Order Signature Success`, signatureRes.data.data);
      res.writeHead(302, {
        Location: redirectURLSuccess,
      });
      return res.end();
    } catch (error: any) {
      console.error(`Order Signature Failed`, new Date(), error?.response?.data || error);

      if (error?.response?.data?.error?.errorResponse) {
        const errorMessage = JSON.stringify(error?.response?.data?.error?.errorResponse);
        res.writeHead(302, {
          Location: redirectURLFailed,
          "Set-Cookie": `rzError=${Buffer.from(JSON.stringify(errorMessage)).toString("base64")};path=/`,
        });
      } else {
        res.writeHead(302, {
          Location: redirectURLFailed,
        });
      }

      return res.end();
    }
  }

  console.info(`RazorPay Signature Bounced`);

  res.writeHead(302, {
    Location: redirectURLFailed,
  });

  return res.end();
};
