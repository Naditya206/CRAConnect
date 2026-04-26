# 🏡 CRAConnect

**CRAConnect** adalah website marketplace sederhana berbasis komunitas untuk warga **Candirenggo Asri RW 15 (CRA)**.
Website ini memungkinkan warga untuk memposting, melihat, dan mencari produk lokal dengan mudah melalui tampilan mobile-first yang ringan dan modern.

---

## 🚀 Tech Stack

* Next.js (App Router)
* Tailwind CSS
* Firebase (Firestore & Authentication)
* Vercel (Deployment)

---

## 📱 Fitur Utama

### 👤 User (Warga)

* Melihat daftar produk
* Mencari produk (search)
* Filter berdasarkan kategori
* Melihat detail produk
* Menghubungi penjual via WhatsApp

### 🔐 Admin

* Login (Firebase Authentication)
* Dashboard admin
* Tambah produk
* Edit produk
* Hapus produk (soft delete)

---

## 🗂️ Struktur Database (Firestore)

### `products`

* name
* price
* description
* category_id
* image_url
* seller_name
* contact
* is_active
* created_at

### `categories`

* name
* icon

### `users`

* name
* role

---

## ⚙️ Instalasi & Setup Lokal

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/craconnect.git
cd craconnect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

### 4. Jalankan Project

```bash
npm run dev
```

Buka di browser:

```
http://localhost:3000
```

---

## 🔥 Setup Firebase

1. Buat project di Firebase Console
2. Aktifkan:

   * Firestore Database (Test Mode)
   * Authentication (Email/Password)
3. Buat collection:

   * `products`
   * `categories`

---

## 🌐 Deployment

Project ini siap di-deploy menggunakan **Vercel**:

1. Push ke GitHub
2. Import project ke Vercel
3. Tambahkan environment variables
4. Deploy 🚀

---

## ⚠️ Catatan

* Saat ini tidak menggunakan Firebase Storage (menggunakan URL gambar)
* Gunakan gambar dari layanan seperti Unsplash atau Imgur
* Pastikan security rules Firestore diatur sebelum production

---

## 📸 Preview

*(Tambahkan screenshot di sini nanti)*

---

## 👨‍💻 Author

Dikembangkan untuk kebutuhan warga RW 15
CRAConnect © 2026

---

## 📌 License

Free to use untuk kebutuhan komunitas
