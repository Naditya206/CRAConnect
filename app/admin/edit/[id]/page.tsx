"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProductById } from "@/lib/firestoreUtils";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/types";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setAuthChecking(false);
        fetchProduct();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProduct = async () => {
    if (params.id && typeof params.id === "string") {
      const data = await getProductById(params.id);
      if (data) {
        setProduct(data);
      } else {
        router.push("/admin"); // Product not found or inactive
      }
    }
    setLoading(false);
  };

  if (authChecking || loading) {
    return <div className="min-h-screen bg-gray-50 flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return product ? <ProductForm initialData={product} isEdit /> : null;
}
