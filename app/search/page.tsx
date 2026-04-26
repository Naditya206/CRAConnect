"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search as SearchIcon } from "lucide-react";
import { getProducts } from "@/lib/firestoreUtils";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 sticky top-0 z-50 shadow-sm flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-gray-700">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <SearchIcon className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            autoFocus
            placeholder="Cari produk..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-gray-900"
          />
        </div>
      </div>

      <div className="p-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        ) : query && filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
