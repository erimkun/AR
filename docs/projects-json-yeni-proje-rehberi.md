# projects.json Icine Yeni Proje Ekleme Rehberi

Bu rehber, mevcut [projects.json](projects.json) yapisina yeni bir proje eklemek icin hazirlandi.

Basit mantik su:

1. yeni bir proje ID'si belirlenir
2. o ID icin asset klasoru hazirlanir
3. `projects.json` icine ayni ID ile yeni bir obje eklenir

## 1. Mevcut yapiyi anla

Bu dosyada her proje, kendi ID'si ile tutulur.

Ornek mantik:

```json
{
  "950_2": {
    "projectName": "950 Ada 2 Parsel"
  },
  "1205_4": {
    "projectName": "Yeni Proje"
  }
}
```

Yani en dis katmanda anahtar olarak proje ID'si vardir.

## 2. Yeni proje eklerken once asset klasorunu hazirla

Ornek:

```text
assets/projects/1205_4/
```

Bu klasorun icindeki dosyalar ile `projects.json` icindeki referanslar ayni olmali.

## 3. Gerekli alanlar

Yeni proje eklerken su alanlari doldur:

### Temel alanlar

- `projectName`
- `themeColor`
- `logo`
- `assetsPath`

### Dis mekan alanlari

- `exterior.modelAndroid`
- `exterior.modelIOS`
- `exterior.variants`

### Ic mekan alanlari

- `interior.startRoom`
- `interior.floorplanImage`
- `interior.rooms`

## 4. Tam ornek ekleme

Asagidaki ornegi mevcut yapina gore duzenleyebilirsin:

```json
{
  "950_2": {
    "projectName": "950 Ada 2 Parsel",
    "themeColor": "#D0BB95",
    "logo": "",
    "assetsPath": "assets/projects/950_2/",
    "exterior": {
      "modelAndroid": "950_2.glb",
      "modelIOS": "950_2.usdz",
      "variants": [
        {
          "name": "3+1",
          "suffix": "",
          "thumbnail": "plan_01.webp"
        }
      ]
    },
    "interior": {
      "startRoom": "salon",
      "floorplanImage": "plan_01.webp",
      "rooms": [
        {
          "id": "salon",
          "name": "Salon",
          "tex": "Salon01.webp",
          "thumbnail": "Salon01.webp",
          "mapCoords": {
            "x": 27,
            "y": 33
          }
        }
      ]
    }
  },
  "1205_4": {
    "projectName": "1205 Ada 4 Parsel",
    "themeColor": "#C8A46A",
    "logo": "",
    "assetsPath": "assets/projects/1205_4/",
    "exterior": {
      "modelAndroid": "1205_4.glb",
      "modelIOS": "1205_4.usdz",
      "variants": [
        {
          "name": "3+1",
          "suffix": "",
          "thumbnail": "plan_01.webp"
        }
      ]
    },
    "interior": {
      "startRoom": "salon",
      "floorplanImage": "plan_01.webp",
      "rooms": [
        {
          "id": "salon",
          "name": "Salon",
          "tex": "Salon01.webp",
          "thumbnail": "Salon01.webp",
          "mapCoords": {
            "x": 25,
            "y": 35
          }
        },
        {
          "id": "mutfak",
          "name": "Mutfak",
          "tex": "Mutfak01.webp",
          "thumbnail": "Mutfak01.webp",
          "mapCoords": {
            "x": 45,
            "y": 55
          }
        }
      ]
    }
  }
}
```

## 5. Alanlar ne ise yariyor

### `projectName`

Kullanicinin gordugu proje adi.

### `themeColor`

Arayuzde kullanilacak ana renk.

### `logo`

Logo dosya adi. Logo yoksa bos birakilabilir:

```json
"logo": ""
```

### `assetsPath`

Bu proje dosyalarinin bulundugu klasor.

Ornek:

```json
"assetsPath": "assets/projects/1205_4/"
```

### `modelAndroid`

Android icin kullanilan `.glb` model dosyasi.

### `modelIOS`

iPhone icin kullanilan `.usdz` model dosyasi.

### `variants`

Dis mekandaki daire tipi secenekleri.

Tek tip varsa tek eleman yeterlidir.

### `startRoom`

Ic mekan ilk hangi odadan acilsin.

Bu deger, `rooms` listesindeki bir `id` ile ayni olmali.

### `floorplanImage`

Ic mekan mini-map veya plan gorseli.

### `rooms`

Panorama odalarin listesi.

Her odada sunlar olmalidir:

- `id`: teknik anahtar
- `name`: ekranda gorunen isim
- `tex`: panorama dosyasi
- `thumbnail`: oda onizleme gorseli
- `mapCoords`: plandaki konum

## 6. En sik yapilan hatalar

### 1. `assetsPath` yanlis yazmak

Yanlis:

```json
"assetsPath": "assets/project/1205_4/"
```

Dogru:

```json
"assetsPath": "assets/projects/1205_4/"
```

### 2. Dosya adi uyusmamasi

JSON'da `Salon01.webp` yazip klasorde `salon01.webp` olursa sorun cikarabilir.

### 3. `startRoom` olmayan bir oda gostermesi

Yanlis:

```json
"startRoom": "giris"
```

Ama `rooms` icinde `giris` yoksa sayfa bozulabilir.

### 4. Son objeden sonra fazla virgul koymak

JSON fazla virgulu kabul etmez.

## 7. Yeni proje ekleme adimlari

1. `projects.json` dosyasini ac
2. En son proje objesinden sonra yeni bir proje objesi ekle
3. Bir onceki proje kapanisindan sonra virgulu unutma
4. Son proje objesinden sonra fazla virgul koyma
5. Kaydet

## 8. Eklemeden sonra test

Sunlari kontrol et:

```text
index.html?id=1205_4
select.html?id=1205_4
exterior.html?id=1205_4
interior.html?id=1205_4
```

Kontrol listesi:

1. Proje adi geliyor mu
2. Dis mekan modeli geliyor mu
3. Panorama odalari geliyor mu
4. Plan gorseli geliyor mu
5. Kirmizi nokta veya oda konumlari dogru mu

## 9. Pratik kopyala-yapistir sablonu

Yeni bir proje eklerken su sablonu kullanabilirsin:

```json
"YENI_ID": {
  "projectName": "Proje Adi",
  "themeColor": "#D0BB95",
  "logo": "",
  "assetsPath": "assets/projects/YENI_ID/",
  "exterior": {
    "modelAndroid": "YENI_ID.glb",
    "modelIOS": "YENI_ID.usdz",
    "variants": [
      {
        "name": "3+1",
        "suffix": "",
        "thumbnail": "plan_01.webp"
      }
    ]
  },
  "interior": {
    "startRoom": "salon",
    "floorplanImage": "plan_01.webp",
    "rooms": [
      {
        "id": "salon",
        "name": "Salon",
        "tex": "Salon01.webp",
        "thumbnail": "Salon01.webp",
        "mapCoords": {
          "x": 25,
          "y": 35
        }
      }
    ]
  }
}
```

## 10. Kisa ozet

Yeni proje ekleme mantigi su:

1. proje klasorunu olustur
2. assetleri koy
3. ayni ID ile `projects.json` a kayit ekle
4. dosya adlarini tek tek kontrol et
5. lokalde test et
6. sonra sunucuya at