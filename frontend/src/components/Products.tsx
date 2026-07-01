import { productsDemoData } from "@/constants/product-demo-data";
import ProductCard from "./ProductCard";
import Link from "next/link";

type Props = {
  cartItemIds: number[];
  setCartItemIds: (ids: number[]) => void;
};

const Products = ({ cartItemIds, setCartItemIds }: Props) => {
  return (
    <section className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-slate-900">Products</h1>
            <h4 className="text-lg font-semibold">
              <Link
                href={`/cart?ids=${cartItemIds.join(",")}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Go to Cart: {cartItemIds.length}
              </Link>
            </h4>
          </div>
          <p className="mt-2 text-slate-500">
            Explore our latest collection of premium gadgets and accessories.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsDemoData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartItemIds={cartItemIds}
              setCartItemIds={setCartItemIds}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
