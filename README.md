# Betasoft - Endüstriyel Makine ve Otomasyon Sistemleri Web Sitesi

Modern, hızlı ve SEO uyumlu kurumsal web sitesi projesi. Bu proje; endüstriyel makine üretimi, otomasyon çözümleri ve robotik entegrasyonlar sunan firmalar için özel olarak geliştirilmiş, tam donanımlı bir Yönetim Paneli'ne (CMS) sahip bir Next.js uygulamasıdır.

## 🚀 Kullanılan Teknolojiler

### Frontend (Önyüz)
* **[Next.js (App Router)](https://nextjs.org/)** - React tabanlı web framework'ü (Server Components, SEO, Image Optimization)
* **[TypeScript](https://www.typescriptlang.org/)** - Statik tip denetimi ve güvenli kodlama
* **[Tailwind CSS](https://tailwindcss.com/)** - Hızlı ve modern CSS framework'ü
* **[shadcn/ui](https://ui.shadcn.com/)** - Radix UI tabanlı, erişilebilir ve özelleştirilebilir bileşen kütüphanesi
* **[Lucide React](https://lucide.dev/)** - Modern ikon seti
* **Framer Motion** - (Eğer kullanıldıysa) Yumuşak animasyonlar ve sayfa geçişleri

### Backend & Veri Tabanı (Arkayüz)
* **[Convex](https://www.convex.dev/)** - Gerçek zamanlı (Real-time), TypeScript destekli Serverless arka uç ve veri tabanı
* **[Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)** - Uygun maliyetli ve yüksek performanslı bulut nesne depolama (Görsel ve dosyalar için)
* **Custom JWT Auth** - Yönetim paneli için özel olarak yapılandırılmış güvenli giriş sistemi

---

## 🌟 Öne Çıkan Özellikler

1. **Gelişmiş Yönetim Paneli (Admin Dashboard):**
   * **Makineler ve Ürünler:** Yeni ürün ekleme, teknik özellikler ve sınırsız resim yükleme.
   * **Makaleler (Blog):** Markdown destekli zengin metin editörü ile SEO uyumlu içerik yönetimi.
   * **Fotoğraf Galerisi:** Cloudflare R2 entegrasyonu sayesinde hızlı ve sınırsız görsel yükleme/silme işlemleri.
   * **Genel Ayarlar:** İletişim bilgileri, sosyal medya linkleri, ana sayfa slider görselleri ve çözüm ortakları logolarının dinamik olarak panelle değiştirilebilmesi.
   * **Dinamik SEO Alanları:** Her bir kategori, makine ve makale için özel *Meta Title*, *Meta Description* ve *Keywords* girebilme yeteneği.

2. **Üstün Performans (Lighthouse 90+):**
   * Next.js `next/image` bileşeni ile görsellerin otomatik boyutlandırılması ve yeni nesil formatlarda (WebP) sunulması.
   * Sunucu Taraflı Oluşturma (SSR) ve Statik Oluşturma (SSG) ile sıfır gecikme.

3. **Mobil Uyum (Responsive Design):**
   * Masaüstünden tablet ve telefona kadar her ekranda kusursuz görünüm. (Mobil admin panel Sidebar entegrasyonu dahil)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda (localhost) çalıştırmak için aşağıdaki adımları izleyin:

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/KULLANICI_ADINIZ/betasoft.git
cd betasoft
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini (Environment Variables) Ayarlayın
Ana dizinde bir `.env.local` ve `.env` dosyası oluşturun ve aşağıdaki değerleri kendi projenize göre doldurun:

```env
# Convex Veri Tabanı
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Yönetici (Admin) Giriş Bilgileri
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
SESSION_SECRET=your_super_secret_session_key

# Cloudflare R2 Depolama
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-your_r2_dev_url.r2.dev
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Bu komut, uygulamayı `http://localhost:3000` adresinde ayağa kaldırır ve Convex veri tabanı bağlantısını başlatır.

---

## ☁️ Dağıtım (Deployment)

Bu proje **Vercel** üzerinde barındırılmak üzere optimize edilmiştir.
1. GitHub'a kodunuzu *push* ettikten sonra Vercel'e projenizi bağlayın.
2. `npx convex deploy` komutunu çalıştırarak Production ortamı için Convex şifrelerinizi alın.
3. Vercel'in `Environment Variables` sekmesine tüm şifrelerinizi eksiksiz girin ve *Redeploy* yapın.

---

*Bu proje; hız, estetik ve işlevselliği bir araya getiren modern web standartlarında geliştirilmiştir.*
