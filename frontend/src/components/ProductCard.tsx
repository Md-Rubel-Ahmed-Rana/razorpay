/* eslint-disable @next/next/no-img-element */

type Props = {
  product: any;
  cartItemIds: number[];
  setCartItemIds: (ids: number[]) => void;
};

const ProductCard = ({ product, cartItemIds, setCartItemIds }: Props) => {
  const handleAddToCart = () => {
    if (!cartItemIds.includes(product.id)) {
      setCartItemIds([...cartItemIds, product.id]);
    }
  };

  const handleRemoveFromCart = () => {
    setCartItemIds(cartItemIds.filter((id) => id !== product.id));
  };

  const isInCart = cartItemIds.includes(product.id);

  return (
    <div
      key={product.id}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <p className="text-sm text-slate-500">{product.category}</p>

          <h2 className="mt-1 line-clamp-2 text-lg font-semibold text-slate-900">
            {product.name}
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-slate-900">
            ₹{product.price.toLocaleString()}
          </span>

          <span className="text-sm text-amber-500">⭐ {product.rating}</span>
        </div>

        <p className="text-sm text-slate-500">{product.reviews} Reviews</p>

        {isInCart ? (
          <button
            className="w-full rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-500 cursor-pointer"
            onClick={handleRemoveFromCart}
          >
            Remove from Cart
          </button>
        ) : (
          <button
            className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white transition hover:bg-slate-700 cursor-pointer"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
