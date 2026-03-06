# Yeni Proje Ekleme Checklist

Bu listeyi yeni bir proje eklerken sirasiyla kontrol et.

Amac su:

- dosyalar eksik olmasin
- `projects.json` hatali olmasin
- canliya attiktan sonra proje sorunsuz acilsin

## 1. Proje ID belirle

Yeni proje icin benzersiz bir ID sec.

Ornek:

- `950_2`
- `1101_8`
- `1205_4`

Kurallar:

- bosluk kullanma
- Turkce karakter kullanma
- ayni ID'yi ikinci kez kullanma
- klasor adi ile `projects.json` icindeki ID birebir ayni olsun

## 2. Proje klasorunu olustur

Su klasoru olustur:

```text
assets/projects/PROJE_ID/
```

Ornek:

```text
assets/projects/1205_4/
```

## 3. Zorunlu dosyalari hazirla

Dis mekan icin:

- Android modeli: `.glb`
- iPhone modeli: `.usdz`
- varyant thumbnail gorseli

Ic mekan icin:

- floorplan gorseli
- her oda icin panorama gorseli
- istenirse her oda icin thumbnail

## 4. Dosya adlarini kontrol et

En cok hata burada olur.

Kontrol et:

1. Dosya uzantilari dogru mu
2. Kucuk-buyuk harf uyumu dogru mu
3. `projects.json` icindeki dosya adlari ile klasordeki dosya adlari birebir ayni mi
4. Gereksiz bosluk veya ozel karakter var mi

Ornek dogru dosya adlari:

- `1205_4.glb`
- `1205_4.usdz`
- `plan_01.webp`
- `Salon01.webp`
- `Mutfak01.webp`

## 5. Asset klasorunu doldur

Ornek yapi:

```text
assets/projects/1205_4/
  1205_4.glb
  1205_4.usdz
  plan_01.webp
  Salon01.webp
  Salon02.webp
  Mutfak01.webp
  YatakOdasi.webp
```

## 6. `projects.json` icine yeni proje ekle

Su alanlar mutlaka olmali:

- `projectName`
- `themeColor`
- `logo`
- `assetsPath`
- `exterior.modelAndroid`
- `exterior.modelIOS`
- `exterior.variants`
- `interior.startRoom`
- `interior.floorplanImage`
- `interior.rooms`

## 7. Varyantlari kontrol et

Her varyant icin sunlar dogru olmali:

- `name`
- `suffix`
- `thumbnail`

Eger tek daire tipi varsa `suffix` bos birakilabilir:

```json
{
  "name": "3+1",
  "suffix": "",
  "thumbnail": "plan_01.webp"
}
```

## 8. Oda listesini kontrol et

Her oda icin sunlar olmali:

- `id`
- `name`
- `tex`
- `thumbnail`
- `mapCoords.x`
- `mapCoords.y`

Kontrol et:

1. `id` alanlari tekrarlamasin
2. `startRoom` olarak yazilan oda gercekten listede olsun
3. `tex` dosyalari asset klasorunde olsun
4. `thumbnail` dosyalari asset klasorunde olsun
5. `mapCoords` degerleri mantikli olsun

## 9. JSON formatini kontrol et

Kontrol et:

1. Virgul eksigi var mi
2. Fazla virgul var mi
3. Tirnak isaretleri dogru mu
4. Acilan kapatilan suslu parantezler tam mi

JSON bozuksa uygulama hic veri cekemez.

## 10. Lokalde test et

Canliya atmadan once lokalde ac:

```text
index.html?id=PROJE_ID
select.html?id=PROJE_ID
exterior.html?id=PROJE_ID
interior.html?id=PROJE_ID
```

Kontrol et:

1. Proje aciliyor mu
2. Dis mekan modeli geliyor mu
3. iOS model dosyasi tanimli mi
4. Oda listesi geliyor mu
5. Panorama gorselleri aciliyor mu
6. Harita konumlari mantikli mi

## 11. Canliya atarken kontrol et

Sunlari birlikte gonder:

1. yeni `assets/projects/PROJE_ID/` klasoru
2. guncel `projects.json`

Statik yapi oldugu icin genelde restart gerekmez.

## 12. Canli kontrol

Canliya attiktan sonra su linkleri kontrol et:

```text
https://alanadiniz.com/index.html?id=PROJE_ID
https://alanadiniz.com/select.html?id=PROJE_ID
https://alanadiniz.com/exterior.html?id=PROJE_ID
https://alanadiniz.com/interior.html?id=PROJE_ID
```

## 13. Kisa ozet

Yeni proje eklerken kisa mantik su:

1. yeni klasor olustur
2. assetleri koy
3. `projects.json` a yeni kayit ekle
4. lokalde test et
5. sunucuya at
6. canlida kontrol et