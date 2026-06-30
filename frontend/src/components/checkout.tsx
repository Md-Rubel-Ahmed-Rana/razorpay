import { envConfig } from "@/config/env";
import useRazorpay from "@/hooks/useRazorpay";
import axios from "axios";

const Checkout = () => {
  const orderId = "TEST_ORDER_ID_12345";
  const { openCheckout } = useRazorpay();

  const handlePay = async () => {
    const { data } = await axios.post(`${envConfig.baseApi}/payment`, {
      amount: 1500,
      receipt: orderId,
      notes: {
        orderId: orderId,
        customerId: "647382",
      },
    });

    await openCheckout(data.data);
  };

  return <button onClick={handlePay}>Pay Now</button>;
};

export default Checkout;
