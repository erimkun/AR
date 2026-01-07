Harika. Bir **Sistem Mimarı** olarak, teknik detayları bilmeyen ama elinde senin tasarım dosyaların (UI/UX) olan bir yazılımcıya (Junior veya Senior fark etmeksizin) işi teslim edecek o **"Master Dokümanı"** hazırladım.

Bu metni kopyalayıp doğrudan yazılımcına e-posta olarak atabilirsin veya bir PDF dosyasına çevirip "Proje Teknik Şartnamesi" olarak verebilirsin.

---

# 📁 PROJE: Dinamik WebXR Gayrimenkul Görüntüleme Platformu

**Teknik Gereksinim ve Sistem Mimarisi Dokümanı (TRD)**

### 1. Proje Özeti

Bu proje, web tarayıcısı üzerinden çalışan (App-less), iOS ve Android uyumlu, **Artırılmış Gerçeklik (AR)** tabanlı bir mimari görselleştirme platformudur.
Sistem, "Single Page Application (SPA)" değil, performans optimizasyonu (Memory Management) amacıyla **Multi-Page Application (MPA)** yapısında olacaktır.

**En Kritik Özellik:** Sistem **"Data-Driven" (Veri Güdümlü)** çalışacaktır. Tek bir kod yapısı (Template) olacak, ancak URL'den gelen `ProjectID` parametresine göre içerik (Logolar, Modeller, Renkler) dinamik olarak değişecektir.

---

### 2. Teknoloji Yığını (Tech Stack)

* **Platform:** Mobil Web (Safari & Chrome).
* **Protokol:** HTTPS (Kamera izinleri için zorunlu).
* **Backend/Data:** Statik JSON Dosyası (Database yerine kullanılacak).
* **Frontend Modülleri:**
* **Dış Mekan:** Google `<model-viewer>` (v3.0+).
* **İç Mekan:** Three.js + WebXR API (DeviceOrientationControls).
* **Styling:** Vanilla CSS veya TailwindCSS (Tasarım dosyalarına sadık kalınacak).



---

### 3. Sistem Mimarisi ve Veri Akışı

Uygulama 3 ana HTML sayfasından oluşur. Sayfalar arası veri taşıma işlemi **URL Query Parameters** ile sağlanır.

#### A. Veri Yapısı (`projects.json`)

Tüm proje konfigürasyonu kök dizindeki bir JSON dosyasından okunacaktır. Hard-code (elle yazılmış) içerik **olmayacaktır**.

```json
/* projects.json Örneği */
{
  "1101_8": {
    "projectName": "Vadi İst - A Blok Daire 8",
    "themeColor": "#FF5733",
    "assetsPath": "/assets/projects/1001_8/",
    "exterior": {
      "modelAndroid": "bina.glb",
      "modelIOS": "bina.usdz",
      "variants": [
         {"name": "2+1", "suffix": "_21"}, 
         {"name": "3+1", "suffix": "_31"}
      ]
    },
    "interior": {
      "startRoom": "salon",
      "rooms": [
        {"id": "salon", "tex": "salon_360.jpg", "mapCoords": {"x": 50, "y": 30}},
        {"id": "mutfak", "tex": "mutfak_360.jpg", "mapCoords": {"x": 20, "y": 80}}
      ]
    }
  }
}

```

#### B. Klasör Yapısı (File Structure)

Asset yönetimi karmaşasını önlemek için aşağıdaki yapı zorunludur:

* `/public/assets/projects/{PROJECT_ID}/` (Her projenin modelleri kendi klasöründe).

---

### 4. Sayfa Bazlı İş Akışı (Development Flow)

Yazılımcı, tasarımdaki (Stitch/Sketch/Figma) görsel öğeleri aşağıdaki mantıkla koda dökecektir:

#### 📄 Sayfa 1: Landing (`index.html`)

* **Giriş URL:** `domain.com/index.html?id=1001_8`
* **Logic:**
1. Sayfa yüklendiğinde URL'den `id` parametresini oku.
2. `projects.json` dosyasını fetch et ve ilgili ID'nin verisini çek.
3. DOM manipülasyonu ile Başlık, Logo ve "Hoşgeldiniz" metnini güncelle.


* **Aksiyon:**
* "Dış Mekan" butonu -> `exterior.html?id=1001_8` adresine yönlendirir.
* "İç Mekan" butonu -> `interior.html?id=1001_8` adresine yönlendirir.



#### 📄 Sayfa 2: Dış Mekan AR (`exterior.html`)

* **Görevi:** Masaüstü maket deneyimi (Tabletop AR).
* **Kütüphane:** `<model-viewer>`
* **Logic:**
* JSON'dan gelen `assetsPath` + `modelAndroid` birleştirilerek `src` attribute'u oluşturulur.
* **Alt Bar (UI):** Tasarımdaki "Daire Tipi Seçimi" butonlarına basıldığında sayfa yenilenmez, sadece modelin kaynağı (`src`) değiştirilir.


* **Kritik Not:** iOS (.usdz) ve Android (.glb) kaynakları ayrı tanımlanmalıdır.

#### 📄 Sayfa 3: İç Mekan AR (`interior.html`) - *En Karmaşık Kısım*

* **Görevi:** 360 Derece Panoramik Tur + Zemin Sabitleme.
* **Kütüphane:** Three.js
* **Logic:**
1. **İzinler:** Sayfa açılışında `DeviceOrientation` ve `Camera` izni için açık bir buton ("Deneyimi Başlat") konulmalıdır (iOS 13+ zorunluluğu).
2. **Portal/Anchor:** WebXR Hit-Test kullanılarak kullanıcı zemine dokunduğunda sahne (Küre/Sphere geometry) o noktaya sabitlenir.
3. **Sensör Entegrasyonu:**
* **Jiroskop:** Telefon döndükçe kamera açısı döner.
* **Pusula (HUD):** Cihazın manyetik kuzey (`alpha` veya `webkitCompassHeading`) verisi okunur. UI üzerindeki pusula ikonu, bu değerin tersi yönünde CSS `rotate()` ile döndürülür.


4. **Mini-Map (HUD):** JSON'daki `mapCoords` verisi kullanılarak, "kırmızı nokta" (user dot) harita görseli üzerinde ilgili konuma (`top/left`) CSS ile taşınır.



---

### 5. Tasarımcıdan Notlar & Kısıtlamalar

1. **Memory Management (Bellek Yönetimi):** Mobil tarayıcılarda RAM kısıtlıdır. Bu yüzden SPA yerine MPA (Ayrı sayfalar) seçilmiştir. Kullanıcı "Geri" butonuna bastığında tarayıcının belleği tamamen boşalttığından emin olunmalıdır.
2. **UI Katmanı:** UI elementleri (Butonlar, Harita, Pusula) Canvas/WebGL içine gömülmeyecek, HTML/CSS katmanı olarak Canvas'ın üzerinde (`z-index: 999`) yer alacaktır.
3. **Loading Screen:** 3D modeller ve yüksek çözünürlüklü panoramalar yüklenirken, tasarım dosyasında belirttiğim "Yükleniyor..." animasyonu mutlaka gösterilmelidir.

---

### 6. Teslimat

* Tüm ikonlar SVG, görseller PNG/JPG olarak ekteki tasarım dosyasındadır.
* Projeyi geliştirirken test için `1001_8` ID'si ile örnek bir veri seti oluşturarak ilerleyiniz.

---

