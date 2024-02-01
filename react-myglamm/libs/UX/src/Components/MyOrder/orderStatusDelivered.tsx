import * as React from "react";
import format from "date-fns/format";
import "./OrderStatus.scss";

const OrderStatus = ({ estDeliveryDate, trackData }: any) => {
  let orderedAndConfirmed: any;
  let deliveryDate;
  let shipped;
  let packed;
  let delivered;
  let pulse_confirmed;
  let pulse_in_transit;

  // console.log("track data", trackData);

  // let deliveryDate = trackData.expected_delivery_date;

  const sortBy = (key: any) => {
    return (a: any, b: any) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
  };

  const sortedData = trackData.orderTrack.concat().sort(sortBy("id"));
  // console.log("sorted data", sortedData);

  if (trackData.status_id === 12) {
    if (!orderedAndConfirmed) {
      orderedAndConfirmed = {};
    }
    pulse_confirmed = true;
  }

  sortedData.map((v: any, i: any) => {
    // console.log("v status id check", v.status_id);
    if (v.status_id === 12) {
      orderedAndConfirmed = v;
      pulse_confirmed = true;
    }
    if (v.status_id === 74) {
      packed = v;
      pulse_confirmed = false;
      if (!orderedAndConfirmed) {
        orderedAndConfirmed = {};
      }
      shipped = v;
      pulse_in_transit = true;
    }
    if (v.status_id === 14) {
      shipped = v;
      pulse_confirmed = false;
      if (!orderedAndConfirmed) {
        orderedAndConfirmed = {};
      }
      pulse_in_transit = true;
    }
    if (v.status_id === 75) {
      shipped = v;
      pulse_confirmed = false;
      pulse_in_transit = true;
    }
    if (v.status_id === 15) {
      delivered = v;
      deliveryDate = v.scan_date;
      pulse_in_transit = false;
    }
  });

  // console.log("delivery", deliveryDate);

  return (
    <div
      style={{
        borderRight: "1px solid rgb(211, 211, 211)",
      }}
    >
      <div className="flex items-baseline justify-around relative" style={{ width: "270px", margin: "0 auto" }}>
        <div className="flex flex-col items-center">
          <div
            className={`flex items-center justify-center ${orderedAndConfirmed ? "" : {}}`}
            style={{
              borderRadius: "10px",
              width: "20px",
              height: "20px",
              border: "1px solid #d3d3d3",
              marginBottom: "4px",
              zIndex: 1,
              background: "#fff",
            }}
          >
            <div
              className=""
              style={{
                borderRadius: "8px",
                width: "14px",
                height: "14px",
                border: "1px solid #fab6b5",
                background: "#fab6b5",
              }}
            />
          </div>
          <p className="text-xs font-bold">Confirmed</p>
          <div
            style={{
              width: "117px",
              height: "2px",
              position: "absolute",
              background: "#fab6b5",
              left: "71px",
              top: "9px",
            }}
          />
        </div>
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center"
            style={{
              borderRadius: "10px",
              width: "20px",
              height: "20px",
              border: "1px solid #d3d3d3",
              marginBottom: "4px",
              zIndex: 1,
              background: "#fff",
            }}
          >
            <div
              className=""
              style={{
                borderRadius: "8px",
                width: "14px",
                height: "14px",
                // border: "1px solid #fab6b5",
                background: "#fab6b5",
              }}
            />
          </div>
          <p className="text-xs font-bold">{format(new Date(estDeliveryDate.split("T")[0]), "do MMM, yyyy")}</p>
          <p className="text-xs">Delivered</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
