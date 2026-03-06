# GLB ve USDZ Optimizasyon Rehberi

Bu rehberin amaci, buyuk 3D modelleri bozmadan olabildigince kucultmek ve ayni zamanda web ile iOS AR tarafinda sorunsuz calisan ciktilar uretmektir.

Buradaki bilgiler Mart 2026 itibariyla guncel resmi kaynaklara ve yaygin uretim pratiklerine gore duzenlendi.

## Once en onemli gercek

Tek bir dosya ile hem en kucuk boyut, hem en iyi kalite, hem de tum cihazlarda sorunsuz calisma genelde mumkun degildir.

Dogru yontem genelde sunun gibi olur:

1. Bir adet orijinal ana model saklanir.
2. Web icin ayri optimize GLB uretilir.
3. iOS Quick Look icin ayri USDZ uretilir.

Bu ayrim yapilmazsa boyut kuculur ama uyumluluk bozulur, ya da uyumluluk korunur ama dosya gereksiz buyuk kalir.

## Hizli karar tablosu

Asagidaki yuzdeler kesin garanti degildir. Bunlar resmi dokumanlar, araclarin kendi aciklamalari ve sahadaki tipik kullanimlara gore hazirlanmis pratik araliklardir.

`Hata orani` alani, ilk denemede ek duzeltme gerektirme ihtimalini anlatir.

| Yontem | Nerede kullanilir | Tipik boyut kazanci | Tipik kalite kaybi | Hata orani | Risk | Fiyat |
| --- | --- | --- | --- | --- | --- | --- |
| Lossless temizlik (`prune`, `dedup`, `resample`) | Tum projeler | %5 - %20 | %0 | %0 - %5 | Cok dusuk | Ucretsiz |
| Doku boyutu dusurme (`2048 -> 1024` gibi) | Doku agirlikli modeller | %20 - %75 | %0 - %15 | %5 - %10 | Dusuk | Ucretsiz |
| WebP doku sikistirma | Web GLB | Dokularda %25 - %34, toplamda genelde %10 - %45 | %0 - %8 | %5 - %15 | Dusuk | Ucretsiz |
| KTX2 / BasisU | Web GLB, mobil GPU odakli | Dokularda %30 - %70, toplamda genelde %15 - %55 | %2 - %10 | %10 - %20 | Orta | Ucretsiz |
| Draco | Geometri agirlikli GLB | Geometride %60 - %95, toplamda genelde %10 - %60 | %0 - %3 | %5 - %15 | Dusuk - Orta | Ucretsiz |
| Meshopt / gltfpack | Web GLB, performans odakli | %20 - %70, bazen daha fazla | %0 - %3 | %10 - %20 | Orta | Ucretsiz |
| Mesh simplification | Cok agir modeller | %20 - %80 | %3 - %25 | %20 - %40 | Orta - Yuksek | Ucretsiz |
| Blender ile USDZ export ve texture downscale | USDZ | %10 - %50 | %0 - %10 | %10 - %25 | Orta | Ucretsiz |
| `leon/usd-from-gltf` Docker donusumu | USDZ, eski akislarda | %0 - %30 | %0 - %10 | %35 - %60 | Yuksek | Ucretsiz |
| Simplygon | Kurumsal pipeline ve toplu LOD | %50 - %95 | %1 - %15 | %5 - %15 | Orta | Yillik lisansli |

## En dogru secenek hangisi?

### 1. En guvenli genel cozum

- Web GLB icin: `gltf-transform`
- USDZ icin: Blender 5.0 export

Bu yol, acik, tekrar edilebilir ve bakimi kolay bir akistir.

### 2. En agresif web optimizasyon

- Web GLB icin: `gltfpack`
- USDZ icin: ayrica Blender 5.0

Bu yol daha kucuk web dosyalari uretir. Ama decoder ayari, uzanti destegi ve sahne yapisina bagli yan etkiler biraz daha fazladir.

### 3. En dusuk riskli baslangic

- Ilk asama: sadece lossless temizlik + texture resize
- Sonra gerekiyorsa: WebP veya Draco

Buyuk kalite kaybi yasamak istemeyen ekipler icin iyi bir baslangictir.

## Tavsiye edilen ana surec

### A. Orijinal modeli koruyun

Her zaman su uc dosya mantigiyla ilerleyin:

1. `model-master.glb`
2. `model-web.glb`
3. `model-ios.usdz`

`model-web.glb` dosyasindan tekrar tekrar yeni export almak yerine hep `model-master.glb` dosyasindan yeni varyantlar uretin.

Sebep basit:

- Draco kayiplidir.
- Quantization kayiplidir.
- Mesh simplification kayiplidir.
- Ust uste sikistirma kaliteyi yavas yavas bozar.

