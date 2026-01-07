# 🏠 WebXR Gayrimenkul Görüntüleme Platformu

Web tarayıcısı üzerinden çalışan, iOS ve Android uyumlu Artırılmış Gerçeklik (AR) tabanlı mimari görselleştirme platformu.

## 🚀 Hızlı Başlangıç

### Localhost'ta Test Etme

1. **VS Code Live Server kullanarak:**
   - VS Code'da "Live Server" eklentisini yükleyin
   - `index.html` dosyasına sağ tıklayın → "Open with Live Server"
   - Tarayıcıda açılacaktır

2. **Node.js ile:**
   ```bash
   npx serve .
   ```

3. **Python ile:**
   ```bash
   python -m http.server 8000
   ```

### AR Özelliklerini Test Etme (Localhost)

AR özellikleri için HTTPS gereklidir. Localhost'ta test için:

**Chrome:**
1. `chrome://flags` adresine gidin
2. "Insecure origins treated as secure" arayın
3. `http://localhost:3000` veya kullandığınız portu ekleyin
4. Chrome'u yeniden başlatın

**Alternatif:** `ngrok` kullanarak HTTPS tunnel oluşturun:
```bash
npx ngrok http 3000
```

## 📁 Klasör Yapısı

```
/ar
├── index.html              # Landing/Hoşgeldiniz sayfası
├── select.html             # Dış/İç mekan seçimi
├── exterior.html           # Dış mekan AR (model-viewer)
├── interior.html           # İç mekan 360° panorama (Three.js)
├── projects.json           # Proje verileri
├── README.md
├── css/
│   └── styles.css          # Global stiller
├── js/
│   └── app.js              # Ortak fonksiyonlar
└── assets/
    └── projects/
        └── 1101_8/         # Proje asset'leri
            ├── logo.png
            ├── bina.glb        # Android 3D model
            ├── bina.usdz       # iOS 3D model
            ├── bina_11.glb     # 1+1 varyant
            ├── bina_21.glb     # 2+1 varyant
            ├── bina_31.glb     # 3+1 varyant
            ├── plan_11.png     # Plan görselleri
            ├── plan_21.png
            ├── plan_31.png
            ├── floorplan.png   # Kat planı
            ├── salon_360.jpg   # 360° panoramalar
            ├── mutfak_360.jpg
            ├── yatak_360.jpg
            ├── salon_thumb.jpg # Thumbnails
            ├── mutfak_thumb.jpg
            └── yatak_thumb.jpg
```

## 🔧 Kullanım

### URL Yapısı

Tüm sayfalar `id` query parametresi ile çalışır:

- `index.html?id=1101_8` - Hoşgeldiniz ekranı
- `select.html?id=1101_8` - Deneyim seçimi
- `exterior.html?id=1101_8` - Dış mekan AR
- `interior.html?id=1101_8` - İç mekan 360° tur

### Yeni Proje Ekleme

1. `projects.json` dosyasına yeni proje ekleyin:

```json
{
  "YENI_ID": {
    "projectName": "Proje Adı",
    "themeColor": "#D0BB95",
    "logo": "logo.png",
    "assetsPath": "/assets/projects/YENI_ID/",
    "exterior": {
      "modelAndroid": "bina.glb",
      "modelIOS": "bina.usdz",
      "variants": [
        { "name": "1+1", "suffix": "_11", "thumbnail": "plan_11.png" }
      ]
    },
    "interior": {
      "startRoom": "salon",
      "floorplanImage": "floorplan.png",
      "rooms": [
        {
          "id": "salon",
          "name": "Salon",
          "tex": "salon_360.jpg",
          "thumbnail": "salon_thumb.jpg",
          "mapCoords": { "x": 50, "y": 30 }
        }
      ]
    }
  }
}
```

2. `/assets/projects/YENI_ID/` klasörüne asset'leri ekleyin

## 📱 Desteklenen Cihazlar

| Platform | Tarayıcı | AR Desteği |
|----------|----------|------------|
| iOS 13+ | Safari | ✅ USDZ (Quick Look) |
| Android 8+ | Chrome | ✅ WebXR / Scene Viewer |
| Desktop | Chrome/Firefox | ⚠️ 3D görüntüleme (AR yok) |

## 🎨 Tema Özelleştirme

Her proje için `themeColor` özelleştirilebilir. Varsayılan renk paleti:

- **Primary:** `#D0BB95` (Altın/Bej)
- **Background Dark:** `#1d1a15`
- **Background Light:** `#f7f7f6`

## 📊 Yapılacaklar (TODO)

- [ ] Google Analytics entegrasyonu
- [ ] WebXR Hit-Test ile zemin algılama (interior.html)
- [ ] Oda geçiş animasyonları
- [ ] Hotspot'lar (tıklanabilir noktalar)
- [ ] Ses rehberliği

## 🚀 Production Deploy (Vercel)

1. GitHub'a push edin
2. [Vercel](https://vercel.com) hesabı oluşturun
3. "New Project" → GitHub repo'nuzuseçin
4. Deploy!

Vercel otomatik olarak HTTPS sağlar, AR özellikleri direkt çalışır.

## 📄 Lisans

MIT License

---

**Geliştirici Notları:**
- Tüm UI elementleri Canvas/WebGL dışında HTML/CSS katmanında (`z-index: 999`)
- MPA yapısı sayesinde sayfa geçişlerinde bellek temizlenir
- iOS 13+ için DeviceOrientation izni buton ile alınmalıdır
