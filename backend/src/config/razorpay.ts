import Razorpay from "razorpay";
import { envConfig } from ".";

const razorpay = new Razorpay({
  key_id: envConfig.razorpay.keyId,
  key_secret: envConfig.razorpay.keySecret,
});

export default razorpay;
