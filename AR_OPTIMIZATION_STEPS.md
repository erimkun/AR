# AR Model Optimizasyon ve Dönüşüm Rehberi

Bu belge, 3D modellerinizi (GLB) web ve AR (iOS/Android) kullanımı için nasıl optimize edeceğinizi ve dönüştüreceğinizi açıklar.

## 1. Gerekli Araçlar

Aşağıdaki araçların bilgisayarınızda kurulu olması gerekir:

1.  **Node.js & npm**: [Node.js İndir](https://nodejs.org/)
2.  **gltf-transform** (Komut satırı aracı):
    ```powershell
    npm install -g @gltf-transform/cli
    ```
3.  **Docker Desktop** (USDZ dönüşümü için): [Docker İndir](https://www.docker.com/products/docker-desktop/)
    *   Kurulumdan sonra Docker uygulamasını başlatın (`Engine running` yazmalıdır).
    *   İmajı çekin: `docker pull leon/usd-from-gltf`

---

## 2. Web İçin Optimizasyon (Maksimum Sıkıştırma)

Web sitenizde (`<model-viewer>` vb.) kullanmak için en küçük dosya boyutunu hedefler. **Draco** (geometri) ve **WebP** (doku) sıkıştırması kullanır.

**Komut:**
```powershell
# Orijinal dosyayı (22MB) -> Web için optimize et (6.75MB)
gltf-transform optimize "girdi.glb" "cikti_web.glb" --compress draco --texture-compress webp --texture-size 1024 --simplify-ratio 0.5
```
*   `--texture-size 1024`: Dokuları 1024px'e küçültür.
*   `--compress draco`: Geometriyi sıkıştırır (GLB boyutunu çok düşürür).
*   `--texture-compress webp`: Dokuları WebP formatına çevirir (JPEG'den çok daha küçüktür).

---

## 3. iOS (USDZ) İçin Dönüşüm

iOS (QuickLook), WebP formatını veya Draco sıkıştırmasını her zaman desteklemez. Bu yüzden USDZ için önce uyumlu bir GLB hazırlamalı, sonra Docker ile dönüştürmeliyiz.

### Adım 3.1: USDZ Uyumlu GLB Hazırlama
Sıkıştırılmış dosyayı açıp standart formatlara (JPEG/PNG) geri döndürürüz.

**Komut:**
```powershell
# WebP/Draco sıkıştırmasını kaldır ve dokuları hazırla
gltf-transform optimize "optimize_edilmis.glb" "cikti_uyumlu.glb" --texture-compress false --compress false
```
*   `--texture-compress false`: WebP dokularını çözerek JPEG/PNG'ye çevirir.
*   `--compress false`: Draco sıkıştırmasını kaldırır (Dönüştürücülerin okuyabilmesi için).

### Adım 3.2: Docker ile USDZ'ye Çevirme
Docker konteynerini kullanarak dönüşümü güvenle yapın.

**Komut (PowerShell):**
```powershell
# Docker ile USDZ üret
docker run --rm -v ${PWD}:/data leon/usd-from-gltf /data/cikti_uyumlu.glb /data/final_model.usdz
```

---

## Özet İşlem Akışı (PowerShell Script)

Hepsini tek seferde yapmak için kullanabileceğiniz script:

```powershell
# 1. Web Versiyonu Oluştur (WebP + Draco)
gltf-transform optimize "model.glb" "model_web.glb" --compress draco --texture-compress webp --texture-size 1024

# 2. USDZ için Geçici Dosya Oluştur (WebP'yi aç)
gltf-transform optimize "model_web.glb" "temp_for_usdz.glb" --texture-compress false --compress false

# 3. USDZ Dönüşümü Yap (Docker)
docker run --rm -v ${PWD}:/data leon/usd-from-gltf /data/temp_for_usdz.glb /data/model.usdz

# 4. Geçici dosyayı sil
Remove-Item "temp_for_usdz.glb"
```
