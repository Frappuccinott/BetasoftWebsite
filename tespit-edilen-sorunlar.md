# Tespit Edilen Sorunlar

Proje: BetasoftWebsite (Next.js 16 + Convex + Cloudflare R2)

Aşağıdaki güvenlik sorunlarını tespit ettim, doğru mu?

## Kritik

### 1. Convex mutation'ları kimlik doğrulaması yapmıyor
Dosyalar: `convex/articles.ts`, `convex/categories.ts`, `convex/machines.ts`, `convex/galleries.ts`, `convex/settings.ts`

`createX / updateX / deleteX` mutation'larının hiçbirinde çağıranın admin olup olmadığını kontrol eden bir kod yok. `components/providers/ConvexClientProvider.tsx` içinde client'a `setAuth` gibi bir auth bağlanmamış. Admin sayfalarını koruyan `proxy.ts` middleware'i sadece Next.js sayfa route'larını (`/admin/dashboard/*`) koruyor, Convex client'ın backend'e attığı çağrıları korumuyor.

Sonuç: Convex deployment URL'sini (zaten `NEXT_PUBLIC_CONVEX_URL` ile client bundle'ında herkese açık) bilen biri, giriş yapmadan bu mutation'ları doğrudan çağırıp içerik ekleyebilir/değiştirebilir/silebilir.

Ayrıca `convex/articles.ts`'teki `getArticles` sorgusu taslak dahil TÜM makaleleri döndürüyor ve bu da aynı şekilde korumasız — yayınlanmamış içerik sızabilir.

### 2. `actions/r2.ts` server action'ları da açık
`getPresignedUploadUrl` ve `deleteImageFromR2` fonksiyonlarında hiçbir oturum/yetki kontrolü yok. Next.js server action'ları, çağrıldıkları sayfanın korumalı olup olmamasından bağımsız, ayrı çağrılabilir uç noktalardır. Yani biri R2 bucket'a dosya yükleyebilir veya mevcut görselleri silebilir.

### 3. SESSION_SECRET / JWT_SECRET tutarsızlığı + fail-open riski
`lib/auth.ts` → `process.env.SESSION_SECRET` okuyor, ama `README.md`'de sadece `JWT_SECRET` env değişkeni dokümante edilmiş. Bu isim uyuşmazlığı yüzünden `SESSION_SECRET` tanımlanmazsa, JWT imzalama anahtarı JS'in `undefined`'ı string'e çevirmesiyle sabit bir değere ("undefined") düşüyor — bu da admin oturumunun kolayca sahtelenebileceği anlamına geliyor.

## Orta

### 4. Login'de brute-force / rate limiting yok
`actions/auth.ts`'teki `login` fonksiyonu sınırsız deneme kabul ediyor, IP bazlı limit veya kilitleme mekanizması yok.

### 5. Şifre karşılaştırması timing-safe değil
`login` fonksiyonunda `email === validEmail && password === validPassword` düz JS `===` operatörüyle yapılıyor; `crypto.timingSafeEqual` gibi sabit zamanlı bir karşılaştırma kullanılmıyor.

### 6. Auth kontrolü tek katmanda
Admin route koruması sadece `proxy.ts` middleware'inde yapılıyor; `app/admin/dashboard/layout.tsx` gibi sayfa seviyesinde ek bir server-side session kontrolü yok.

### 7. Security header'lar tanımlı değil
`next.config.ts`'de `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy` gibi header'lar hiç ayarlanmamış.

## Düşük

### 8. Login sayfasındaki placeholder
`app/admin/login/page.tsx`'te e-posta alanının placeholder'ı `admin@betasoft.com` — eğer bu gerçek admin e-postasıyla aynıysa, saldırgana kullanıcı adını ipucu olarak veriyor.
