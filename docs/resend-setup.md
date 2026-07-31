# Resend ve Cloudflare kurulumu

## Resend alan adı

1. Resend panelinde tercihen `send.alihanceylan.com` alt alan adını ekleyin.
2. Panelin ürettiği SPF ve DKIM kayıtlarını DNS sağlayıcısına değerleri değiştirmeden ekleyin.
3. Gerekli DNS değerlerini bu projeden veya örnek bir kaynaktan kopyalamayın; yalnızca Resend panelindeki gerçek kayıtları kullanın.
4. Alan adı durumu `verified` olduktan sonra bu alan adına ait gönderen adresini kullanın.
5. İsteğe bağlı olarak DMARC kaydı ekleyin.

## Environment variables

Cloudflare Worker ayarlarında aşağıdaki değişkenleri tanımlayın:

- `RESEND_API_KEY`: Secret olarak ekleyin; düz metin Wrangler yapılandırmasına yazmayın.
- `CONTACT_FROM_EMAIL`: Doğrulanmış alan adındaki sabit gönderen. Örnek: `Alihan Ceylan Web <form@send.alihanceylan.com>`.
- `CONTACT_TO_EMAIL`: Form bildirimlerinin ulaşacağı adres.

Yerel geliştirme için gerçek değerleri `.env.local` içinde tutun. Bu dosyayı repoya eklemeyin.

## Cloudflare dağıtımı

```sh
npm run preview
npm run deploy
```

Cloudflare Free ve Pro hesaplarında Worker istek gövdesi sınırı 100 MB'tır. Form uygulaması ham dosyaları toplam 20 MB ile sınırlar. Dosyalar kalıcı diske veya `public` klasörüne yazılmaz; yalnızca doğrulandıktan sonra tek Resend e-postasına eklenir.

Rate-limit binding, `wrangler.jsonc` içinde dakikada üç deneme olarak tanımlanmıştır. Honeypot, minimum doldurma süresi ve Resend idempotency anahtarı ayrıca uygulanır.
