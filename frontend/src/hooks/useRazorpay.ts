/* eslint-disable @typescript-eslint/no-explicit-any */

import loadRazorpay from "@/config/razorpay";
import { useRouter } from "next/router";

const useRazorpay = () => {
  const router = useRouter();
  const openCheckout = async (order: any) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      throw new Error("Unable to load Razorpay SDK.");
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency,

      name: "RazorPay Payment",

      description: "Order Payment",

      order_id: order.id,

      handler: async (response: any) => {
        console.log(response);
        router.push(`/payment/success?orderId=${order.id}`);
      },

      prefill: {
        name: "Md Rubel Ahmed Rana",
        email: "mdrubelahmedrana521@gmail.com",
        contact: "01758049882",
      },

      theme: {
        color: "#2563eb",
      },
      modal: {
        ondismiss: () => {
          router.push(`/`);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();
  };

  return {
    openCheckout,
  };
};

export default useRazorpay;
