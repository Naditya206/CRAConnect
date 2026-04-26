"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getProducts } from "@/lib/firestoreUtils";
import { Product } from "@/types";
import BottomNav from "@/components/BottomNav";

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setAuthChecking(false);
        loadProducts();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadProducts = async () => {
    const data = await getProducts(); // This gets only active products
    setProducts(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, { is_active: false });
        loadProducts(); // Reload active products
      } catch (error) {
        console.error("Error deleting product", error);
        alert("Gagal menghapus produk");
      }
    }
  };

  if (authChecking) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-primary-600 px-4 pt-12 pb-6 flex items-center justify-between rounded-b-3xl">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-primary-100 text-sm">Kelola Produk CRAConnect</p>
        </div>
        <button onClick={handleLogout} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
          <LogOut className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 pb-24">
        <Link 
          href="/admin/create"
          className="bg-white border-2 border-dashed border-primary-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 mb-6 text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">Tambah Produk Baru</span>
        </Link>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Daftar Produk Aktif</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => <div key={n} className="bg-white h-24 rounded-2xl animate-pulse border border-gray-100"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">Belum ada produk</div>
          ) : (
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-primary-600 font-medium">{formatPrice(product.price)}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{product.seller_name}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link href={`/admin/edit/${product.id}`} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
