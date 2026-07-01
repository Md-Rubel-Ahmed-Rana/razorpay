import { Schema, model } from "mongoose";
import {
  IOrder,
  IOrderProduct,
  IPaymentDetails,
  IShippingAddress,
} from "./order.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const shippingAddressSchema = new Schema<IShippingAddress>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  postal_code: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
});

const paymentDetailsSchema = new Schema<IPaymentDetails>({
  razorpay_order_id: {
    type: String,
    default: null,
    index: true,
  },

  razorpay_payment_id: {
    type: String,
    default: null,
    index: true,
  },

  razorpay_signature: {
    type: String,
    default: null,
  },

  payment_method: {
    type: String,
    default: null,
  },

  payment_status: {
    type: String,
    enum: ["created", "authorized", "captured", "failed", "refunded"],
    default: "created",
  },

  paid_at: {
    type: Date,
    default: null,
  },
});

const orderProductSchema = new Schema<IOrderProduct>({
  product_id: {
    type: Number,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  unit_price: {
    type: Number,
    required: true,
    min: 0,
  },

  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    order_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping_charge: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping_address: {
      type: shippingAddressSchema,
      default: null,
    },
    payment_details: {
      type: paymentDetailsSchema,
      default: null,
    },
    raw_payment_response: {
      type: Schema.Types.Mixed,
      default: null,
    },
    products: {
      type: [orderProductSchema],
      default: [],
    },
  },
  schemaOptions
);

export const OrderModel = model<IOrder>("Order", orderSchema);
