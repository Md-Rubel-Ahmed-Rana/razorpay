import { envConfig } from "@/config/index";
import RazorPayService from "../payment/payment.service";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";

class Service {
  async create(data: IOrder) {
    // generate a unique order number for the order
    data.order_number = `ORD-${Date.now()}`;

    // calculate subtotal, tax, discount, shipping charge and total
    data.subtotal = data.products.reduce(
      (acc, product) => acc + product.total_price,
      0
    );
    data.tax = data.subtotal * 0.18; // assuming 18% tax
    data.discount = 0; // assuming no discount
    data.shipping_charge = 50; // assuming fixed shipping charge
    data.total =
      data.subtotal + data.tax + data.shipping_charge - data.discount;

    const order = await OrderModel.create(data);

    // call the Razorpay service to create a payment order
    const result = await RazorPayService.checkout({
      total: order.total,
      currency: order.currency,
      order_number: order.order_number,
      notes: {
        orderId: order._id.toString(),
        customerId: order.user?.toString() || "",
        total_items: order.products.length.toString(),
        total_amount: order.total.toString(),
        order_number: order.order_number,
      },
      description: `Payment for order ${order.order_number}`,
    });
    // update the order with the razorpay_order_id
    order.payment_details = {
      razorpay_order_id: result.razorpay_order_id,
      payment_status: "created",
      // We should update and mark as paid this when the payment is captured via webhook
    };
    await order.save();
    return {
      key: envConfig.razorpay.keyId,
      razorpay_order_id: result.razorpay_order_id,
      amount: result.amount,
      currency: result.currency,
      description: result.description,
      notes: result.notes,
      customer_name: order.shipping_address.name,
      customer_email: order.shipping_address.email,
      customer_phone: order.shipping_address.phone,
    };
  }
}

export const OrderService = new Service();
