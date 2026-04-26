"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, MessageCircle, Share2, MapPin } from "lucide-react";
import { getProductById } from "@/lib/firestoreUtils";
import { Product } from "@/types";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (params.id && typeof params.id === "string") {
        const data = await getProductById(params.id);
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const phone = product.contact.startsWith("0") 
      ? "62" + product.contact.slice(1) 
      : product.contact;
    const message = encodeURIComponent(`Halo, saya tertarik dengan produk ${product.name} yang ada di CRAConnect.`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">Produk tidak ditemukan</p>
        <button onClick={() => router.back()} className="text-primary-600 font-medium">Kembali</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Navbar */}
      <div className="fixed top-0 w-full max-w-md bg-white/80 backdrop-blur-md z-50 flex items-center justify-between p-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          <Share2 className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-5 bg-white rounded-b-3xl shadow-sm mb-2">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
        </div>
        <p className="text-2xl font-bold text-primary-600 mb-4">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Seller Info */}
      <div className="px-4 py-4 bg-white shadow-sm mb-2 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg text-primary-700 font-bold">
          {product.seller_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900">{product.seller_name}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>Warga RW 15</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-5 bg-white shadow-sm mb-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Deskripsi Produk</h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-4 z-50">
        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Hubungi via WhatsApp
        </button>
      </div>
    </div>
  );
}
