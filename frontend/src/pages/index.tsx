import Products from "@/components/Products";
import PageMetadata from "@/SEO/PageMetadata";
import { useState } from "react";

export default function Home() {
  const [cartItemsIds, setCartItemsIds] = useState<number[]>([]);
  return (
    <>
      <PageMetadata />
      <Products cartItemIds={cartItemsIds} setCartItemIds={setCartItemsIds} />
    </>
  );
}