## Web icin en iyi pratik

Web tarafinda boyutun en buyuk sebebi genelde dokulardir. Bu nedenle is sirasini su sekilde kurun:

1. `inspect` ile modelin neye agirlik verdigini kontrol edin.
2. Kullanilmayan verileri temizleyin.
3. Doku boyutlarini dusurun.
4. Doku formatini WebP veya KTX2 yapin.
5. Gerekliyse geometriyi Draco veya Meshopt ile sikistirin.
6. En son gerekiyorsa mesh simplification uygulayin.

### Ne zaman WebP?

WebP su durumlarda iyidir:

- Hemen sonucu gormek istiyorsaniz
- Basit pipeline istiyorsaniz
- Doku dosyalari cok buyukse
- Mevcut web viewer kurulumunu minimum degisiklikle kullanmak istiyorsaniz

### Ne zaman KTX2?

KTX2 su durumlarda daha iyidir:

- Mobil GPU bellegini de rahatlatmak istiyorsaniz
- Daha ileri seviye web optimizasyon hedefliyorsaniz
- Loader ve transcoder ayarlarini yapabiliyorsaniz

Khronos tavsiyesi genel olarak sunu soyluyor:

- Renkli dokular icin ETC1S daha uygundur.
- Normal, roughness, metallic gibi non-color dokular icin UASTC daha guvenlidir.

### Ne zaman Draco?

Draco sunlarda mantiklidir:

- Geometri cok agirsa
- Modelinizde buyuk mesh verisi varsa
- `model-viewer` gibi bir istemci kullanip otomatik decoder yuklemeyi tercih ediyorsaniz

Ama su gercek unutulmamali:

- Draco indirme boyutunu dusurur.
- Ama GPU performansini tek basina artirmaz.
- Cunku veri once acilir, sonra GPU'ya yuklenir.

Gercek performans artisi icin vertex sayisini ve draw call sayisini da dusurmeniz gerekir.

### Ne zaman Meshopt?

Meshopt su durumlarda cok gucludur:

- Geometri + animasyon + buffer verisi beraber kuculecekse
- Yukleme ve render verimliligi de onemliyse
- Decoder entegrasyonunu siz kontrol ediyorsaniz

Ama dikkat:

- `model-viewer` Meshopt'u varsayilan olarak acik getirmez.
- Decoder konumunu siz tanimlamalisiniz.

## USDZ icin en iyi pratik

USDZ tarafinda en cok yapilan hata, web icin optimize edilmis GLB'yi dogrudan USDZ'ye cevirmeye calismaktir.

Bu genelde sorun cikarir.

Sebep:

- WebP her arac tarafindan ayni rahatlikla islenmez.
- Draco USDZ donusum zincirinde sorun cikarabilir.
- KTX2 web icin cok iyi olabilir ama USDZ tarafinda dogrudan hedef format degildir.

### USDZ icin guvenli yol

1. Orijinal veya hafif optimize edilmis GLB kullanin.
2. Doku boyutlarini makul seviyeye cekin.
3. Gerekirse hafif sadeleştirme yapin.
4. Blender 5.0 ile dogrudan `.usdz` export alin.

### USDZ tarafinda neyi abartmayin?

- Cok sert mesh simplification
- Cok agresif texture downscale
- Web odakli extension birikimi
- Tek pipeline ile hem Android hem iOS cikarmaya zorlama

## Su an en cok tavsiye edilen akıs

### Kucuk ve orta ekipler icin

1. `gltf-transform inspect`
2. `gltf-transform optimize`
3. Doku boyutu gerekiyorsa 2048 veya 1024'e cek
4. Web GLB'yi ayri sakla
5. USDZ icin Blender export yap

### Daha ileri optimizasyon isteyen ekipler icin

1. `gltfpack` ile web GLB uret
2. `meshopt` decoder ayarlarini yap
3. USDZ'yi yine ayri pipeline ile Blender'dan uret

## Kullanima hazir karar rehberi

### Durum 1: Model buyuk ama kalite bozulmasin

Sunla baslayin:

1. Lossless temizlik
2. Doku resize
3. Hafif WebP veya KTX2

### Durum 2: Model cok buyuk ve webde zor aciliyor

Sunla baslayin:

1. Doku analizi
2. Doku resize
3. Draco veya Meshopt
4. Gerekirse `%0.8 - %0.6` arasi sadeleştirme

### Durum 3: iOS'ta Quick Look bozuluyor

Sunlari kontrol edin:

1. Web icin uretilmis dosyayi mi kullaniyorsunuz?
2. WebP veya ileri sikistirma uzantilari mi tasiyorsunuz?
3. USDZ'yi eski Docker imaji ile mi uretiyorsunuz?

