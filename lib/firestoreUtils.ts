import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Product, Category } from "@/types";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("is_active", "==", true)
    );
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    
    // Sort lokal (menghindari error "Requires Index" di Firestore)
    return products.sort((a, b) => {
      const dateA = a.created_at?.toMillis ? a.created_at.toMillis() : 0;
      const dateB = b.created_at?.toMillis ? b.created_at.toMillis() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().is_active) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "categories"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
