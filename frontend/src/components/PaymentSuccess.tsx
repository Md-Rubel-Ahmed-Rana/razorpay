/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import axios from "axios";

import { envConfig } from "@/config/env";
import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const { query } = useRouter();

  const orderId = query?.orderId as string;

  const [loading, setLoading] = useState(true);

  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const { data } = await axios.get(
          `${envConfig.baseApi}/payment/status/${orderId}`,
        );

        setPayment(data.data);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadPayment();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading payment...
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Payment not found.
      </div>
    );
  }

  return (
    <main className="mx-auto mt-20 max-w-2xl rounded-xl border bg-white p-8 shadow">
      <div className="mb-6 text-center">
        <div className="text-6xl">✅</div>

        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          Payment Successful
        </h1>

        <p className="mt-2 text-gray-500">Thank you for your purchase.</p>
      </div>

      <div className="space-y-3">
        <Info label="Order ID" value={payment.id} />
        <Info label="Receipt" value={payment.receipt} />
        <Info label="Status" value={payment.status} />
        <Info label="Amount" value={`₹${payment.amount}`} />
        <Info label="Amount Paid" value={`₹${payment.amountPaid}`} />
        <Info label="Amount Due" value={`₹${payment.amountDue}`} />
        <Info label="Attempts" value={String(payment.attempts)} />
        <Info
          label="Created At"
          value={new Date(payment.createdAt).toLocaleString()}
        />
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="text-gray-500">{label}</span>

      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
