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

export type ICreateOrder = {
  currency: string;
  shipping_address: IShippingAddress;
  products: IOrderProduct[];
};

export type IOrderResponse = {
  key: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  description: string;
  notes: Record<string, string>;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};
