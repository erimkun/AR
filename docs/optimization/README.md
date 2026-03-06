# AR Model Optimizasyon Dokumantasyonu

Bu klasor, buyuk GLB ve USDZ dosyalarini bozmadan kucultmek icin hazirlanmis guncel rehberleri toplar.

Bu dokuman seti Mart 2026 itibariyla guncel resmi kaynaklar, arac dokumantasyonlari ve yaygin uretim pratikleri baz alinarak hazirlandi.

## Bu klasorde ne var?

- `optimization.md`
  Tum secenekleri karsilastiran ana rehber.
- `optimization-simple.md`
  Herkesin uygulayabilecegi kisa ve sade surum.
- `options/gltf-transform.md`
  `gltf-transform` ile web odakli optimizasyon akisi.
- `options/gltfpack.md`
  `gltfpack` ile ileri seviye meshopt odakli optimizasyon.
- `options/usdz-blender.md`
  Blender 5.0 ile daha guncel ve daha guvenli USDZ uretim akisi.
- `options/usdz-docker-legacy.md`
  `leon/usd-from-gltf` Docker yontemi. Eski ama bazi projelerde hala kullaniliyor.
- `options/simplygon.md`
  Buyuk ekipler ve kurumsal otomasyon icin ticari alternatif.

## Hangi dosyadan baslamaliyim?

- Sadece hizli bir yol istiyorsaniz: `optimization-simple.md`
- Tum secenekleri fiyat, risk ve kalite ile birlikte gormek istiyorsaniz: `optimization.md`
- Sadece belirli bir araci uygulamak istiyorsaniz: `options/` altindaki ilgili dosya

## En kisa ozet

Bu proje tipi icin en saglikli yol genelde sudur:

1. Orijinal modeli asla silmeyin.
2. Web icin ayri GLB uretin.
3. iOS Quick Look icin ayri USDZ uretin.
4. Tek dosyayla tum platformlari zorlamaya calismayin.
5. Web tarafinda once doku boyutlarini dusurun, sonra geometri sikistirmaya gecin.
6. USDZ tarafinda eski Docker donusturucusunu degil, mumkunse Blender 5.0 export yolunu kullanin.

## Kisa tavsiye

- En pratik acilis: `gltf-transform`
- En guclu web optimizasyon: `gltfpack`
- En guvenli USDZ uretimi: Blender 5.0 `.usdz` export
- En riskli ama hala bazen ise yarayan yol: `leon/usd-from-gltf`