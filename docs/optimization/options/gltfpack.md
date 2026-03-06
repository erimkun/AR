# `gltfpack` ile Optimizasyon

`gltfpack`, web odakli cok guclu bir optimizasyon aracidir.

Ozellikle meshopt, quantization ve sahne duzenleme tarafinda gucludur.

## Kimler icin uygun?

- Daha agresif web optimizasyon isteyenler
- Yukleme ve render verimliligini birlikte dusunenler
- Decoder kurulumunu kontrol edebilenler

## Kurulum

Iki yol var:

1. GitHub Releases uzerinden binary indirmek
2. NPM paketi kullanmak

NPM:

```powershell
npm install -g gltfpack
```

## En temel komut

```powershell
gltfpack -i model.glb -o model-packed.glb
```

Bu komut tek basina bile sunlari yapabilir:

- Mesh duzenleme
- Quantization
- Draw call azaltma
- Gereksiz node temizligi
- Daha verimli buffer yerlesimi

## Daha kuvvetli web cikisi

```powershell
gltfpack -i model.glb -o model-packed.glb -cc
```

Bu ne yapar?

- Meshopt tabanli sikistirma uygular.
- Dosya boyutunu daha fazla dusurebilir.

## Texture da kucultmek isterseniz

WebP:

```powershell
gltfpack -i model.glb -o model-packed.glb -cc -tw
```

KTX2:

```powershell
gltfpack -i model.glb -o model-packed.glb -cc -tc
```

## Mesh azaltmak icin

```powershell
gltfpack -i model.glb -o model-packed.glb -cc -si 0.8
```

`0.8` burada, hedef ucgen oranini ifade eder.

## Dikkat edilmesi gerekenler

`gltfpack` bazen sahneyi `gltf-transform`e gore daha fazla degistirir.

Bu yuzden su durumlarda dikkat edin:

- Node isimleri uygulamada kullaniliyorsa
- `extras` verisi onemliyse
- Ozel attribute varsa

Bu durumda su bayraklar lazim olabilir:

- `-kn`
- `-km`
- `-ke`

## `model-viewer` ile kullanirken

Meshopt kullanirsaniz decoder tanimlamaniz gerekir.

Ornek mantik:

```html
<script>
  self.ModelViewerElement = self.ModelViewerElement || {};
  self.ModelViewerElement.meshoptDecoderLocation = 'https://cdn.jsdelivr.net/npm/meshoptimizer/meshopt_decoder.js';
</script>
```

Bu ayar ilk `model-viewer` olusmadan once verilmelidir.

## Artılar

- Cok guclu web optimizasyonu
- Yalnizca dosya boyutu degil, sahne verimliligi de iyilesebilir
- Quantization ve meshopt tarafinda cok basarili

## Eksiler

- Daha dikkatli test ister
- USDZ cikisi icin uygun ana arac degildir
- Bazi projelerde sahne semantigini daha fazla etkileyebilir

## Ne zaman bunu secmeliyim?

Eger ana hedefiniz webde en kucuk ve en hizli GLB ise, `gltfpack` cok iyi bir secenektir.

Ama iOS USDZ tarafini yine ayri pipeline ile cozmeniz gerekir.