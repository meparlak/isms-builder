# FR/US Spec → isms-builder Gap Analizi

**Tarih:** 2026-07-14
**Kapsam:** Ekte verilen "ISMS Platform (Monolit) — Kullanıcı Hikayeleri ve Fonksiyonel Gereksinimler" dokümanının (13 modül, CC-* çapraz kesenler) mevcut `isms-builder` (Node/Express, JSON/SQLite/Knex, vanilla JS SPA) kod tabanına, **sıfırdan yazmadan**, uygulanabilirlik analizi.

> **Not:** Spesifikasyon "ASP.NET Core / MSSQL" varsayımıyla yazılmış, ancak kullanıcı hikayeleri ve fonksiyonel gereksinimler teknolojiden bağımsızdır. Bu rapor FR/US'leri **mevcut Node/Express + SQL stack'ine** eşler; ASP.NET Core'a özgü maddeler (JWKS/RS256, `DbContext`, `BackgroundService`, MediatR, NetArchTest) yerine Node ekosistemindeki muadilleri önerilir.

---

## 0. Yönetici Özeti

| Soru | Cevap |
|---|---|
| Sıfırdan mı yazmalı, mevcut sistem mi geliştirilmeli? | **Mevcut sistem geliştirilmeli.** isms-builder'ın domain modelleri (risk, varlık, SOA, GDPR, eğitim, denetim) spesifikasyonun modülleriyle **%60-70 örtüşüyor**; temel CRUD + auth + dosya yükleme + SMTP zaten var. |
| En büyük boşluk nerede? | **Çapraz-kesen gereksinimler (CC-*)**: GUIDv7 kimlik, hash-zincirli tamper-evident denetim izi, temporal (system-versioned) tablo geçmişi, domain event + outbox, birim-bazlı (unit-scoped) yetkilendirme. Bunların hiçbiri şu an yok. |
| Türkçe arayüz eklemek zor mu? | **Hayır — altyapı zaten hazır.** `ui/i18n/t.js` + `ui/i18n/translations.js` içinde EN/DE/FR/NL için anahtar-bazlı bir çeviri motoru mevcut. Türkçe eklemek `SUPPORTED` dizisine `'tr'` eklemek + ~173 KB'lık sözlüğe `tr:` alanı eklemekten ibaret. Kod tarafında (route, değişken, fonksiyon adları) hiçbir şey İngilizce dışına çıkmıyor zaten. |
| Öncelik nasıl olmalı? | Faz 1: Türkçe dil (düşük risk, yüksek görünürlük) + kimlik/denetim izi altyapısı (yüksek risk, temel taş). Faz 2+: modül modül FR kapatma. |

---

## 1. Türkçe Dil Ekleme — Somut Adımlar

Mevcut mekanizma (`ui/i18n/t.js:9`):
```js
const SUPPORTED = ['en', 'de', 'fr', 'nl'];
```
ve `ui/i18n/translations.js` içinde her anahtar şu formatta:
```js
loginTitle: { de: '...', en: '...', fr: '...', nl: '...' }
```

**Yapılacaklar:**
1. `SUPPORTED`'a `'tr'` ekle; `detectBrowserLang()`'a `if (nav.startsWith('tr')) return 'tr'` satırı ekle.
2. `translations.js`'teki **her** anahtara `tr: '...'` alanı ekle (muhtemelen 400-600 anahtar — dosya 173 KB). Bu satır satır çeviri işi, kod değişikliği değil; bir script ile (anahtar listesini çıkarıp toplu çeviri, sonra elle QA) hızlandırılabilir.
3. Login ekranına dil seçici zaten var gibi görünüyor (`initLang`/`setLang` akışı) — kontrol edilmeli, yoksa küçük bir dropdown eklenir.
4. Tarih/sayı formatlama varsa (`toLocaleDateString` vb.) `tr-TR` locale'i ile test edilmeli.
5. **Kod tarafı değişmez:** route adları, DB kolonları, fonksiyon isimleri İngilizce kalmaya devam eder — spesifikasyonun CC-LOC.1 gereksinimiyle birebir uyumlu ("arayüz metinleri yerelleştirilebilir, çekirdek modeller dile bağlı değil").

