import { Types } from "mongoose";

export type IOrderProduct = {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type IShippingAddress = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type IPaymentDetails = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_method?: string;
  payment_status: "created" | "authorized" | "captured" | "failed" | "refunded";
  paid_at?: Date;
};

export type IOrder = {
  _id: Types.ObjectId;
  order_number: string;
  subtotal: number;
  tax: number;
  discount: number;
  shipping_charge: number;
  total: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  user?: Types.ObjectId;

  // store shipping address in the order
  shipping_address: IShippingAddress;

  // store payment details like razorpay_order_id, razorpay_payment_id, etc.
  payment_details?: IPaymentDetails;
  raw_payment_response?: any;

  // store products in the order
  products: IOrderProduct[];
  createdAt: Date;
  updatedAt: Date;
};
