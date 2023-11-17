import { OrderDeviceTypeEnum, OrderStatusEnum } from "./Order.constant";

interface FilterI {
  name: string;
  type: string;
  multiple?: boolean;
  fields: {
    name: string;
    value: any;
  }[];
  whereField: string;
  selectedValue?: any;
}

export const ORDER_FILTER_CONFIG: FilterI[] = [
  {
    name: "Order Date",
    type: "calendar",
    whereField: "createdAt",
    fields: [
      {
        name: "From Date",
        value: ""
      },
      {
        name: "To Date",
        value: ""
      }
    ]
  },
  {
    name: "Order Amount",
    type: "price",
    whereField: "paymentDetails.orderAmount",
    fields: [
      {
        name: "Min Amount",
        value: undefined
      },
      {
        name: "Max Amount",
        value: undefined
      }
    ]
  },
  {
    name: "Device Type",
    type: "dropdown",
    multiple: true,
    whereField: "meta.deviceType",
    selectedValue: "",
    fields: [
      {
        name: "Android",
        value: OrderDeviceTypeEnum.ANDROID
      },
      {
        name: " iOS",
        value: OrderDeviceTypeEnum.IOS
      },
      {
        name: "Desktop",
        value: OrderDeviceTypeEnum.DESKTOP
      },
      {
        name: "Mobile",
        value: OrderDeviceTypeEnum.MOBILE
      },
      {
        name: "Admin",
        value: OrderDeviceTypeEnum.ADMIN
      },
      {
        name: "POS",
        value: OrderDeviceTypeEnum.POS
      }
    ]
  },
  {
    name: "Order Status",
    type: "dropdown",
    multiple: true,
    whereField: "statusId",
    selectedValue: "",
    fields: [
      {
        name: "CANCELLED",
        value: OrderStatusEnum.CANCELLED
      },
      {
        name: "CONFIRMED",
        value: OrderStatusEnum.CONFIRMED
      },
      {
        name: "DELIVERED",
        value: OrderStatusEnum.DELIVERED
      },
      {
        name: "EXPIRED",
        value: OrderStatusEnum.EXPIRED
      },
      {
        name: "FAILED",
        value: OrderStatusEnum.FAILED
      },
      {
        name: "FUTURE ORDER",
        value: OrderStatusEnum.FUTURE_ORDER
      },
      {
        name: "HOLD",
        value: OrderStatusEnum.HOLD
      },
      {
        name: "INVOICING",
        value: OrderStatusEnum.INVOICING
      },
      {
        name: "OUT FOR DELIVERY",
        value: OrderStatusEnum.OUT_FOR_DELIVERY
      },
      {
        name: "PACKING",
        value: OrderStatusEnum.PACKING
      },
      {
        name: "PARTIAL",
        value: OrderStatusEnum.PARTIAL
      },
      {
        name: "PAYMENT PENDING",
        value: OrderStatusEnum.PAYMENT_PENDING
      },
      {
        name: "PAYMENT PAID",
        value: OrderStatusEnum.PAYMENT_PAID
      },
      {
        name: "PAYMENT FAILED",
        value: OrderStatusEnum.PAYMENT_FAILED
      },
      {
        name: "PAYMENT REFUNDED",
        value: OrderStatusEnum.PAYMENT_REFUNDED
      },
      {
        name: "PENDING",
        value: OrderStatusEnum.PENDING
      },
      {
        name: "PENDING APPROVAL",
        value: OrderStatusEnum.PENDING_APPROVAL
      },
      {
        name: "PICKING",
        value: OrderStatusEnum.PICKING
      },
      {
        name: "PRE ORDERED",
        value: OrderStatusEnum.PRE_ORDERED
      },
      {
        name: "READY TO SHIP",
        value: OrderStatusEnum.READY_TO_SHIP
      },
      {
        name: "REJECT",
        value: OrderStatusEnum.REJECT
      },
      {
        name: "RETURN COMPLETED",
        value: OrderStatusEnum.RETURN_COMPLETED
      },
      {
        name: "RETURN INITIATED",
        value: OrderStatusEnum.RETURN_INITIATED
      },
      {
        name: "RETURN TO ORIGIN",
        value: OrderStatusEnum.RETURN_TO_ORIGIN
      },
      {
        name: "REPLACED",
        value: OrderStatusEnum.REPLACED
      },
      {
        name: "SHIPPED",
        value: OrderStatusEnum.SHIPPED
      },
      {
        name: "WMS CLOSED",
        value: OrderStatusEnum.WMS_CLOSED
      },
      {
        name: "PROCESSING",
        value: OrderStatusEnum.PROCESSING
      },
      {
        name: "PARTIALLY REFUNDED",
        value: OrderStatusEnum.PARTIALLY_REFUNDED
      },
      {
        name: "ALLOCATED",
        value: OrderStatusEnum.ALLOCATED
      },
      {
        name: "PAYMENT EXPIRED",
        value: OrderStatusEnum.PAYMENT_EXPIRED
      }
    ]
  },
  {
    name: "Dispatch Delay Bucket",
    type: "dropdown",
    multiple: false,
    whereField: "dispatchDelay",
    fields: [
      {
        name: "< 1 Day",
        value: "LT1D"
      },
      {
        name: " 1 to 2 Day",
        value: "BW1T2D"
      },
      {
        name: "2 to 3 Day Delay",
        value: "BW2T3D"
      },
      {
        name: "3 Days",
        value: "GT3D"
      },
      {
        name: "No Delay",
        value: "ND"
      }
    ],
    selectedValue: ""
  },
  {
    name: "Delivery Delay Bucket ",
    type: "dropdown",
    multiple: false,
    whereField: "deliveryDelay",
    fields: [
      {
        name: "< 1 Day",
        value: "LT1D"
      },
      {
        name: " 1 to 2 Day",
        value: "BW1T2D"
      },
      {
        name: "2 to 3 Day Delay",
        value: "BW2T3D"
      },
      {
        name: "3 Days",
        value: "GT3D"
      },
      {
        name: "No Delay",
        value: "ND"
      }
    ],
    selectedValue: ""
  },
  {
    name: "Refund",
    type: "false",
    multiple: false,
    whereField: "paymentDetails.paymentMode.status",
    fields: [
      { value: 1, name: "Partial Refund" },
      { value: 2, name: "Full Refund" }
    ],
    selectedValue: ""
  },
  {
    name: "Order Type",
    type: "dropdown",
    multiple: false,
    whereField: "meta.order.type",
    fields: [
      { value: 1, name: "Negative Order" },
      { value: 2, name: "Positive Order" }
    ],
    selectedValue: ""
  },
  {
    name: "Ware House",
    type: "dropdown",
    multiple: false,
    whereField: "warehouseIdentifier",
    fields: [
      { value: 1, name: "Partial Refund" },
      { value: 2, name: "Full Refund" }
    ],
    selectedValue: ""
  }
];
