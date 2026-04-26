"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Link } from "lucide-react";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCategories } from "@/lib/firestoreUtils";
import { Category, Product } from "@/types";

interface ProductFormProps {
  initialData?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || "",
    seller_name: initialData?.seller_name || "",
    contact: initialData?.contact || "",
    image_url: initialData?.image_url || "",
  });

  useEffect(() => {
    async function load() {
      const cats = await getCategories();
      setCategories(cats);
      if (!initialData && cats.length > 0) {
        setFormData(prev => ({ ...prev, category_id: cats[0].id }));
      }
    }
    load();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category_id: formData.category_id,
        seller_name: formData.seller_name,
        contact: formData.contact,
        image_url: formData.image_url,
        is_active: true,
      };

      if (isEdit && initialData) {
        const docRef = doc(db, "products", initialData.id);
        await updateDoc(docRef, productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          created_at: serverTimestamp(),
        });
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDummies = async () => {
    if (categories.length === 0) return alert("Buat kategori minimal 1 dulu di Firestore!");
    if (!window.confirm("Buat 50 data produk dummy secara otomatis? (Proses memakan waktu beberapa detik)")) return;
    
    setLoading(true);
    try {
      const dummyNames = ["Nasi Goreng Spesial", "Kopi Susu Aren", "Jasa Bersih Taman", "Keripik Pisang", "Ayam Geprek", "Es Cendol Dawet", "Mie Ayam Spesial", "Sate Taichan", "Roti Bakar", "Jasa Servis AC", "Kue Kering Nastar", "Pisang Coklat Lumer"];
      const dummySellers = ["Pak Budi (RT 01)", "Bu Siti (RT 02)", "Mas Andi", "Mbak Rini", "Toko Makmur", "Warung Sejahtera"];
      const dummyImages = [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop"
      ];

      const promises = [];
      for (let i = 0; i < 50; i++) {
        const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)] + ` (Dummy ${i+1})`;
        const randomPrice = Math.floor(Math.random() * 50 + 5) * 1000;
        const randomCategory = categories[Math.floor(Math.random() * categories.length)].id;
        const randomSeller = dummySellers[Math.floor(Math.random() * dummySellers.length)];
        const randomImage = dummyImages[Math.floor(Math.random() * dummyImages.length)];

        promises.push(addDoc(collection(db, "products"), {
          name: randomName,
          price: randomPrice,
          description: `Ini adalah deskripsi produk dummy untuk ${randomName}. Dibuat secara otomatis untuk menguji tampilan antarmuka CRAConnect.`,
          category_id: randomCategory,
          seller_name: randomSeller,
          contact: "081234567890",
          image_url: randomImage,
          is_active: true,
          created_at: serverTimestamp(),
        }));
      }

      await Promise.all(promises);
      alert("50 Produk dummy berhasil ditambahkan!");
      router.push("/admin");
    } catch (error) {
      console.error("Error generating dummies:", error);
      alert("Gagal membuat dummy data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 sticky top-0 z-50 shadow-sm flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-gray-700 w-8 h-8 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">{isEdit ? "Edit Produk" : "Tambah Produk"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Image URL Input */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">Link Foto Produk</label>
          <p className="text-xs text-gray-500 mb-3">Karena fitur Storage belum aktif, masukkan link foto (contoh dari Imgur atau URL foto yang valid).</p>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="url" 
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
              placeholder="https://contoh.com/foto.jpg"
            />
          </div>
          {formData.image_url && (
            <div className="mt-3 relative w-32 aspect-square bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <img 
                src={formData.image_url} 
                alt="Preview" 
                className="w-full h-full object-cover" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL'; }} 
              />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Nama Produk</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              placeholder="Contoh: Nasi Goreng Spesial"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Harga (Rp)</label>
            <input 
              type="number" 
              required
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              placeholder="Contoh: 15000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Kategori</label>
            <select 
              required
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Deskripsi</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white resize-none"
              placeholder="Jelaskan produk Anda..."
            />
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Informasi Penjual</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Nama Penjual</label>
            <input 
              type="text" 
              required
              value={formData.seller_name}
              onChange={e => setFormData({...formData, seller_name: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              placeholder="Contoh: Bu Siti (RT 01)"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">No WhatsApp</label>
            <input 
              type="tel" 
              required
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              placeholder="Contoh: 081234567890"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm mt-6 disabled:opacity-70 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Produk"}
        </button>

        {!isEdit && (
          <button 
            type="button"
            onClick={handleGenerateDummies}
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2 disabled:opacity-70 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate 50 Produk Dummy"}
          </button>
        )}
      </form>
    </div>
  );
}
