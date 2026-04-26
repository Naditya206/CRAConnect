import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-[20px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden transition-all duration-300 group-hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)] group-hover:-translate-y-1">
        <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs font-medium">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-1.5">
            {product.name}
          </h3>
          <p className="text-primary-600 font-extrabold text-base mb-3">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-600 font-bold border border-gray-200">
              {product.seller_name.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs text-gray-500 truncate font-medium">{product.seller_name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
