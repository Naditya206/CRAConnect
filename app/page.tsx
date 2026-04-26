"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import { getProducts, getCategories } from "@/lib/firestoreUtils";
import { Product, Category } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header section */}
      <div className="bg-white px-6 pt-14 pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">CRAConnect</h1>
        <p className="text-gray-500 text-sm mb-6">Marketplace RW 15 Candirenggo Asri</p>
        
        {/* Search Bar */}
        <Link href="/search">
          <div className="bg-gray-50 rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100 cursor-text transition-all hover:bg-gray-100">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm font-medium">Cari produk...</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-6 pt-4 pb-28">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === "all" 
                  ? "bg-primary-600 text-white shadow-md shadow-primary-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.id 
                    ? "bg-primary-600 text-white shadow-md shadow-primary-200" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              {activeCategory === "all" ? "Produk Terbaru" : "Hasil Kategori"}
            </h2>
            <span className="text-sm text-primary-600 font-bold">
              {filteredProducts.length} Produk
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">Belum ada produk di kategori ini</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