Bu durumda cozum genelde Blender export akısına gecmektir.

## Alternatiflerin detayli degerlendirmesi

### `gltf-transform`

Artılar:

- Acik kaynak
- Cok guncel
- Resmi glTF ekosistemiyle uyumlu
- Inspect araci cok faydali
- WebP, KTX2, Draco, Meshopt, simplify gibi adimlari tek ekosistemde yonetebilir

Eksiler:

- En agresif sonuc her modelde otomatik gelmeyebilir
- Dogru parametre secimi gerekir

Maliyet:

- Ucretsiz

### `gltfpack`

Artılar:

- Cok guclu web odakli optimizasyon
- Quantization, draw call azalmasi ve buffer optimizasyonu guclu
- Meshopt ile cok iyi sonuclar verebilir

Eksiler:

- Sahneyi daha fazla degistirir
- Node isimleri, extras veya custom veriler icin daha dikkatli olunmali
- USDZ cikisi icin ayrica uygun degil

Maliyet:

- Ucretsiz

### Blender 5.0 ile USDZ export

Artılar:

- Daha guncel
- Texture downsampling secenekleri var
- `.usdz` dogrudan export alinabiliyor
- Eski Docker donusturucusune gore daha guvenli

Eksiler:

- Node/material farklari bazen gorunum degisikligi yapabilir
- Cok karmasik sahnelerde kontrol gerekir

Maliyet:

- Ucretsiz

### `leon/usd-from-gltf` Docker

Artılar:

- Komut satirindan hizli deneme imkani verir
- Kurulumu basit olabilir

Eksiler:

- Docker Hub imaji cok eski gorunuyor
- Uzun suredir aktif bakim sinyali zayif
- Yeni iOS/Quick Look beklentilerine gore riskli

Maliyet:

- Ucretsiz

### Simplygon

Artılar:

- Buyuk ekiplerde en guclu otomasyon araclarindan biri
- LOD, remesh, material merge, bake, batch pipeline tarafinda cok guclu

Eksiler:

- Pahali
- Kucuk ekipler icin gereksiz olabilir
- GLB/USDZ odakli basit bir proje icin fazla agir olabilir

Maliyet:

- Simplygon resmi fiyat sayfasina gore oyun lisansi `42.000 USD / title / year`
- Bagimsiz ekipler icin `%85`e kadar indirim bilgisi paylasiliyor

## Bu proje icin net onerim

Sizin senaryonuz icin en mantikli plan bu:

1. `model-master.glb` dosyasini saklayin.
2. Web dosyasi icin `gltf-transform` veya `gltfpack` kullanin.
3. USDZ dosyasini ayri pipeline ile Blender 5.0'dan alin.
4. Eski `leon/usd-from-gltf` yolunu ana pipeline yapmayin.

### Neden?

- Web tarafinda en buyuk kazanc doku + geometri sikistirmadan gelir.
- iOS tarafinda en buyuk istikrar ayri USDZ cikisindan gelir.
- Tek dosyayla her platformu cozmeye calismak gereksiz risk uretir.

## Ornek hedefler

Bir model icin pratik hedefler su sekilde olabilir:

- `20 MB - 60 MB` orijinal GLB
- web cikisi: `4 MB - 15 MB`
- usdz cikisi: `6 MB - 20 MB`

Bu araliklar modelin geometri yogunluguna, texture sayisina, alpha kullanip kullanmadigina, animasyon olup olmadigina ve hedef kaliteye gore degisir.

## Sikisik zamanda uygulanacak minimum plan

1. Orijinal dosyayi kopyalayin.
2. `gltf-transform inspect` calistirin.
3. `gltf-transform optimize` ile web dosyasi cikarin.
4. Dokulari `1024` veya `2048` ile sinirlayin.
5. USDZ icin Blender export alin.
6. iPhone ve Android cihazda gercek test yapin.

## Resmi kaynaklar

- glTF Transform
  https://gltf-transform.dev/
- model-viewer
  https://modelviewer.dev/
- Apple Quick Look
  https://developer.apple.com/augmented-reality/quick-look/
- meshoptimizer / gltfpack
  https://meshoptimizer.org/gltf/
- Khronos `KHR_texture_basisu`
  https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_texture_basisu
- Khronos `EXT_texture_webp`
  https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/EXT_texture_webp
- Khronos `KHR_draco_mesh_compression`
  https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_draco_mesh_compression
- Khronos `EXT_meshopt_compression`
  https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/EXT_meshopt_compression
- Blender 5.0 USD export
  https://docs.blender.org/manual/en/latest/files/import_export/usd.html
- Blender Decimate modifier
  https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/decimate.html
- Simplygon pricing
  https://www.simplygon.com/