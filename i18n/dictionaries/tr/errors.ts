export const errors = {
  notFound: {
    code: "404 / SAYFA BULUNAMADI",
    title: "Aradığınız sayfaya ulaşılamıyor.",
    description:
      "Adres değişmiş veya sayfa kaldırılmış olabilir. Ana sayfaya dönebilir ya da sunduğum web çözümlerini inceleyebilirsiniz.",
    home: "Ana Sayfaya Dön",
    services: "Neler Yapabiliriz?",
  },
  runtime: {
    code: "SİSTEM / BEKLENMEYEN HATA",
    title: "Bir şeyler planlandığı gibi gitmedi.",
    description:
      "İşlemi yeniden deneyebilir veya güvenli biçimde ana sayfaya dönebilirsiniz.",
    retry: "Yeniden Dene",
    home: "Ana Sayfaya Dön",
  },
} as const;
