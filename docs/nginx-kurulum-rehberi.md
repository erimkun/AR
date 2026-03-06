# Nginx ile Yayina Alma Rehberi

Bu uygulama statik bir web uygulamasi oldugu icin PM2 gerekmez.
Nginx tek basina yeterlidir.

Bu rehberde sunlari yapacagiz:

1. Sunucuya Nginx kurmak
2. Proje dosyalarini sunucuya atmak
3. Nginx ayarini yapmak
4. HTTPS acmak
5. Sonradan yeni proje eklerken ne yapilacagini netlestirmek

Not: Ornekler Ubuntu sunucu icindir.

## 1. Sunucuda hazirlik

Sunucuya SSH ile baglan:

```bash
ssh root@SUNUCU_IP
```

Paketleri guncelle:

```bash
sudo apt update
sudo apt upgrade -y
```

Nginx kur:

```bash
sudo apt install nginx -y
```

Durumu kontrol et:

```bash
sudo systemctl status nginx
```

Calisiyorsa devam et.

## 2. Proje dosyalarini sunucuya koyacagin klasor

Bu ornekte projeyi su klasore koyacagiz:

```bash
/var/www/ar-app
```

Klasoru olustur:

```bash
sudo mkdir -p /var/www/ar-app
```

Yetki ver:

```bash
sudo chown -R $USER:$USER /var/www/ar-app
```

## 3. Lokalden sunucuya dosyalari yukleme

Bilgisayarindaki proje klasorunu sunucuya kopyala.

Windows'tan terminal acip su mantikla gonderebilirsin:

```bash
scp -r AR/* kullanici@SUNUCU_IP:/var/www/ar-app/
```

Eger sunucuda zaten eski dosyalar varsa ve guncelleme yapacaksan, `rsync` daha iyi olur:

```bash
rsync -avz --delete ./ kullanici@SUNUCU_IP:/var/www/ar-app/
```

`--delete` sunucuda artik olmayan eski dosyalari da siler.

## 4. Nginx site ayari

Yeni bir Nginx config dosyasi olustur:

```bash
sudo nano /etc/nginx/sites-available/ar-app
```

Icine sunu yapistir:

```nginx
server {
    listen 80;
    server_name seninalanadin.com www.seninalanadin.com;

    root /var/www/ar-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|webp|gif|svg|ico|mp4|glb|usdz)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    location = /projects.json {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
}
```

Bu ayarin anlami:

- `root /var/www/ar-app;` dosyalarin bulundugu klasor
- `index index.html;` acilis dosyasi
- `try_files ... /index.html;` bazi durumlarda dogrudan acilisi korur
- medya dosyalarina cache verilir
- `projects.json` cache'lenmez, boylece yeni proje eklenince degisiklik daha hizli gorulur

## 5. Nginx config'i aktif et

Link olustur:

```bash
sudo ln -s /etc/nginx/sites-available/ar-app /etc/nginx/sites-enabled/
```

Config dogru mu kontrol et:

```bash
sudo nginx -t
```

Sorun yoksa Nginx'i yeniden yukle:

```bash
sudo systemctl reload nginx
```

## 6. Firewall varsa izin ver

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

## 7. Domain baglama

Domain yonetim panelinden su kayitlari gir:

- `A` kaydi -> `seninalanadin.com` -> sunucu IP
- `A` kaydi -> `www` -> sunucu IP

DNS yayilimi biraz surebilir.

## 8. HTTPS kur

AR ve kamera ozellikleri icin HTTPS cok onemlidir.

Certbot kur:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

SSL al:

```bash
sudo certbot --nginx -d seninalanadin.com -d www.seninalanadin.com
```

Komut senden e-posta ve onay ister. Tamamlayinca Nginx config'ini otomatik gunceller.

Test et:

```bash
https://seninalanadin.com
```

## 9. Son kontrol listesi

Sunlar calisiyor olmali:

1. Ana sayfa aciliyor mu
2. `projects.json` geliyor mu
3. `assets/projects/...` altindaki dosyalar aciliyor mu
4. iPhone tarafinda `usdz` dosyasi indirilebiliyor mu
5. Android tarafinda `glb` dosyasi acilabiliyor mu
6. Panorama gorselleri yukleniyor mu

## 10. Sonradan yeni proje eklerken ne yapacaksin

Bu uygulama statik oldugu icin yeni proje eklemek icin Nginx restart gerekmez.

Yapacagin islem sirasiyla su:

1. Lokal bilgisayarinda yeni proje klasorunu hazirla
2. `assets/projects/YENI_ID/` klasorune tum dosyalari koy
3. `projects.json` icine yeni projeyi ekle
4. Lokalde test et
5. Sunucuya sadece guncel dosyalari at

Ornek:

```bash
rsync -avz --delete ./ kullanici@SUNUCU_IP:/var/www/ar-app/
```

Bu kadar.

Nginx acisindan ekstra bir sey yapman gerekmez.

Sadece istersen cache temizligi icin su komutu kullanabilirsin:

```bash
sudo systemctl reload nginx
```

Ama bu cogunlukla zorunlu degildir.

## 11. En basit operasyon modeli

Su yontem senin senaryon icin yeterli:

1. Modelci dosyalari sana verir
2. Sen `assets/projects/PROJE_ID/` klasorunu olusturursun
3. Sen `projects.json` dosyasini guncellersin
4. Lokalde kontrol edersin
5. `rsync` veya `scp` ile sunucuya atarsin

Bu model az sayida proje icin gayet yeterlidir.

## 12. Ileride is buyurse ne yapabilirsin

Eger ileride proje sayisi artarsa su sirayla buyutmek daha mantiklidir:

1. Her proje icin ayri manifest dosyasi kullan
2. Tum manifestleri birlestirip otomatik `projects.json` ureten script yaz
3. Staging ortam kur
4. En son ihtiyac olursa admin panel yap

Ilk asamada admin panel yapmak genelde gereksiz maliyet olur.

## 13. Kisa ozet

- Bu uygulama icin Nginx yeterli
- PM2 gerekmiyor
- Dosyalari `/var/www/ar-app` altina koy
- Nginx `root` olarak bu klasoru gostersin
- HTTPS ac
- Yeni proje geldiginde dosyalari ve `projects.json` u guncelle, tekrar sunucuya at
- Cogu durumda restart gerekmez