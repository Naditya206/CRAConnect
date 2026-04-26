export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: string;
  image_url: string;
  seller_name: string;
  contact: string;
  is_active: boolean;
  created_at: any; // Firestore Timestamp
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}
