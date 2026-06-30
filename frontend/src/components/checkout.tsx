/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import axios from "axios";

import { envConfig } from "@/config/env";
import loadRazorpay from "@/config/razorpay";
import { demoOrderData } from "@/constants/demo-order-data";
import { useRouter } from "next/router";

type CheckoutSession = {
  key: string;
  orderId: string;
  amount: number;
  currency: string;

  name: string;
  description?: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  notes?: Record<string, string>;
};

type PaymentSuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const startCheckout = async (
    session: CheckoutSession,
  ): Promise<PaymentSuccessResponse> => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      throw new Error("Unable to load Razorpay SDK.");
    }

    if (!session.key) throw new Error("Missing Razorpay Key.");

    if (!session.orderId) throw new Error("Missing Razorpay Order ID.");

    if (!session.amount) throw new Error("Missing Payment Amount.");

    if (!session.currency) throw new Error("Missing Currency.");

    return new Promise((resolve) => {
      const razorpay = new window.Razorpay({
        key: session.key,
        amount: session.amount,
        currency: session.currency,
        order_id: session.orderId,
        name: session.name,
        description: session.description,
        prefill: session.prefill,
        notes: session.notes,
        theme: {
          color: "#2563EB",
        },
        handler(response: PaymentSuccessResponse) {
          resolve(response);
          router.push(`/payment/success?orderId=${session.orderId}`);
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

      const { data } = await axios.post(
        `${envConfig.baseApi}/payment/checkout`,
        { ...demoOrderData },
      );

      const checkoutSession: CheckoutSession = data.data;

      const payment = await startCheckout(checkoutSession);

      await axios.post(`${envConfig.baseApi}/payment/verify`, {
        ...payment,
      });
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
      className="rounded-md bg-blue-600 px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default Checkout;