**Efor:** Küçük-orta (çoğunlukla çeviri emeği, mimari değişiklik yok). **Risk:** Düşük.

---

## 2. Modül Eşleme Tablosu (Spec'in 13 modülü ↔ isms-builder mevcut route/store'ları)

| Spec Modülü | isms-builder karşılığı | Kapsama | Not |
|---|---|---|---|
| **IDN** (Kimlik) | `routes/auth.js`, `server/auth.js`, `rbacStore.js` | Kısmi | Kullanıcı/rol var; **birim (unit) ağacı yok**, süreli atama yok, sorumluluk devri yok, MFA var (README'de TOTP belirtiliyor) |
| **RSK** (Risk) | `routes/risks.js`, `db/stores/riskStore.js`, `db/database.js` (risks tablosu) | İyi | G-B-E'den türetilmiş değer yok, **artık risk (residual) alanı yok**, değerlendirme turu/snapshot yok, tehdit/zafiyet kütüphanesi yok |
| **AST** (Varlık) | `routes/assets.js`, `db/stores/assetStore.js` | Orta | Kripto varlık, ziyaretçi kaydı, Excel toplu import muhtemelen yok/kısmi — kontrol edilmeli |
| **CMP** (Uyum/SOA) | `routes/soa.js`, `routes/legal.js`, `db/database.js` (soa_controls) | İyi | SOA temel var; veri saklama/imha planı (`gdpr` içinde kısmen), kilit mekanizması (risk-bağlı kontrol kilidi) yok |
| **AUD** (Tetkik) | `routes/findings.js`? (isim tahmini) | Belirsiz | Log kaynağı envanteri, log inceleme (append-only) modülü **yok** |
| **INC** (Olay) | Yok / `routes/` içinde bulunamadı | **Eksik** | Wizard tarzı bildirim, SLA/eskalasyon, olay→CAPA otomatik akışı **yeni geliştirme** |
| **DOC** (Doküman) | `routes/templates.js`, `routes/guidance.js` | Kısmi | `templates` tablosu var (sürüm, onay, gözden geçirme alanları mevcut — `db/database.js:31-50`); resmi onay akışı ve tebliğ (okundu takibi) **yok** |
| **PRJ** (Proje/SDLC) | Yok | **Eksik** | Yeni geliştirme |
| **VND** (Tedarikçi) | `routes/suppliers.js` | Kısmi | Taahhütname geçerlilik takibi kontrol edilmeli |
| **TRN** (Eğitim) | `routes/training.js`, `db/database.js` (training tablosu) | İyi | Yetkinlik matrisi, "yedeksiz kritik rol" analizi **yok** |
| **GOV** (Yönetişim) | `routes/governance.js`, `routes/goals.js`, `routes/bcm.js`, `routes/calendar.js` | Orta | Kapsam versiyonlama, YGG, CAPA/aksiyon merkezi, iş sürekliliği bir arada dağınık — **merkezi CAPA modeli yok** |
| **NOT** (Bildirim) | `server/notifier.js`, `server/mailer.js` | Kısmi | Var ama domain-event tetiklemeli değil, muhtemelen doğrudan çağrı |
| **ATT** (Ek/Kanıt) | `multer` kullanımı (route'larda dağınık) | Kısmi | Merkezi "Kanıt Havuzu" görünümü yok, **zararlı içerik taraması yok** (ClamAV vb. entegrasyonu gerekli) |

**Sonuç:** IDN, RSK, AST, CMP, TRN, GOV, DOC çekirdekleri **var ve geliştirilebilir**. INC ve PRJ **sıfırdan modül** gerektiriyor. AUD'un log-inceleme kısmı ve ATT'nin tarama kısmı yeni.

---

## 3. Çapraz-Kesen Gereksinimler (CC-*) — En Kritik Boşluklar

Bunlar spec'in "faz-1'de eksiksiz olmalı" dediği, sonradan eklenmesi pahalı olan kısımlar (bkz. spec §3.4).

### CC-ID — Kimlik Üretimi
- **Mevcut:** `${prefix}_${Date.now()}_${random}` (bkz. `db/stores/riskStore.js:6`, `db/jsonStore.js:51`) — zaman damgalı, tahmin edilebilir, IDOR'a açık.
- **Gereken:** UUIDv7 (Node 20+'ta `crypto.randomUUID()` v4 üretir; v7 için `uuid` npm paketi — `uuidv7()` — veya kendi implementasyonu gerekir). Node 24 kullanıldığı için native fark yok, paket eklenmeli.
- **Değişiklik boyutu:** Orta — her `makeId()`/`genId()` fonksiyonunun değiştirilmesi + var olan JSON/SQLite kayıtları için **migrasyon** (eski ID'ler `TEXT PRIMARY KEY` olduğundan tip sorunu yok, ama format tutarlılığı için yeni kayıtlar UUIDv7 formatında olmalı).

### CC-TRX — İşlem Bütünlüğü ve Domain Event
- **Mevcut:** Route handler'lar büyük olasılıkla doğrudan store fonksiyonlarını çağırıyor, transaction sarmalayıcısı yok (özellikle JSON backend'de **transaction kavramı yapısal olarak yok**).
- **Gereken:** SQLite/Knex modunda `db.transaction()` (better-sqlite3 senkron transaction API'si var) veya Knex `trx`. JSON backend'de gerçek transaction imkansız — **bu, JSON backend'in production için spec'e uygun olamayacağı anlamına gelir.**
- **Öneri:** Spec'in tamper-evident audit + transaction bütünlüğü gereksinimleri **SQLite veya Postgres backend'ini zorunlu kılar**; JSON backend yalnız demo/dev modunda kalmalı.
- **Domain event:** Node'da hafif bir in-process event emitter (Node'un yerleşik `EventEmitter`'ı, veya `mitt` gibi küçük bir kütüphane) yeterli; MediatR'ın karşılığı budur. Handler'lar aynı DB transaction'ı içinde çalışacak şekilde tasarlanmalı (senkron SQLite ile bu kolay; Postgres/Knex'te transaction context'i event handler'a taşımak gerekir).
- **Outbox:** Yeni bir `outbox` tablosu + `setInterval`/`node-cron` tabanlı bir worker (BackgroundService karşılığı) — orta efor.

### CC-AUD — Denetim İzi (Çift Katman, Tamper-Evident)
- **Mevcut:** Yok görünüyor (araştırma kapsamında `audit_log` benzeri bir yapı bulunamadı; `db/stores/auditStore.js` var ama içeriği bu oturumda incelenmedi).
- **Gereken:**
  1. **Temporal geçmiş:** MSSQL system-versioned table'ın SQLite/Postgres karşılığı yok — **elle uygulanmalı**: her `UPDATE`'te eski satırı bir `*_history` tablosuna kopyalayan trigger (SQLite trigger desteği var) veya uygulama katmanında "önce history'e yaz, sonra update et" deseni.
  2. **Hash-zincirli eylem kaydı:** Basit — her INSERT'te `hash = SHA256(prev_hash + serialized_row)` hesapla, Node'un yerleşik `crypto` modülüyle. Yazma sıralaması için SQLite'ta zaten tek yazıcı (WAL modda bile yazma serileşir) — bu spec'in en çok endişelendiği "eşzamanlı yazımda zincir bozulması" riski **SQLite'ta düşük**, Postgres/Knex'te satır kilidi (`SELECT ... FOR UPDATE`) gerekir.
  3. **DB-seviyesinde UPDATE/DELETE reddi:** SQLite dosya bazlı olduğu için uygulama kullanıcısı zaten DB'ye doğrudan erişemiyor (yalnız uygulama üzerinden) — bu gereksinim mimari olarak zaten kısmen sağlanıyor, ama **uygulama kodunda** audit tablosuna UPDATE/DELETE çağıran bir fonksiyon **hiç yazılmamalı** (kod incelemesiyle garanti edilir, DB-level GRANT sistemi SQLite'ta yok).

### CC-AUT — Kimlik Doğrulama/Yetkilendirme
- **Mevcut:** JWT + bcrypt (`jsonwebtoken`, `bcryptjs`), muhtemelen basit rol kontrolü.
- **Gereken:** `(unit, role)` ikilisine dayalı yetkilendirme, merkezi politika katmanı.
- **Değişiklik:** Orta-büyük — mevcut route'ların her yazma ucuna birim-kapsam kontrolü eklenmeli; bunun için önce **birim (unit) hiyerarşisi** veri modeline eklenmeli (yeni tablo + FK), sonra tek bir Express middleware (`requireUnitScope(resourceType)`) yazılıp tüm route'lara uygulanmalı.

### CC-MOD — Modüler Sınırlar
- **Mevcut:** Her domain zaten ayrı `*Store.js` dosyasında (isms-builder bunu organik olarak zaten yapıyor).
- **Gereken:** SQL şema ayrımı (`rsk.`, `ast.` gibi) — SQLite şema desteklemez (tek namespace), Postgres/MariaDB modunda mümkün. **Pratik öneri:** SQLite'ta tablo adı prefiksi (`rsk_risks`, `ast_assets`) ile taklit edilebilir; gerçek şema ayrımı istenirse Postgres backend'e geçilmeli.
- Mimari test (NetArchTest karşılığı): Node'da `dependency-cruiser` npm paketiyle modüller-arası bağımlılık kuralları CI'da doğrulanabilir.

### CC-ORG — Organizasyon Yapılandırması
- Spec zaten **tek-kiracılı**'ya geçmiş — isms-builder da zaten tek kurulum/tek organizasyon mantığında çalışıyor. **Bu madde ekstra iş gerektirmiyor**, mevcut mimariyle doğal uyum var.

---

## 4. Öncelikli Yol Haritası (Önerilen Fazlar)

Spec'in kendi "MVP önerisi" (§3.4: IDN+RSK+AST+CMP+AUD+INC+GOV(CAPA)+ATT+NOT) ile mevcut kod tabanının güçlü/zayıf noktaları birleştirilerek:

**Faz 0 — Türkçe dil + hızlı kazanımlar** *(düşük risk, hemen başlanabilir)*
- `tr` locale ekleme (bkz. §1)
- Mevcut UI'ı paylaşılan mockup'taki tasarım diline (IBM Plex Sans/Mono, renk paleti, KRI kartları, offcanvas form paneli) yaklaştırma — **CSS/tema işi**, mevcut vanilla JS SPA yapısını bozmadan yapılabilir.

**Faz 1 — Temel taşlar (CC-*)** *(yüksek risk, sonradan eklemesi pahalı)*
- SQLite backend'i **tek resmi backend** ilan et (JSON'u dev-only'e indir), çünkü transaction/temporal/hash-chain gereksinimleri JSON store'da karşılanamaz.
- UUIDv7 ID üretimine geçiş (`uuid` paketi).
- Merkezi hash-zincirli `audit_log` tablosu + yazma helper'ı.
- Temporal history tabloları (trigger tabanlı) — önce en kritik varlıklarda (risk, varlık, olay, CAPA).
- Birim (unit) hiyerarşisi + `(unit, role)` yetkilendirme middleware'i.

**Faz 2 — Eksik modüller**
- INC (Olay) modülü — 3 adımlı wizard, SLA, olay→CAPA domain event.
- GOV içinde merkezi CAPA/Aksiyon modeli (mevcut dağınık governance/goals/bcm route'larını birleştiren).
- ATT — merkezi kanıt havuzu görünümü + dosya tarama entegrasyonu (ör. ClamAV daemon + `clamscan` npm paketi).

**Faz 3 — Genişletme**
- PRJ (Proje/SDLC) modülü — yeni.
- Domain event + outbox altyapısının tüm modüllere yayılması.
- Dashboard/KRI kartları, takvim, ısı haritası gibi mockup'taki analitik görünümler.

---

## 5. UI Mockup Değerlendirmesi

Paylaşılan HTML mockup (Sentinel ISMS teması) mevcut `ui/` içindeki Atlassian Dark Theme'den farklı bir görsel dil kullanıyor (IBM Plex Sans/Mono, açık tema, `--brand:#0E6B75` teal vurgu). İki seçenek:

1. **Mevcut temayı koru, mockup'tan yalnız bileşen desenlerini (KRI kartları, offcanvas form, hash-zincir görselleştirmesi, kanban) devşir.** Daha az risk, daha az iş.
2. **Mockup'ı olduğu gibi hedef tema yap**, mevcut `ui/` CSS'ini bu palete migrate et. Daha tutarlı sonuç ama tüm ekranların yeniden stilize edilmesi gerekir (isms-builder'da kaç ekran olduğu route sayısından tahmin edilebilir — 20+ route dosyası, muhtemelen 20-30 view).

Mockup zaten **Türkçe metin + İngilizce olmayan kod** (`view-risks`, `openForm('risk')` gibi fonksiyon/id isimleri İngilizce, görünen metin Türkçe) düzeninde yazılmış — bu, "arayüz Türkçe, kod İngilizce" isteğiyle **birebir aynı desen**. isms-builder'ın kendi i18n mekanizmasıyla birleştirilebilir: mockup'taki sabit Türkçe string'ler `t('anahtar')` çağrılarına dönüştürülüp `translations.js`'e ilenir.

---

## 6. Riskler (bir önceki analizden hatırlatma, spec bağlamında)

- **JSON backend + CC-TRX/CC-AUD çelişkisi:** Spec'in transaction bütünlüğü ve tamper-evident audit gereksinimleri JSON dosya store'da **prensipte karşılanamaz**. Production hedefleniyorsa SQLite/Postgres zorunlu hale gelmeli — bu, README'nin "json önerilir" tavsiyesiyle çelişir ve ayrı bir karar gerektirir.
- **AGPL:** Spec bu konudan bahsetmiyor; isms-builder AGPL olduğundan, üstüne inşa edilen kod da (dışa servis sunulursa) aynı lisans şemsiyesinde kalır — bu daha önce konuşulmuştu, hâlâ geçerli.
- **Efor:** Faz 1 (CC-* temel taşları) tek başına, mevcut ekibin büyüklüğüne göre haftalar sürebilecek bir iş; spec'in kendisi de bunu "sonradan eklemesi maliyetli" diye işaretliyor.

---

## 7. Sonuç / Öneri

Mevcut isms-builder kod tabanı **iyi bir başlangıç noktası** — CRUD, auth, dosya yükleme, SMTP, i18n altyapısı zaten var ve modül sınırları (her domain için ayrı store) spec'in CC-MOD felsefesiyle zaten örtüşüyor. Sıfırdan yazmaya gerek yok.

Asıl iş, spec'in **çapraz-kesen (CC-*) gereksinimlerini** (kimlik, transaction bütünlüğü, tamper-evident audit, birim-bazlı yetki) mevcut mimariye **sonradan monte etmek** — bu, spec'in kendisinin de "baştan kurulmalı, sonradan pahalı" dediği kısım. Türkçe dil eklemek ise mevcut i18n altyapısı sayesinde **düşük riskli, hızlı bir kazanım**.
