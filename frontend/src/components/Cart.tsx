/* eslint-disable @next/next/no-img-element */
import { productsDemoData } from "@/constants/product-demo-data";
import Link from "next/link";
import { useRouter } from "next/router";
import Checkout from "./checkout";

const Cart = () => {
  const { query, push } = useRouter();

  const queryIds = query.ids as string | undefined;

  const cartItemIds = queryIds ? queryIds.split(",").map(Number) : [];

  const cartProducts = productsDemoData.filter((product) =>
    cartItemIds.includes(product.id),
  );

  const subtotal = cartProducts.reduce(
    (total, product) => total + product.price,
    0,
  );

  const shipping = subtotal > 5000 ? 0 : 120;

  const tax = Math.round(subtotal * 0.05);

  const total = subtotal + shipping + tax;

  const handleRemoveFromCart = (productId: number) => {
    const updatedIds = cartItemIds.filter((id) => id !== productId);
    const updatedQuery = updatedIds.join(",");
    push(`/cart?ids=${updatedQuery}`);
  };

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">
            Shopping Cart
          </h1>
          <button>
            <span className="text-lg font-semibold bg-amber-50 rounded-lg px-4 py-2 text-slate-900 transition hover:bg-amber-100">
              <Link href="/">Back</Link>
            </span>
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5">
            {cartProducts.length === 0 && (
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>

                <p className="mt-2 text-slate-500">
                  Add some products to continue shopping.
                </p>
              </div>
            )}

            {cartProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-5 rounded-2xl bg-white p-5 shadow-sm"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 w-32 rounded-xl object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{product.category}</p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {product.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-yellow-500">
                        ⭐ {product.rating}
                      </span>

                      <span className="text-sm text-slate-500">
                        ({product.reviews} Reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ₹{product.price.toLocaleString()}
                    </span>

                    <button
                      className="cursor-pointer rounded-lg border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                      onClick={() => handleRemoveFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

            <div className="space-y-4">
              <Row label="Items" value={cartProducts.length.toString()} />

              <Row label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />

              <Row
                label="Shipping"
                value={
                  shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`
                }
              />

              <Row label="Tax (5%)" value={`₹${tax.toLocaleString()}`} />

              <hr />

              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total</span>

                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center w-full">
              <Checkout products={cartProducts} />
            </div>

            <p className="mt-4 text-center text-sm text-slate-500">
              Secure checkout powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>

      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default Cart;
