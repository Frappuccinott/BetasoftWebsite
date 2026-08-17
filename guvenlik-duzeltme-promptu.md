# Görev: BetasoftWebsite Admin Panel Güvenlik Açıklarını Gider

## Bağlam
Bu proje Next.js 16 (App Router) + Convex (backend/DB) + Cloudflare R2 (dosya depolama) ile geliştirilmiş bir kurumsal web sitesi + admin panelidir. Admin girişi `actions/auth.ts` + `lib/auth.ts` (jose ile JWT, httpOnly cookie) üzerinden yönetiliyor, route koruması `proxy.ts` middleware'inde yapılıyor.

Bir güvenlik incelemesinde aşağıdaki açıklar tespit edildi. Görevin bunları **veritabanındaki mevcut veriye dokunmadan, sadece kod/yetkilendirme mantığını değiştirerek** düzeltmek.

## KESİN KURALLAR (mutlaka uy)
1. Convex'teki mevcut dokümanları (articles, categories, machines, galleries, settings, pageViews) SİLME, DEĞİŞTİRME veya taşıma yapma. Hiçbir migration script'i veya toplu veri güncelleme komutu çalıştırma.
2. `npx convex deploy`, `npx convex run` gibi prod'a etkisi olan komutları ÇALIŞTIRMA — sadece kodu düzenle, deploy kararını bana bırak.
3. `convex/schema.ts`'e yeni tablo/alan eklemek ZORUNLU değilse ekleme. Zorunluysa önce bana planını yaz, onay almadan ilerleme.
4. Var olan dosyaları komple yeniden üretme (full regenerate etme). Sadece ilgili fonksiyon/blok üzerinde hedefli (targeted) düzenleme yap.
5. `.env.local` veya prod secret DEĞERLERİNE dokunma — sadece kodun hangi env var ismini okuduğunu netleştir.
6. Public tarafı kırma: site ziyaretçilerinin gördüğü sayfalar ve `getActiveArticles`, `getCategories` gibi public query'ler auth gerektirmemeli; sadece admin'e özel write/okuma işlemleri korunmalı.
7. Her düzeltmeden sonra hangi dosyaları neden değiştirdiğini kısaca özetle.

## Düzeltilecek Açıklar (öncelik sırasıyla)

### 1. [KRİTİK] Convex mutation'ları kimlik doğrulaması yapmıyor
Dosyalar: `convex/articles.ts`, `convex/categories.ts`, `convex/machines.ts`, `convex/galleries.ts`, `convex/settings.ts`

Sorun: `createX/updateX/deleteX` mutation'larının hiçbiri çağıranın admin olup olmadığını kontrol etmiyor. `ConvexClientProvider.tsx`'te client'a hiç auth bağlanmamış (`setAuth` yok), yani bu mutation'lar Convex deployment URL'sini bilen HERKES tarafından doğrudan çağrılabilir. Ayrıca `getArticles` sorgusu taslak dahil TÜM makaleleri döndürüyor ve aynı şekilde korumasız — yayınlanmamış içerik sızabilir.

Beklenen çözüm: Bu fonksiyonları yetkisiz istemcilerden çağrılamaz hale getir. Şu iki yaklaşımdan projenin mevcut Convex sürümüne (package.json: `convex ^1.44.0`) en uygun olanını seç:
- **(a)** Bu fonksiyonları `internalMutation`/`internalQuery` yap; admin panelinin çağırdığı yerlerde bunun yerine, `admin_session` httpOnly cookie'sini server-side doğrulayan (mevcut `lib/auth.ts`'teki `decrypt` fonksiyonunu kullanan) Next.js Server Action'lar üzerinden çağır.
- **(b)** Bu mümkün değilse, her mutation'a bir `sessionToken` argümanı ekleyip mutation içinde bunu aynı secret ile doğrula, geçersizse `ConvexError("Unauthorized")` fırlat. `admin_session` cookie'si httpOnly olduğundan client JS doğrudan okuyamaz — bunun için middleware ile zaten korunan bir route altında token döndüren minimal bir endpoint kullanabilirsin. Yeni, JS'den okunabilir (httpOnly olmayan) bir session cookie'si OLUŞTURMA.

Hangi yaklaşımı seçersen seç, admin dashboard'daki mevcut CRUD akışlarının (makale/kategori/makine/galeri/ayar ekleme-düzenleme-silme) çalışmaya devam ettiğini doğrula.

### 2. [KRİTİK] `actions/r2.ts` server action'ları da açık
`getPresignedUploadUrl` ve `deleteImageFromR2` fonksiyonlarının başına, `admin_session` cookie'sini okuyup `lib/auth.ts`'teki `decrypt` ile doğrulayan bir kontrol ekle. Geçersiz/eksikse `{ success: false, error: "Unauthorized" }` döndür, işlemi durdur.

### 3. [KRİTİK] SESSION_SECRET / JWT_SECRET tutarsızlığı + fail-open
`lib/auth.ts` → `process.env.SESSION_SECRET` okuyor, README'de sadece `JWT_SECRET` dokümante edilmiş. Tek bir isimde birleştir (hangisini kullanacağına sen karar ver, kodu ve README'yi tutarlı hale getir) ve `encrypt`/`decrypt` fonksiyonlarının başına secret tanımsızsa hata fırlatan bir kontrol ekle — secret boşken "undefined" string'ini sessizce anahtar olarak kullanmasın.

### 4. [ORTA] Login brute-force koruması yok
`actions/auth.ts`'teki `login` fonksiyonuna basit bir rate-limit ekle (örn. aynı IP'den kısa sürede birkaç başarısız denemeden sonra geçici kilitleme). Mevcut altyapıya en uygun pratik çözümü seç.

### 5. [ORTA] Şifre karşılaştırması timing-safe değil
`email === validEmail && password === validPassword` yerine `crypto.timingSafeEqual` (Node) kullan, uzunluk farkını da güvenli şekilde ele al.

### 6. [ORTA] Tek katman auth koruması
`app/admin/dashboard/layout.tsx` içine de (middleware'e ek olarak) server-side session kontrolü ekle — savunmada derinlik için.

### 7. [ORTA] Security header'lar eksik
`next.config.ts`'e `headers()` fonksiyonu ekleyerek en azından şunları tanımla: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, temel bir `Content-Security-Policy`.

### 8. [DÜŞÜK] Login placeholder
`app/admin/login/page.tsx`'teki `placeholder="admin@betasoft.com"` gerçek admin e-postasıyla aynıysa jenerik bir değerle değiştir.

## Bitirdiğinde bana şunu raporla
- Değiştirilen dosyaların listesi ve her biri için 1-2 cümlelik özet
- 1. madde için hangi yaklaşımı (a/b) seçtiğin ve neden
- Yeni bir env var eklediysen adı ve nereye tanımlanması gerektiği (değerini değil)
- Elle test etmem gereken adımlar (örn. "giriş yap → makale oluştur/sil → çıkış yap → aynı mutation'ı tarayıcı konsolundan çağırmayı dene, reddedildiğini doğrula")
