import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
        {/* Ikon/Logo CRAConnect (bisa diganti dengan gambar logo nanti) */}
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
        
        {/* Teks Loading */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">CRAConnect</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Memuat halaman...</p>
        </div>
      </div>
    </div>
  );
}
