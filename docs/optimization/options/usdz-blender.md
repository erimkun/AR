# Blender 5.0 ile USDZ Uretme

Su anda USDZ uretmek icin en guvenli ve guncel yollardan biri Blender 5.0 export akısidir.

## Neden Blender?

- Guncel bir export yolu sunar.
- `.usdz` dogrudan export alabilir.
- Texture downsampling secenekleri vardir.
- Eski Docker tabanli donusturuculere gore daha guvenli bir yoldur.

## Kimler icin uygun?

- iPhone Quick Look icin ayri dosya uretmek isteyenler
- Daha stabil USDZ cikisi isteyenler
- Gorsel kontrolu export oncesi elle yapmak isteyenler

## Basit akis

1. Blender 5.0 kurun.
2. `model-master.glb` dosyasini import edin.
3. Gorsel kontrol yapin.
4. Gerekirse texture boyutlarini dusurun.
5. `File > Export > Universal Scene Description` secin.
6. Cikis uzantisini `.usdz` yapin.
7. Texture downsampling degerini belirleyin.

## Hangi texture boyutunu secmeliyim?

- `2048`: Yakindan bakilan premium modeller
- `1024`: Cogu mobil AR senaryosu icin iyi denge
- `512`: Daha hafif ama daha bulanik olabilir

## Blender export sirasinda dikkat edilecekler

- Mesh zaten yeterince hafifse tekrar sert sadeleştirme yapmayin.
- Transparan materyaller varsa mutlaka gercek cihazda test edin.
- Cok karmasik node agaclari varsa gorunum farki olabilir.

## Avantajlari

- Daha guncel pipeline
- Texture boyutunu export sirasinda kontrol edebilme
- USD ve USDZ ekosistemine daha yakin bir yol

## Dezavantajlari

- Bazi materyaller bire bir ayni gorunmeyebilir
- Elle kontrol gerektirir

## En iyi kullanim sekli

Web icin kullandiginiz cok agresif dosyadan degil, orijinal veya hafif optimize edilmis GLB'den USDZ alin.

En saglikli akıs genelde sudur:

1. `master.glb`
2. `web.glb`
3. `ios.usdz`

## Kisa tavsiye

Eger iOS Quick Look sizin icin onemliyse, USDZ dosyasini ayri uretin ve bunu Blender ile yapin.