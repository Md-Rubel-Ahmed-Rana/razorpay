import { useState } from "react";
import axios from "axios";
import { envConfig } from "@/config/env";
import loadRazorpay from "@/config/razorpay";
import { useRouter } from "next/router";
import {
  ICreateOrder,
  IOrderResponse,
  IShippingAddress,
} from "@/types/order.type";
import { IProduct } from "@/types/product.type";

type PaymentSuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const shippingAddress: IShippingAddress = {
  name: "Md Rubel Ahmed Rana",

  phone: "+919876543210",

  email: "rubel.ahmed@gmail.com",

  address: "House 25, Road 3",

  city: "Kolkata",

  state: "West Bengal",

  postal_code: "700001",

  country: "India",
};

type Props = {
  products: IProduct[];
};

const Checkout = ({ products }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Processing...");
  const router = useRouter();

  const startCheckout = async (
    session: IOrderResponse,
  ): Promise<PaymentSuccessResponse> => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      throw new Error("Unable to load Razorpay SDK.");
    }

    if (!session.key) throw new Error("Missing Razorpay Key.");

    if (!session.razorpay_order_id)
      throw new Error("Missing Razorpay Order ID.");

    if (!session.amount) throw new Error("Missing Payment Amount.");

    if (!session.currency) throw new Error("Missing Currency.");

    return new Promise((resolve) => {
      const razorpay = new window.Razorpay({
        key: session.key,
        amount: session.amount,
        currency: session.currency,
        order_id: session.razorpay_order_id,
        name: session.customer_name,
        description: session.description,
        prefill: {
          name: session.customer_name,
          email: session.customer_email,
          contact: session.customer_phone,
        },
        notes: session.notes,
        theme: {
          color: "#2563EB",
        },
        handler(response: PaymentSuccessResponse) {
          resolve(response);
          router.push(`/payment/success?orderId=${session.razorpay_order_id}`);
        },
        modal: {
          ondismiss() {
            router.push(`/payment/failed?reason=cancelled`);
          },
        },
      });

      razorpay.on("payment.failed", (failed: any) => {
        console.log(failed);
        router.push(`/payment/failed?reason=failed`);
      });

      razorpay.open();
    });
  };

  const handlePay = async () => {
    try {
      setIsLoading(true);
      const checkoutPayload: ICreateOrder = {
        currency: "INR",
        shipping_address: shippingAddress,
        products: products.map((product) => ({
          product_id: product.id,
          name: product.name,
          quantity: 1,
          unit_price: product.price,
          total_price: product.price * 1,
        })),
      };
      // create order in the backend and get the checkout session
      const { data } = await axios.post(
        `${envConfig.baseApi}/order`,
        checkoutPayload,
      );

      const checkoutSession: IOrderResponse = data.data;

      const payment = await startCheckout(checkoutSession);

      // verify the payment in the backend
      setLoadingMessage("Verifying payment...");
      await axios.post(`${envConfig.baseApi}/payment/verify`, {
        ...payment,
      });

      setLoadingMessage("Payment verified successfully.");
    } catch (error: any) {
      console.error(error);

      alert(error?.message || "Something went wrong while processing payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className="w-full rounded-md bg-blue-600 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer transition hover:bg-blue-700"
    >
      {isLoading ? loadingMessage : "Proceed to Payment"}
    </button>
  );
};

export default Checkout;
