# GLB ve USDZ Kucultmenin En Basit Hali

Bu dosya, teknik detaya bogulmadan en saglikli yoldan ilerlemek isteyenler icin yazildi.

## En kisa cevap

Buyuk modelleri bozmadan kucultmek istiyorsaniz tek bir dosya ile her seyi cozmeye calismayin.

Sunlari ayri ayri uretin:

1. Orijinal dosya
2. Web icin GLB
3. iPhone icin USDZ

## Neden ayri dosya lazim?

Cunku web icin iyi olan her sey, USDZ icin iyi olmayabilir.

Ornek:

- WebP web icin iyi olabilir.
- Draco web icin iyi olabilir.
- Ama USDZ donusumunde sorun cikarabilir.

Bu yuzden web ve iOS cikisini ayri almak en temiz yoldur.

## En kolay ve en guvenli yol

### Web icin

`gltf-transform` kullanin.

### USDZ icin

Blender 5.0 ile `.usdz` export alin.

## Adim adim ne yapmaliyim?

### 1. Orijinal modeli saklayin

Dosyanizin bir kopyasi mutlaka dursun.

Ornek:

- `villa-master.glb`

### 2. Modelin ne kadar agir oldugunu kontrol edin

Asagidaki komutla modeli inceleyin:

```powershell
gltf-transform inspect "villa-master.glb"
```

Bu size sunu soyler:

- Model texture agirlikli mi?
- Geometri agirlikli mi?
- Gereksiz veri var mi?

### 3. Web icin optimize GLB olusturun

Ilk deneme icin bu komut yeterli olur:

```powershell
gltf-transform optimize "villa-master.glb" "villa-web.glb" --compress draco --texture-compress webp --texture-size 1024
```

Bu ne yapar?

- Geometriyi sikistirir.
- Dokulari WebP yapar.
- Dokulari 1024 boyutuna indirir.

### 4. Sonuca bakin

Sunlari kontrol edin:

- Model acilirken bozulma var mi?
- Doku fazla bulanik oldu mu?
- Kenarlarda kirilma var mi?

Her sey iyiyse devam edin.

### 5. USDZ icin ayri cikis alin

Web icin cikardiginiz dosyayi dogrudan USDZ'ye cevirmeyin.

Blender'da su sekilde ilerleyin:

1. GLB dosyasini acin.
2. Gerekirse texture boyutlarini dusurun.
3. `File > Export > Universal Scene Description`
4. Cikis uzantisini `.usdz` yapin.
5. Texture downsampling secin.

## Hangi texture boyutunu secmeliyim?

- Cok detayli bina, yakin inceleme: `2048`
- Normal mobil AR kullanim: `1024`
- Cok hafif dosya lazimsa: `512`

Genelde ilk deneme icin `1024` iyi baslangictir.

## Ne zaman sadece texture kucultmek yeter?

Eger modeliniz buyuk ama geometri normal gorunuyorsa, asıl sorun genelde texture'lardadir.

Bu durumda sadece texture boyutunu dusurmek bile cok fark yaratir.

## Ne zaman geometriyi de azaltmak gerekir?

Sunlar varsa gerekir:

- Model cok gec aciliyorsa
- Telefonda donuyorsa
- Dosya hala cok buyukse

Bu durumda ek olarak mesh simplification uygulanir.

Ama dikkat:

Mesh azaltma kaliteyi gercekten bozabilir.

Bu yuzden once texture optimizasyonunu deneyin.

## En pratik karar listesi

### Dosya buyuk ama kalite cok onemliyse

1. Texture size dusur
2. Lossless temizlik yap
3. Gerekirse hafif Draco uygula

### Dosya cok buyukse ve mobilde zorlaniyorsa

1. Texture size dusur
2. Draco veya Meshopt uygula
3. Gerekirse hafif mesh azalt

### iPhone tarafinda sorun varsa

1. Web cikisini kullanma
2. Ayri USDZ uret
3. Blender export kullan

## Bu projeler icin en mantikli hedef

Genelde sunu hedefleyin:

- Web GLB: olabildigince kucuk
- USDZ: biraz daha buyuk olabilir ama stabil olsun

Yani:

- Web dosyasi kucuk olmalı
- USDZ dosyasi sorunsuz olmali

## Tek cumlelik tavsiye

Web icin `gltf-transform`, USDZ icin Blender kullanin; tek dosyayla her platformu cozmeye calismayin.