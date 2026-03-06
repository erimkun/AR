# `gltf-transform` ile Optimizasyon

Bu arac, su anda GLB optimizasyonu icin en guvenli ve en guncel seceneklerden biridir.

## Kimler icin uygun?

- Hemen sonuc almak isteyenler
- Acik kaynak arac isteyenler
- Web icin temiz bir pipeline kurmak isteyenler
- Komut satiriyla tekrar tekrar ayni islemi yapmak isteyenler

## Kurulum

```powershell
npm install -g @gltf-transform/cli
```

## Ilk bakilacak komut

```powershell
gltf-transform inspect "model.glb"
```

Bu komut size modelin nerede sismanladigini gosterir.

## En pratik tek komut

```powershell
gltf-transform optimize "model.glb" "model-web.glb" --compress draco --texture-compress webp --texture-size 1024
```

## Bu komut ne yapiyor?

- Kullanilmayan verileri temizler.
- Geometriyi Draco ile sikistirir.
- Dokulari WebP yapar.
- Dokulari 1024 px'e kadar indirir.

## Ne zaman yeterli olur?

Sunlarda genelde yeterlidir:

- Mimari modeller
- Urun gosterimleri
- Orta buyuklukte GLB dosyalari

## Kaliteyi daha cok korumak icin

```powershell
gltf-transform optimize "model.glb" "model-web.glb" --compress draco --texture-compress webp --texture-size 2048
```

## Daha kucuk dosya icin

```powershell
gltf-transform optimize "model.glb" "model-web.glb" --compress draco --texture-compress webp --texture-size 1024 --simplify-ratio 0.8
```

Not:

- `0.8` demek, meshin tamamen yarisini silmek demek degildir.
- Ama gozle gorulur fark yaratmadan boyut dusurebilir.

## Daha ileri seviye texture optimizasyonu

WebP yerine KTX2 istiyorsaniz su araclar da ayni ekosistemde bulunur:

- `etc1s`
- `uastc`

Bu yol daha ileri seviye optimizasyondur. Baslangic icin zorunlu degildir.

## Artılar

- Guncel
- Acik kaynak
- Cok iyi inspect araci var
- WebP, KTX2, Draco, Meshopt gibi secenekleri destekler

## Eksiler

- USDZ donusumunu tek basina cozmez
- Cok agresif optimizasyon icin ince ayar gerekebilir

## Ne zaman bunu secmeliyim?

Eger emin degilseniz, ilk secilecek arac bu olsun.