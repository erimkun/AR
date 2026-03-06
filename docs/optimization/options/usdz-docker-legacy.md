# `leon/usd-from-gltf` ile USDZ Donusumu

Bu yontem uzun suredir bilinen bir kisayoldur. Ama artik ana cozum olarak onerilmez.

## Neden artik ana cozum degil?

Docker Hub bilgisinde imajin uzun suredir guncellenmedigi gorunuyor.

Bu ne demek?

- Yeni iOS davranislarina karsi daha riskli olabilir.
- Yeni materyal veya texture senaryolarinda beklenmedik sonuc verebilir.
- Uzun vadeli ana pipeline yapmak icin zayif kalabilir.

## Ne zaman hala kullanilabilir?

- Eski projede bu akıs zaten varsa
- Hizli deneme yapmak istiyorsaniz
- Blender kullanmak istemiyorsaniz

## Kurulum

```powershell
docker pull leon/usd-from-gltf
```

## Guvenli kullanma mantigi

Web icin optimize edilmis GLB'yi dogrudan buna vermeyin.

Onun yerine:

1. Orijinal veya hafif optimize edilmis bir GLB hazirlayin.
2. WebP, KTX2, Draco gibi web odakli seyleri cikararak donusturun.

## Ornek akis

### 1. Donusume uygun GLB hazirla

```powershell
gltf-transform optimize "model-master.glb" "model-usdz-source.glb" --texture-compress false --compress false
```

### 2. USDZ uret

```powershell
docker run --rm -v ${PWD}:/data leon/usd-from-gltf /data/model-usdz-source.glb /data/model-ios.usdz
```

## Riskleri

- Donusum basarisiz olabilir.
- Materyal farklari olusabilir.
- Yeni cihazlarda davranis farki gorebilirsiniz.

## Hangi durumda birakmaliyim?

Sunlardan biri varsa Blender yoluna gecin:

- Materyaller tutarsizsa
- Quick Look'ta model sorunluysa
- Donusum siki hata veriyorsa
- Proje uzun sure yasayacaksa

## Kisa karar

Bu yontem acil veya gecici cozum olabilir. Ama yeni ana pipeline olarak Blender daha dogru secenektir.