import useAppRedirection from "@libHooks/useAppRedirection";
import Layout from "@libLayouts/Layout";
import { logURI } from "@libUtils/debug";
import Head from "next/head";
import React, { ReactElement } from "react";

const UnlockCoupon = ({ unlockCouponData }: any) => {
  const { redirect } = useAppRedirection();

  return (
    <>
      <Head>
        <meta key="description" name="description" content="Homepage" />
        <title key="title">Homepage</title>
      </Head>
      <div className="flex flex-col px-2 py-4">
        <h1 className="mb-2 text-xl font-semibold capitalize">Unlocked Coupons For You</h1>
        {unlockCouponData?.map((item: any, index: number) => (
          <div
            className="mb-4 rounded border-[1px] border-gray-300 flex flex-col items-start justify-start p-4 gap-3"
            key={item.couponCode}
          >
            <div className="w-full border-b border-gray-200 flex flex-row items-center justify-start gap-2 pb-3">
              <div className="">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M6.66631 9.60061C6.66631 8.82265 6.97535 8.07654 7.52546 7.52644C8.07557 6.97633 8.82167 6.66728 9.59964 6.66728H10.933C11.7075 6.66684 12.4504 6.36008 12.9996 5.81395L13.933 4.88061C14.2056 4.60648 14.5297 4.38894 14.8866 4.24049C15.2436 4.09204 15.6264 4.01563 16.013 4.01562C16.3996 4.01563 16.7824 4.09204 17.1393 4.24049C17.4963 4.38894 17.8204 4.60648 18.093 4.88061L19.0263 5.81395C19.5755 6.36008 20.3184 6.66684 21.093 6.66728H22.4263C23.2043 6.66728 23.9504 6.97633 24.5005 7.52644C25.0506 8.07654 25.3596 8.82265 25.3596 9.60061V10.9339C25.3601 11.7085 25.6668 12.4514 26.213 13.0006L27.1463 13.9339C27.4204 14.2065 27.638 14.5306 27.7864 14.8876C27.9349 15.2446 28.0113 15.6274 28.0113 16.0139C28.0113 16.4005 27.9349 16.7833 27.7864 17.1403C27.638 17.4973 27.4204 17.8214 27.1463 18.0939L26.213 19.0273C25.6668 19.5765 25.3601 20.3194 25.3596 21.0939V22.4273C25.3596 23.2052 25.0506 23.9514 24.5005 24.5015C23.9504 25.0516 23.2043 25.3606 22.4263 25.3606H21.093C20.3184 25.3611 19.5755 25.6678 19.0263 26.2139L18.093 27.1473C17.8204 27.4214 17.4963 27.639 17.1393 27.7874C16.7824 27.9359 16.3996 28.0123 16.013 28.0123C15.6264 28.0123 15.2436 27.9359 14.8866 27.7874C14.5297 27.639 14.2056 27.4214 13.933 27.1473L12.9996 26.2139C12.4504 25.6678 11.7075 25.3611 10.933 25.3606H9.59964C8.82167 25.3606 8.07557 25.0516 7.52546 24.5015C6.97535 23.9514 6.66631 23.2052 6.66631 22.4273V21.0939C6.66586 20.3194 6.35911 19.5765 5.81297 19.0273L4.87964 18.0939C4.60551 17.8214 4.38796 17.4973 4.23951 17.1403C4.09107 16.7833 4.01465 16.4005 4.01465 16.0139C4.01465 15.6274 4.09107 15.2446 4.23951 14.8876C4.38796 14.5306 4.60551 14.2065 4.87964 13.9339L5.81297 13.0006C6.35911 12.4514 6.66586 11.7085 6.66631 10.9339V9.60061Z"
                    fill="var(--color1)"
                  />
                  <path d="M12 20L20 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                  <path
                    d="M12.6667 13.3333C13.0349 13.3333 13.3333 13.0349 13.3333 12.6667C13.3333 12.2985 13.0349 12 12.6667 12C12.2985 12 12 12.2985 12 12.6667C12 13.0349 12.2985 13.3333 12.6667 13.3333Z"
                    fill="white"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.3337 20.0013C19.7018 20.0013 20.0003 19.7028 20.0003 19.3346C20.0003 18.9664 19.7018 18.668 19.3337 18.668C18.9655 18.668 18.667 18.9664 18.667 19.3346C18.667 19.7028 18.9655 20.0013 19.3337 20.0013Z"
                    fill="white"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-base text-gray-900 font-semibold">{item?.couponCode}</p>
                <p className="text-xs text-green-500 font-normal">{item?.label}</p>
              </div>
            </div>

            <p className="py-0.5 text-sm text-gray-800 font-normal">{item?.content}</p>
            <div className="w-full flex items-start">
              <div
                className="px-7 py-2 bg-ctaImg rounded text-gray-100 text-xs font-medium"
                onClick={() => redirect(`${item?.url}`)}
              >
                VIEW PRODUCTS
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

UnlockCoupon.getLayout = (children: ReactElement) => (
  <Layout footer={false} header={false}>
    {children}
  </Layout>
);

UnlockCoupon.getInitialProps = (ctx: any) => {
  const couponData = ctx?.configV3?.unlockCouponData;
  if (couponData?.length) {
    logURI(ctx?.asPath);
    return { unlockCouponData: couponData };
  } else {
    if (ctx?.res) {
      ctx.res.status(404).end("Page Not Found");
    }
    return { errorCode: 404 };
  }
};

export default UnlockCoupon;
