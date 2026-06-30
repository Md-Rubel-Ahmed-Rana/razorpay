import Link from "next/link";

export default function PaymentFailed() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg rounded-xl border bg-white p-10 text-center shadow">
        <div className="text-6xl">❌</div>

        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          Payment Failed
        </h1>

        <p className="mt-3 text-gray-500">
          Your payment could not be completed. Please try again.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-md bg-blue-600 px-5 py-3 text-white"
        >
          Try Again
        </Link>
      </div>
    </main>
  );
}
