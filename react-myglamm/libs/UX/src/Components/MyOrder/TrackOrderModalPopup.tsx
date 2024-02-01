import React, { useState, useEffect } from "react";
import format from "date-fns/format";
import useTranslation from "@libHooks/useTranslation";
import PopupModal from "../PopupModal/PopupModal";
import OrderAPI from "@libAPI/apis/OrderAPI";
import { GiCloseIco } from "@libComponents/GlammIcons";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

type TrackModalProps = {
  show: boolean;
  onRequestClose: (e?: any) => void;
  userId: string;
  orderId: string;
  expectedDeliveryDate: string;
  trackingID: string;
  deliveryPartner: string;
  orderPlacedDate: string;
  actualDeliveredDate: string;
};

const TrackOrderModalPopup = ({
  show,
  onRequestClose,
  userId,
  orderId,
  expectedDeliveryDate,
  trackingID,
  deliveryPartner,
  orderPlacedDate,
  actualDeliveredDate,
}: TrackModalProps) => {
  const { t } = useTranslation();
  const myOrderConfig = t("myOrders");
  const [loading, setLoading] = useState(false);
  const [trackData, setTrackData] = useState([]);
  const deliveredText = myOrderConfig?.deliveredText || "delivered";
  const deliveryText = myOrderConfig?.deliveryText || "delivery";

  useEffect(() => {
    setLoading(true);
    if (show) {
      fetchOrderTrackingData()
        .then(trackingData => {
          setTrackData(trackingData);
        })
        .catch(error => console.log(error));
    } else {
      setLoading(false);
    }
  }, [show]);

  const fetchOrderTrackingData = async () => {
    const orderApi = new OrderAPI();
    try {
      const { data } = await orderApi.getOrderTrackingDetails(userId, orderId, true);
      const trackingData = data?.data?.filter((data: any) => data.userType !== "goddam");
      return trackingData;
    } catch (error) {
      console.error("Data Load Error : ", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div className="bg-white pb-4 w-full" style={{ borderRadius: "20px 20px 0 0" }}>
        <div className="flex items-start w-full justify-between py-4 px-5 border-gray-100 border-b">
          <div className="w-3/4 flex flex-col gap-[6px]">
            <p className="text-left text-xs font-normal capitalize">
              {myOrderConfig?.deliveryPartner || "Delivery partner"}
              <strong className="font-bold capitalize">{` : ${deliveryPartner}`}</strong>
            </p>
            <p className="text-left text-xs font-normal">
              {myOrderConfig?.trackingId || "Tracking ID"}
              <strong className="font-bold"> {` : ${trackingID}`}</strong>
            </p>
          </div>
          <button type="button" onClick={onRequestClose} className="-mr-2 p-1">
            <GiCloseIco height="20px" width="20px" fill="black" />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center min-h-[25rem]">
            <LoadSpinner className="inset-x-0 w-16 mx-auto absolute" />
          </div>
        ) : (
          <>
            {trackData?.length ? (
              <div
                className="border-l-[1px] border-dashed pl-6 pr-3 overflow-auto"
                style={{
                  maxHeight: "32rem",
                }}
              >
                {trackData.map((data: any, index: number) => (
                  <div
                    className={`flex flex-col-reverse relative min-h-[3rem] pt-4 ${
                      index === 0 ? "border-l-[1px] border-white" : "border-l-[1px] border-dashed border-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute rounded-full z-30 before:w-[5px] before:h-2.5 before:border-[2px] before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-[6px] before:block before:rotate-45 ${
                        data.visible ? "bg-[#ff9796]" : "bg-gray-300"
                      }`}
                      style={{
                        width: "18px",
                        height: "18px",
                        left: "-0.56rem",
                      }}
                    />

                    {data.visible && (
                      <div
                        className={`absolute z-20 -bottom-8 h-12`}
                        style={{
                          borderLeft: "1px solid #ff9796",
                          left: "-0.063rem",
                        }}
                      />
                    )}
                    {/* extra check for delivery and delivered date */}
                    <div className="px-4 flex text-center text-xs gap-2">
                      {data?.status?.toLowerCase() === deliveredText ? (
                        <>
                          <p className={`uppercase ${data.visible ? "font-bold" : "font-normal"}`}>{`${
                            data.visible ? deliveredText : deliveryText
                          }`}</p>
                          {data.visible
                            ? actualDeliveredDate && (
                                <p className="font-normal capitalize text-[#838383]">
                                  {`on ${format(new Date(actualDeliveredDate), "eee, do  MMM yy")}`}
                                </p>
                              )
                            : expectedDeliveryDate && (
                                <p className="font-normal capitalize text-[#838383]">
                                  {`expected by ${format(new Date(expectedDeliveryDate), "eee, do  MMM yy")}`}
                                </p>
                              )}
                        </>
                      ) : (
                        <>
                          <p className={`uppercase ${data.visible ? "font-bold" : "font-normal"}`}>{data?.status}</p>
                          {data?.data?.[data?.data?.length - 1]?.scanDate && (
                            <p className="font-normal capitalize text-[#838383]">
                              {format(new Date(data.data[data.data.length - 1].scanDate.split("T")[0]), "eee, do  MMM yy")}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* notes */}
                    <div className="flex flex-col gap-2 pb-3 pt-1">
                      {data?.data &&
                        data.data?.map((subItem: any) => (
                          <div className="relative">
                            {index !== 0 && (
                              <>
                                <div className="w-[6px] h-[6px] -ml-1 mt-[2px] absolute rounded-full z-30 bg-[#ff9796]" />
                                <div
                                  className="absolute h-16 z-0 mt-[2px]"
                                  style={{
                                    borderLeft: "1px solid #ff9796",
                                    left: "-0.063rem",
                                  }}
                                />
                              </>
                            )}
                            <div className="px-4">
                              <p className="first-letter:uppercase text-xs font-normal">{subItem?.note}</p>
                              <p className="text-gray-400 text-[10px] font-normal">
                                {format(new Date(subItem?.scanDate), "eee, do  MMM yy - hh:mm a") || ""}
                                {subItem?.scannedLocation && ` | ${subItem?.scannedLocation?.split(",")?.[0]}`}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}

                <div
                  className={`flex flex-col-reverse relative min-h-[3rem] text-[0.9rem] pt-4 border-l-[1px] border-dashed border-gray-300`}
                >
                  <div
                    className="absolute rounded-full z-30 before:w-[5px] before:h-2.5 before:border-[2px] before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-[6px] before:block before:rotate-45 bg-[#ff9796]"
                    style={{
                      width: "18px",
                      height: "18px",
                      left: "-0.56rem",
                    }}
                  />
                  <div className="px-4 flex text-center text-xs gap-2">
                    <p className="font-bold uppercase">{myOrderConfig?.orderPlaced || "order Placed"}</p>
                    {orderPlacedDate && (
                      <p className="font-normal capitalize text-[#838383]">
                        {format(new Date(orderPlacedDate?.split("T")[0]), "eee, do  MMM yy")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm font-thin pl-6 pt-4">{t("trackingDataCurrentlyUnavailable")}</p>
            )}
          </>
        )}
      </div>
    </PopupModal>
  );
};

export default TrackOrderModalPopup;
