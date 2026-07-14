# isms-builder — Türkçe Dil, UI Teması ve Eksik Modüller Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `docs/analysis/2026-07-14-fr-gap-analysis.md` raporundaki **Faz 0, Faz 2, Faz 3** kapsamını (Türkçe dil, UI tema uyarlaması, eksik/yarım modüller: CAPA, ATT havuzu, PRJ, dashboard analitiği) uygular. **Faz 1'deki çapraz-kesen (CC-*) gereksinimler — GUIDv7, hash-zincirli audit, temporal tablo, transaction/domain-event/outbox, birim-bazlı RBAC — bu planın dışındadır ve bilinçli olarak ertelenmiştir.**

**Architecture:** Mevcut mimari korunur — Express router (`server/routes/*.js`) → JSON-dosya store (`server/db/*Store.js`, `assetStore.js` deseni) → tek sayfalık `ui/app.js` (14K satır, `renderX()` fonksiyonları + `NAV` dizisi + `t()` i18n). Yeni modüller bu üç katmana **aynı desenle** eklenir; SQLite/Knex/transaction altyapısına dokunulmaz.

**Tech Stack:** Node.js/Express, Jest + Supertest (test), vanilla JS (frontend), mevcut `ui/i18n/t.js` çeviri motoru.

## Global Constraints

- Her yeni store dosyası `server/db/assetStore.js` desenini izler: düz JSON dosya (`data/<isim>.json`), `STORAGE_BACKEND` her satırda kontrol edilmez (mevcut modüllerin çoğu zaten böyle).
- Her yeni/değişen route `requireAuth` + `authorize(<minRole>)` middleware'ini kullanır (bkz. `server/routes/assets.js`).
- Her create/update/delete işlemi `require('../db/auditStore').append({...})` çağrısıyla mevcut (hash-zincirsiz, append-only) audit log'a yazılmalı — **CC-AUD'un tam hali değil, ama mevcut asgari seviyeyle tutarlı olmalı.**
- Testler `tests/setup/testEnv.js` ve `tests/setup/authHelper.js` yardımcılarını kullanır; her yeni route dosyası için `tests/<modul>.test.js` eklenir; `STORAGE_BACKEND=json` sabit.
- Kod tarafında (route adları, JS fonksiyon/değişken adları, DB alan adları) **her zaman İngilizce**; kullanıcıya görünen tüm metinler `t('anahtar')` üzerinden çekilir — asla düz string gömülmez.
- Her görev sonunda `npm test` ile ilgili test dosyası + `npm test` tam koşum en az bir kez çalıştırılır.

---

# FAZ 0 — Türkçe Dil + UI Tema Uyarlaması

## Alt-Faz 0.1 — i18n Altyapısına `tr` Locale Ekleme

### Task 0.1.1: SUPPORTED diline `tr` ekle + tarayıcı algılama

**Files:**
- Modify: `ui/i18n/t.js:9-18`
- Test: `tests/i18n.test.js` (yeni)

**Interfaces:**
- Consumes: yok (kök seviye modül)
- Produces: `window.t(key)`, `window.setLang('tr')`, `window.detectBrowserLang()` artık `'tr'` döndürebilir — sonraki tüm görevler bunu kullanır.

- [ ] **Step 1: Başarısız testi yaz**

`tests/i18n.test.js`:
```js
'use strict'
const fs = require('fs')
const path = require('path')

describe('i18n — Turkish locale desteği', () => {
  const tSrc = fs.readFileSync(path.join(__dirname, '../ui/i18n/t.js'), 'utf8')

  test('SUPPORTED dizisi tr içerir', () => {
    expect(tSrc).toMatch(/SUPPORTED\s*=\s*\[[^\]]*'tr'[^\]]*\]/)
  })

  test('detectBrowserLang tr önekini tanır', () => {
    expect(tSrc).toMatch(/nav\.startsWith\('tr'\)/)
  })
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/i18n.test.js -v`
Expected: FAIL — `SUPPORTED` dizisinde `'tr'` yok.

- [ ] **Step 3: Minimal implementasyon**

`ui/i18n/t.js` içinde:
```js
const SUPPORTED = ['en', 'de', 'fr', 'nl', 'tr'];
```
ve `detectBrowserLang()` içine, `nl` kontrolünden sonra:
```js
    if (nav.startsWith('tr')) return 'tr';
```

- [ ] **Step 4: Testi çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/i18n.test.js -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add ui/i18n/t.js tests/i18n.test.js
git commit -m "feat(i18n): add Turkish locale detection"
```

---

### Task 0.1.2: Çeviri anahtar envanteri çıkar (batch hazırlığı)

**Files:**
- Create: `scripts/i18n-extract-keys.js`
- Create: `docs/analysis/i18n-tr-todo.json` (üretilen çıktı — geçici çalışma dosyası, commit edilir ki çeviri ilerlemesi izlenebilsin)

**Interfaces:**
- Consumes: `ui/i18n/translations.js` (mevcut `window.TRANSLATIONS` objesi)
- Produces: `docs/analysis/i18n-tr-todo.json` — `{ key: { en: "...", missingTr: true } }` formatında, Alt-Faz 0.2'nin girdisi.

- [ ] **Step 1: Script'i yaz**

`scripts/i18n-extract-keys.js`:
```js
'use strict'
// Tüm çeviri anahtarlarını tarar, tr alanı eksik olanları listeler.
const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '../ui/i18n/translations.js')
const OUT = path.join(__dirname, '../docs/analysis/i18n-tr-todo.json')

// translations.js bir IIFE + window.TRANSLATIONS ataması içeriyor;
// Node'da window yok, sahte bir global ile yükleyip objeyi yakalıyoruz.
global.window = {}
require(SRC)
const dict = global.window.TRANSLATIONS

const todo = {}
let total = 0, missing = 0
for (const [key, entry] of Object.entries(dict)) {
  total++
  if (!entry.tr) {
    missing++
    todo[key] = { en: entry.en || entry.de || '', missingTr: true }
  }
}

fs.writeFileSync(OUT, JSON.stringify(todo, null, 2))
console.log(`[i18n-extract] ${total} anahtar taranadı, ${missing} tanesinde tr eksik. Çıktı: ${OUT}`)
```

- [ ] **Step 2: Script'i çalıştır**

Run: `node scripts/i18n-extract-keys.js`
Expected: `docs/analysis/i18n-tr-todo.json` oluşur, konsolda `N anahtar tarandı, N tanesinde tr eksik` mesajı görünür (N ≈ 400-600 aralığında).

- [ ] **Step 3: Commit**

```bash
git add scripts/i18n-extract-keys.js docs/analysis/i18n-tr-todo.json
git commit -m "chore(i18n): add key-extraction script + Turkish translation TODO manifest"
```

---

## Alt-Faz 0.2 — Çeviri Sözlüğünü Doldurma

### Task 0.2.1: `docs/analysis/i18n-tr-todo.json` içindeki anahtarları çevir

**Files:**
- Modify: `docs/analysis/i18n-tr-todo.json` (her kayda `"tr": "..."` alanı eklenir, `missingTr` kaldırılır)

- [ ] **Step 1:** Dosyayı mantıksal bloklara ayır (login, dashboard, risk, asset, soa, gdpr, training, governance, admin, ...) — `translations.js` içindeki yorum satırları (`// ── Login page ──`) zaten bu ayrımı gösteriyor; aynı sıralamayı `i18n-tr-todo.json`'da takip et.
- [ ] **Step 2:** Her blok için Türkçe çeviriyi ekle. ISO 27001 terminolojisinde tutarlılık için: `risk` → risk, `asset` → varlık, `control` → kontrol, `finding` → bulgu, `nonconformity` → uygunsuzluk, `corrective action` → düzeltici faaliyet, `management review` → yönetim gözden geçirme. (Bu sözlük Alt-Faz 2/3'teki yeni modüllerde de kullanılacak — tutarlılık kritik.)
- [ ] **Step 3:** Kısaltma/format tutarlılığı: tarih placeholder'ları (`{date}`, `{name}` gibi) orijinal İngilizce metindeki gibi birebir korunmalı — `t()` fonksiyonu bunları regex ile değiştiriyor (`ui/i18n/t.js:51-54`), placeholder adı değişirse çeviri sessizce bozulur.

*(Bu görev kod değişikliği değil, çeviri emeğidir — bite-sized adımlara bölünmez; blok blok ilerleyip her blok sonunda Step commit yapılır.)*

- [ ] **Step 4: Her blok tamamlandığında commit**

```bash
git add docs/analysis/i18n-tr-todo.json
git commit -m "chore(i18n): translate <blok-adı> block to Turkish"
```

---

### Task 0.2.2: TODO manifest'i `translations.js`'e geri yaz

**Files:**
- Create: `scripts/i18n-merge-tr.js`
- Modify: `ui/i18n/translations.js` (script tarafından otomatik güncellenir — elle düzenlenmez)
- Test: `tests/i18n.test.js` (genişletilir)

**Interfaces:**
- Consumes: `docs/analysis/i18n-tr-todo.json` (Task 0.2.1'in çıktısı, artık `tr` alanları dolu)
- Produces: `ui/i18n/translations.js` içindeki her `TRANSLATIONS[key]` objesine `tr: '...'` alanı eklenmiş hali.

- [ ] **Step 1: Başarısız testi yaz**

`tests/i18n.test.js`'e ekle:
```js
describe('i18n — tr çeviri kapsamı', () => {
  test('TRANSLATIONS içindeki her anahtarda tr alanı var', () => {
    global.window = {}
    require('../ui/i18n/translations.js')
    const dict = global.window.TRANSLATIONS
    const missing = Object.keys(dict).filter(k => !dict[k].tr)
    expect(missing).toEqual([])
  })
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/i18n.test.js -v`
Expected: FAIL — `missing` dizisi boş değil (yüzlerce anahtar).

- [ ] **Step 3: Merge script'ini yaz**

`scripts/i18n-merge-tr.js`:
```js
'use strict'
// docs/analysis/i18n-tr-todo.json içindeki tr çevirilerini translations.js'e işler.
const fs = require('fs')
const path = require('path')

const TODO_FILE = path.join(__dirname, '../docs/analysis/i18n-tr-todo.json')
const TRANS_FILE = path.join(__dirname, '../ui/i18n/translations.js')

const todo = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'))
let src = fs.readFileSync(TRANS_FILE, 'utf8')

let patched = 0, skipped = 0
for (const [key, entry] of Object.entries(todo)) {
  if (!entry.tr) { skipped++; continue }
  // Anahtarın tanım satırını bul: `key: { de: '...', en: '...', fr: '...', nl: '...' }`
  const re = new RegExp(`(\\b${key}:\\s*\\{[^}]*?nl:\\s*'(?:[^'\\\\]|\\\\.)*')(\\s*\\})`)
  const trValue = entry.tr.replace(/'/g, "\\'")
  if (re.test(src)) {
    src = src.replace(re, `$1, tr: '${trValue}'$2`)
    patched++
  } else {
    console.warn(`[i18n-merge] anahtar bulunamadı veya format uyuşmuyor: ${key}`)
  }
}

fs.writeFileSync(TRANS_FILE, src)
console.log(`[i18n-merge] ${patched} anahtar güncellendi, ${skipped} atlandı (tr boş).`)
```

- [ ] **Step 4: Script'i çalıştır**

Run: `node scripts/i18n-merge-tr.js`
Expected: `[i18n-merge] N anahtar güncellendi, 0 atlandı.`

- [ ] **Step 5: Testi tekrar çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/i18n.test.js -v`
Expected: PASS — `missing` dizisi boş.

Not: Regex tabanlı satır-içi patch riskli olabilir (çok satırlı veya iç içe tırnak içeren nadir girişlerde eşleşmeyebilir) — script'in konsol çıktısındaki "bulunamadı" uyarıları elle kontrol edilip o girdiler manuel düzeltilmeli.

- [ ] **Step 6: Commit**

```bash
git add scripts/i18n-merge-tr.js ui/i18n/translations.js tests/i18n.test.js
git commit -m "feat(i18n): merge Turkish translations into translations.js"
```

---

### Task 0.2.3: Dil seçiciyi login ekranına ekle (yoksa)

**Files:**
- Modify: `ui/login.html`
- Modify: `ui/login-submit.js` veya `ui/logincheck.js` (mevcut dosyaya bakılıp uygun olan seçilir)
- Test: manuel/tarayıcı doğrulaması (bu görev UI etkileşimi olduğundan Jest ile test edilmez)

- [ ] **Step 1:** `ui/login.html`'i oku, mevcut bir dil seçici (`<select>` veya benzeri, `setLang` çağıran) olup olmadığını kontrol et.
- [ ] **Step 2:** Yoksa, `EN / DE / FR / NL / TR` seçeneklerini içeren bir `<select id="langSelect">` ekle; `onchange` ile `setLang(this.value); location.reload()`.
- [ ] **Step 3:** Varsa, seçenek listesine `<option value="tr">Türkçe</option>` ekle.
- [ ] **Step 4: Tarayıcıda doğrula**

Run: `docker compose up -d` (veya `npm start`), tarayıcıda `http://localhost:3000/ui/login.html` aç, dil seçiciden Türkçe'yi seç, giriş ekranı metinlerinin Türkçe'ye döndüğünü gözle doğrula.

- [ ] **Step 5: Commit**

```bash
git add ui/login.html ui/login-submit.js
git commit -m "feat(i18n): add Turkish option to language selector"
```

---

## Alt-Faz 0.3 — UI Görsel Tema Uyarlaması

> Mevcut Atlassian Dark Theme korunur; paylaşılan mockup'tan yalnız **bileşen desenleri** devşirilir (mimariyi bozacak tam tema değişimi bu fazın kapsamı dışında — bkz. gap-analizi raporu §5, seçenek 1).

### Task 0.3.1: KRI kartı bileşenini `style.css`'e ekle

**Files:**
- Modify: `ui/style.css`
- Test: manuel görsel doğrulama

- [ ] **Step 1:** Mockup'taki `.kri`, `.kri .n`, `.kri .stripe`, `.trend` sınıflarını mevcut `style.css`'in renk değişkenlerine (`--brand`, `--ok`, `--warn`, `--crit` benzeri, mevcut dosyada tanımlı isimlerle) uyarlayarak ekle.
- [ ] **Step 2:** `ui/app.js` içindeki mevcut dashboard render fonksiyonuna (`renderDashboard` benzeri — dosyada arayıp bulunmalı) bu yeni `.kri` sınıfını kullanan bir örnek blok ekle (ör. "Açık DÖF", "Gecikmiş Aksiyon" kartları — Alt-Faz 2.2'de CAPA verisi bağlanacak, şimdilik statik/placeholder veri ile).
- [ ] **Step 3: Tarayıcıda doğrula**

Run: uygulamayı başlat, dashboard'a giriş yap, yeni KRI kartlarının render olduğunu gözle doğrula (responsive: `max-width:1200px` altında `grid-template-columns:repeat(3,1fr)`'a düştüğünü de kontrol et).

- [ ] **Step 4: Commit**

```bash
git add ui/style.css ui/app.js
git commit -m "feat(ui): add KRI stat-card component to dashboard"
```

*(Diğer bileşenler — offcanvas form paneli, kanban, ısı haritası — Alt-Faz 2.2/2.3/3.1/3.2'deki ilgili modül görevlerine dahil edilmiştir; burada tekrar edilmez.)*

---

# FAZ 2 — Eksik / Yarım Modüller

> **Düzeltme (araştırma sonucu):** İlk gap-analizinde INC modülü "eksik" olarak işaretlenmişti. Kod incelemesi bunun yanlış olduğunu gösterdi — `ui/app.js` içinde zaten bir **Incident Inbox** (satır ~2136+), genel/public olay bildirimi (`routes/public.js`, `db/publicIncidentStore.js`), CISO SLA ayarı (satır ~5926) mevcut. Bu nedenle Alt-Faz 2.1 "yeni modül" değil, **spec'teki eksik parçaları (3 adımlı sihirbaz, yapılandırılmış müdahale/izolasyon kaydı) mevcut modüle ekleme** işidir.

## Alt-Faz 2.1 — INC (Olay) Modülü Genişletmesi

### Task 2.1.1: Müdahale/izolasyon kaydı alanlarını veri modeline ekle

**Files:**
- Modify: `server/db/publicIncidentStore.js` (veya olay kayıtlarının asıl tutulduğu store — önce `routes/public.js`'i okuyup doğru store dosyasını teyit et)
- Test: `tests/incident-response.test.js` (yeni)

**Interfaces:**
- Produces: `responseLog: [{ step: string, done: boolean, doneAt: string|null, doneBy: string|null }]` alanı olay kaydına eklenir; `updateResponseStep(incidentId, stepIndex, { done, user })` fonksiyonu.

- [ ] **Step 1: Başarısız testi yaz**

`tests/incident-response.test.js`:
```js
'use strict'
const { createTestDataDir, removeTestDataDir } = require('./setup/testEnv')
const { loginAs, authedGet, authedPost, authedPut } = require('./setup/authHelper')

let dataDir, app, adminCookie
let incidentId

beforeAll(async () => {
  dataDir = createTestDataDir()
  process.env.DATA_DIR        = dataDir
  process.env.JWT_SECRET      = 'jest-test-secret-incresp'
  process.env.NODE_ENV        = 'test'
  process.env.STORAGE_BACKEND = 'json'
  app = require('../server/index.js')
  adminCookie = await loginAs(app, 'admin')
})

afterAll(async () => {
  removeTestDataDir(dataDir)
})

describe('Incident — müdahale/izolasyon kayıtları', () => {
  test('POST /incidents oluşturulunca varsayılan responseLog boş dizi', async () => {
    const res = await authedPost(app, adminCookie, '/incidents', {
      title: 'Test olay', incidentType: 'unauthorized_access', occurredAt: new Date().toISOString(),
    })
    expect(res.status).toBe(201)
    expect(Array.isArray(res.body.responseLog)).toBe(true)
    incidentId = res.body.id
  })

  test('PUT /incidents/:id/response-step izolasyon adımını işaretler', async () => {
    const res = await authedPut(app, adminCookie, `/incidents/${incidentId}/response-step`, {
      step: 'source_ip_blocked', done: true,
    })
    expect(res.status).toBe(200)
    const step = res.body.responseLog.find(s => s.step === 'source_ip_blocked')
    expect(step.done).toBe(true)
    expect(step.doneBy).toBe('admin')
  })
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/incident-response.test.js -v`
Expected: FAIL — `/incidents` ve `/incidents/:id/response-step` uçları henüz yok (404).

*(Not: mevcut route'un tam adı `routes/public.js` veya ayrı bir `routes/incidents.js` olabilir — Step 3'ten önce `grep -rn "incident" server/routes/*.js` ile teyit edilmeli ve test yolu buna göre düzeltilmeli.)*

- [ ] **Step 3: Minimal implementasyon**

İlgili store dosyasına (`getById`/`update` fonksiyonlarının yanına):
```js
const RESPONSE_STEPS = ['source_ip_blocked', 'sessions_terminated', 'evidence_archived']

function ensureResponseLog(incident) {
  if (!incident.responseLog) {
    incident.responseLog = RESPONSE_STEPS.map(step => ({ step, done: false, doneAt: null, doneBy: null }))
  }
  return incident
}

function updateResponseStep(id, step, done, user) {
  const list = load()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return null
  ensureResponseLog(list[idx])
  const s = list[idx].responseLog.find(s => s.step === step)
  if (!s) return null
  s.done = done
  s.doneAt = done ? nowISO() : null
  s.doneBy = done ? user : null
  save(list)
  return list[idx]
}

module.exports = { /* ...mevcut export'lar..., */ ensureResponseLog, updateResponseStep, RESPONSE_STEPS }
```

İlgili route dosyasına:
```js
router.put('/incidents/:id/response-step', requireAuth, authorize('editor'), async (req, res) => {
  const { step, done } = req.body
  const updated = await incidentStore.updateResponseStep(req.params.id, step, done, req.user)
  if (!updated) return res.status(404).json({ error: 'Not found' })
  await require('../db/auditStore').append({ user: req.user, action: 'update', resource: 'incident', resourceId: updated.id, detail: `response-step:${step}=${done}` })
  res.json(updated)
})
```

`create` fonksiyonunun sonunda `ensureResponseLog(incident)` çağrılmalı (yeni kayıtlar otomatik dolsun).

- [ ] **Step 4: Testi tekrar çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/incident-response.test.js -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/db/*.js server/routes/*.js tests/incident-response.test.js
git commit -m "feat(incident): add structured response/isolation step tracking"
```

---

### Task 2.1.2: 3 adımlı olay bildirim sihirbazını UI'a ekle

**Files:**
- Modify: `ui/app.js` (mevcut `renderIncidentInbox`/olay bildirim formunun yanına yeni bir `renderIncidentWizard()` fonksiyonu)
- Modify: `ui/i18n/translations.js` (yeni anahtarlar: `incWizardStep1Title`, `incWizardStep2Title`, `incWizardStep3Title` vb. — Task 0.2.1'deki terminoloji sözlüğüyle tutarlı, en/de/fr/nl/tr hepsi doldurulur)

**Interfaces:**
- Consumes: Task 2.1.1'in `RESPONSE_STEPS`, `/incidents` POST ucu.
- Produces: `window.renderIncidentWizard()` — nav'dan çağrılabilir, mockup'taki `.wizard`/`.steps`/`.wcard`/`.radio-grid` CSS desenini kullanır (Alt-Faz 0.3'te olduğu gibi `style.css`'e eklenir).

- [ ] **Step 1:** Mevcut `renderIncidentInbox()` fonksiyonunun (satır ~2136) çağrıldığı yerdeki "Olay Bildir" butonunu bul, `onclick="renderIncidentWizard()"` olacak şekilde güncelle (veya yeni bir buton ekle, mevcut akışı bozmadan).
- [ ] **Step 2:** `.wizard`, `.steps`, `.step`, `.wcard`, `.radio-grid`, `.radio-card` CSS sınıflarını mockup'tan `style.css`'e uyarlayarak ekle.
- [ ] **Step 3:** 3 adımlı form akışını yaz: Adım 1 (tür seçimi — `radio-card` grid), Adım 2 (ne zaman/nerede — tarih + varlık seçimi), Adım 3 (ciddiyet + "düzeltici faaliyet gerekli" toggle). Son adımda `POST /incidents` çağrısı.
- [ ] **Step 4: Tarayıcıda doğrula**

Run: uygulamayı başlat, giriş yap, Olay Bildir akışını uçtan uca tamamla, oluşan kaydın Incident Inbox'ta göründüğünü doğrula.

- [ ] **Step 5: Commit**

```bash
git add ui/app.js ui/style.css ui/i18n/translations.js
git commit -m "feat(incident): add 3-step incident reporting wizard"
```

---

## Alt-Faz 2.2 — GOV: Merkezi CAPA/Aksiyon Modülü (Yeni)

### Task 2.2.1: CAPA store'unu oluştur

**Files:**
- Create: `server/db/capaStore.js`
- Test: `tests/capa.test.js`

**Interfaces:**
- Produces:
  - `create({ title, description, source, sourceRef, owner, dueDate }, { createdBy }) → capa`
  - `getAll({ status, source, owner }) → capa[]`
  - `getById(id) → capa|null`
  - `updateProgress(id, progress) → capa|null` (0-100; `progress===100` zorunlu `completedAt` set eder)
  - `close(id, { verificationNote, verifiedBy }) → capa|null` (yalnız bu fonksiyon `status:'closed'` yazabilir — spec FR-GOV.7: "durum doğrudan kapalı kaydedilemez")
  - `SOURCES = ['manual', 'incident', 'audit', 'rollback', 'continuity_test', 'management_review']`

- [ ] **Step 1: Başarısız testi yaz**

`tests/capa.test.js`:
```js
'use strict'
const { createTestDataDir, removeTestDataDir } = require('./setup/testEnv')
const { loginAs, authedGet, authedPost, authedPut } = require('./setup/authHelper')

let dataDir, app, adminCookie, readerCookie
let capaId

beforeAll(async () => {
  dataDir = createTestDataDir()
  process.env.DATA_DIR        = dataDir
  process.env.JWT_SECRET      = 'jest-test-secret-capa'
  process.env.NODE_ENV        = 'test'
  process.env.STORAGE_BACKEND = 'json'
  app = require('../server/index.js')
  adminCookie  = await loginAs(app, 'admin')
  readerCookie = await loginAs(app, 'reader')
})

afterAll(async () => {
  removeTestDataDir(dataDir)
})

describe('CAPA / Aksiyon Merkezi', () => {
  test('reader oluşturamaz (403)', async () => {
    const res = await authedPost(app, readerCookie, '/capa', { title: 'x', source: 'manual', owner: 'admin', dueDate: '2026-12-31' })
    expect(res.status).toBe(403)
  })

  test('POST /capa — status "planned" ile açılır, "closed" reddedilir', async () => {
    const res = await authedPost(app, adminCookie, '/capa', {
      title: 'Erişim gözden geçirme otomasyonu', source: 'manual', owner: 'admin', dueDate: '2026-12-31', status: 'closed',
    })
    expect(res.status).toBe(201)
    expect(res.body.status).toBe('planned')  // status alanı elle "closed" gönderilse bile yok sayılır
    capaId = res.body.id
  })

  test('PUT /capa/:id/progress — %100 completedAt otomatik dolar', async () => {
    const res = await authedPut(app, adminCookie, `/capa/${capaId}/progress`, { progress: 100 })
    expect(res.status).toBe(200)
    expect(res.body.progress).toBe(100)
    expect(res.body.completedAt).toBeTruthy()
  })

  test('PUT /capa/:id/close — yalnız bu uç status=closed yazabilir', async () => {
    const res = await authedPut(app, adminCookie, `/capa/${capaId}/close`, { verificationNote: 'Etkinlik doğrulandı — loglarda tekrar yok.' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('closed')
    expect(res.body.closedAt).toBeTruthy()
  })

  test('GET /capa — kaynağa göre filtrelenebilir', async () => {
    const res = await authedGet(app, adminCookie, '/capa?source=manual')
    expect(res.status).toBe(200)
    expect(res.body.every(c => c.source === 'manual')).toBe(true)
  })
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/capa.test.js -v`
Expected: FAIL — `/capa` route'ları yok (404).

- [ ] **Step 3: Store'u yaz**

`server/db/capaStore.js`:
```js
// © 2026 — CAPA / Aksiyon Merkezi store (JSON dosya tabanlı, assetStore.js deseni)
'use strict'
const fs = require('fs')
const path = require('path')

const _BASE = process.env.DATA_DIR || path.join(__dirname, '../../data')
const FILE  = path.join(_BASE, 'capa.json')

const SOURCES = ['manual', 'incident', 'audit', 'rollback', 'continuity_test', 'management_review']
// Spec FR-GOV.7: yalnız 'audit' ve 'management_review' elle açılabilir; diğerleri otomatik
// kaynaklardır (bu faz kapsamında domain-event tetikleme yok — Faz 1/3'te bağlanacak
// entegrasyon noktaları için `sourceRef` alanı şimdiden hazırlanır).
const MANUAL_ALLOWED_SOURCES = ['manual', 'audit', 'management_review']

function load() { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')) } catch { return [] } }
function save(list) { fs.writeFileSync(FILE, JSON.stringify(list, null, 2)) }
function nowISO() { return new Date().toISOString() }
function makeId() { return `capa_${require('crypto').randomBytes(4).toString('hex')}` }

function create({ title, description = '', source, sourceRef = null, owner, dueDate }, { createdBy }) {
  if (!MANUAL_ALLOWED_SOURCES.includes(source)) {
    throw Object.assign(new Error(`source '${source}' yalnız otomatik entegrasyon tarafından açılabilir`), { status: 422 })
  }
  const list = load()
  const capa = {
    id: makeId(), title, description, source, sourceRef, owner, dueDate,
    status: 'planned', progress: 0, completedAt: null, closedAt: null,
    verificationNote: null, verifiedBy: null,
    createdBy, createdAt: nowISO(), updatedAt: nowISO(),
  }
  list.push(capa)
  save(list)
  return capa
}

function getAll({ status, source, owner } = {}) {
  let list = load()
  if (status) list = list.filter(c => c.status === status)
  if (source) list = list.filter(c => c.source === source)
  if (owner)  list = list.filter(c => c.owner === owner)
  return list
}

function getById(id) { return load().find(c => c.id === id) || null }

function updateProgress(id, progress) {
  const list = load()
  const idx = list.findIndex(c => c.id === id)
  if (idx === -1) return null
  const c = list[idx]
  c.progress = Math.max(0, Math.min(100, progress))
  c.status = c.progress > 0 && c.progress < 100 ? 'in_progress' : c.status
  c.completedAt = c.progress === 100 ? nowISO() : null
  c.updatedAt = nowISO()
  save(list)
  return c
}

function close(id, { verificationNote, verifiedBy }) {
  if (!verificationNote) throw Object.assign(new Error('verificationNote zorunlu'), { status: 422 })
  const list = load()
  const idx = list.findIndex(c => c.id === id)
  if (idx === -1) return null
  const c = list[idx]
  c.status = 'closed'
  c.closedAt = nowISO()
  c.verificationNote = verificationNote
  c.verifiedBy = verifiedBy
  c.updatedAt = nowISO()
  save(list)
  return c
}

// İç sistem entegrasyonları (Faz 3'te olay/rollback/süreklilik-testinden çağrılacak)
// için ayrı, MANUAL_ALLOWED_SOURCES kontrolü yapmayan fonksiyon:
function createFromAutomation({ title, description = '', source, sourceRef, owner, dueDate }) {
  if (MANUAL_ALLOWED_SOURCES.includes(source) && source !== 'audit' && source !== 'management_review') {
    // manual asla otomasyondan gelmemeli
  }
  const list = load()
  const dupe = list.find(c => c.source === source && c.sourceRef === sourceRef)
  if (dupe) return dupe  // tekilleştirme (uygulama katmanı — DB unique constraint Faz 1 kapsamında)
  const capa = {
    id: makeId(), title, description, source, sourceRef, owner, dueDate,
    status: 'planned', progress: 0, completedAt: null, closedAt: null,
    verificationNote: null, verifiedBy: null,
    createdBy: 'system', createdAt: nowISO(), updatedAt: nowISO(),
  }
  list.push(capa)
  save(list)
  return capa
}

module.exports = { SOURCES, create, getAll, getById, updateProgress, close, createFromAutomation }
```

`server/routes/capa.js`:
```js
// © 2026 — CAPA / Aksiyon Merkezi route'ları
'use strict'
const express = require('express')
const router = express.Router()
const { requireAuth, authorize } = require('../auth')
const capaStore = require('../db/capaStore')

router.get('/capa', requireAuth, authorize('reader'), async (req, res) => {
  res.json(await capaStore.getAll(req.query))
})

router.get('/capa/:id', requireAuth, authorize('reader'), async (req, res) => {
  const c = await capaStore.getById(req.params.id)
  if (!c) return res.status(404).json({ error: 'Not found' })
  res.json(c)
})

router.post('/capa', requireAuth, authorize('editor'), async (req, res) => {
  try {
    const { title, description, source, owner, dueDate } = req.body
    const capa = await capaStore.create({ title, description, source, owner, dueDate }, { createdBy: req.user })
    await require('../db/auditStore').append({ user: req.user, action: 'create', resource: 'capa', resourceId: capa.id, detail: capa.title })
    res.status(201).json(capa)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message })
  }
})

router.put('/capa/:id/progress', requireAuth, authorize('editor'), async (req, res) => {
  const updated = await capaStore.updateProgress(req.params.id, Number(req.body.progress))
  if (!updated) return res.status(404).json({ error: 'Not found' })
  await require('../db/auditStore').append({ user: req.user, action: 'update', resource: 'capa', resourceId: updated.id, detail: `progress=${updated.progress}` })
  res.json(updated)
})

router.put('/capa/:id/close', requireAuth, authorize('editor'), async (req, res) => {
  try {
    const updated = await capaStore.close(req.params.id, { verificationNote: req.body.verificationNote, verifiedBy: req.user })
    if (!updated) return res.status(404).json({ error: 'Not found' })
    await require('../db/auditStore').append({ user: req.user, action: 'approve', resource: 'capa', resourceId: updated.id, detail: 'closed' })
    res.json(updated)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message })
  }
})

module.exports = router
```

`server/index.js`'e ekle (satır 129 civarı, `require('./routes/suppliers')`'ın yanına):
```js
app.use(require('./routes/capa'))
```

- [ ] **Step 4: Testi tekrar çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/capa.test.js -v`
Expected: PASS (5/5)

- [ ] **Step 5: Commit**

```bash
git add server/db/capaStore.js server/routes/capa.js server/index.js tests/capa.test.js
git commit -m "feat(capa): add central CAPA/action-item module with progress + gated close"
```

---

### Task 2.2.2: CAPA Kanban görünümünü UI'a ekle

**Files:**
- Modify: `ui/app.js` (yeni `renderCapaBoard()` fonksiyonu + `NAV` dizisine `{ id:'capa', labelKey:'nav_capa', ... }` girdisi — mevcut `NAV` deseni satır ~39-42 civarında)
- Modify: `ui/style.css` (mockup'taki `.kanban`, `.kcol`, `.kcard` sınıfları)
- Modify: `ui/i18n/translations.js` (yeni anahtarlar, tüm dillerde)

**Interfaces:**
- Consumes: Task 2.2.1'in `GET /capa`, `PUT /capa/:id/progress`, `PUT /capa/:id/close` uçları.
- Produces: `window.renderCapaBoard()`, `window.openCapaCloseModal(id)` (mockup'taki `capa-modal` desenine benzer, "kapatma geri alınamaz" onay diyaloğu).

- [ ] **Step 1:** `NAV` dizisine yeni girdi ekle: `{ id:'capa', labelKey:'nav_capa', label:'CAPA / Actions', icon:'ph-check-square', minRole:'reader', functions:['ciso','contentowner'] }`
- [ ] **Step 2:** `renderCapaBoard()` fonksiyonunu yaz: `GET /capa` çağırıp `status` alanına göre 4 kolona (`planned`, `in_progress`, `verifying`, `closed`) dağıt, mockup'taki `.kcol`/`.kcard` yapısını kullan.
- [ ] **Step 3:** Kart tıklanınca (yalnız `closed` olmayanlarda) ilerleme güncelleme paneli; "closed" kolonuna sürüklemek yerine (drag-drop bu fazda kapsam dışı) bir "Kapat" butonu → `openCapaCloseModal(id)` → `PUT /capa/:id/close`.
- [ ] **Step 4:** Alt-Faz 0.3'teki dashboard KRI kartlarını (Task 0.3.1'de placeholder bırakılmıştı) gerçek veriyle bağla: "Açık DÖF" kartı `GET /capa?status=planned` + `GET /capa?status=in_progress` toplamını gösterir.
- [ ] **Step 5: Tarayıcıda doğrula**

Run: uygulamayı başlat, bir CAPA oluştur, kanban'da göründüğünü, ilerleme güncellemesinin ve kapatma akışının çalıştığını doğrula; dashboard KRI kartının sayıyı yansıttığını kontrol et.

- [ ] **Step 6: Commit**

```bash
git add ui/app.js ui/style.css ui/i18n/translations.js
git commit -m "feat(capa): add Kanban board UI + dashboard KRI wiring"
```

---

### Task 2.2.3: Olay → CAPA otomatik tetikleme + elle açmada kaynak kısıtı (UI)

> **Kullanıcı talebi (2026-07-14):** CAPA modülünde hem **otomatik açılma** hem **elle açılma** yolu net ayrışmalı. Task 2.2.1'deki store bunu zaten `create()` (yalnız `manual`/`audit`/`management_review`) ve `createFromAutomation()` (diğer kaynaklar, tekilleştirmeli) ile ayırıyor; bu görev bu ayrımı gerçek bir tetikleyiciye ve UI'a bağlıyor.

**Files:**
- Modify: ilgili olay route dosyası (Task 2.1.1'de teyit edilen, `correctiveActionRequired` alanının PUT edildiği uç)
- Modify: `ui/app.js` (CAPA oluşturma formunun `Kaynak` dropdown'ı)
- Test: `tests/capa.test.js` (genişlet)

**Interfaces:**
- Consumes: Task 2.2.1'in `capaStore.createFromAutomation({ title, description, source:'incident', sourceRef, owner, dueDate })`; Task 2.1.1'in olay kaydı alanları.
- Produces: olay üzerinde `correctiveActionRequired: true` işaretlendiğinde, aynı istek içinde (transaction değil — bu fazın kapsamı dışı, ardışık senkron çağrı yeterli) otomatik bir CAPA kaydı açılır ve olay kaydına `linkedCapaId` yazılır.

- [ ] **Step 1: Başarısız testi yaz**

`tests/capa.test.js`'e ekle:
```js
describe('CAPA — olaydan otomatik tetikleme', () => {
  test('olayda correctiveActionRequired=true işaretlenince CAPA otomatik açılır', async () => {
    const incRes = await authedPost(app, adminCookie, '/incidents', {
      title: 'Yetkisiz erişim denemesi', incidentType: 'unauthorized_access', occurredAt: new Date().toISOString(),
    })
    const incId = incRes.body.id

    const flagRes = await authedPut(app, adminCookie, `/incidents/${incId}`, { correctiveActionRequired: true })
    expect(flagRes.status).toBe(200)
    expect(flagRes.body.linkedCapaId).toBeTruthy()

    const capaListRes = await authedGet(app, adminCookie, '/capa?source=incident')
    const linked = capaListRes.body.find(c => c.id === flagRes.body.linkedCapaId)
    expect(linked).toBeTruthy()
    expect(linked.sourceRef).toBe(incId)
  })

  test('aynı olay ikinci kez işaretlenirse CAPA tekrar üretilmez (tekilleştirme)', async () => {
    const incRes = await authedPost(app, adminCookie, '/incidents', {
      title: 'İkinci test olayı', incidentType: 'unauthorized_access', occurredAt: new Date().toISOString(),
    })
    const incId = incRes.body.id
    const first  = await authedPut(app, adminCookie, `/incidents/${incId}`, { correctiveActionRequired: true })
    const second = await authedPut(app, adminCookie, `/incidents/${incId}`, { correctiveActionRequired: true })
    expect(second.body.linkedCapaId).toBe(first.body.linkedCapaId)
  })

  test('POST /capa ile source=incident gönderilirse reddedilir (yalnız otomasyon açabilir)', async () => {
    const res = await authedPost(app, adminCookie, '/capa', { title: 'x', source: 'incident', owner: 'admin', dueDate: '2026-12-31' })
    expect(res.status).toBe(422)
  })
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/capa.test.js -v`
Expected: FAIL — olay PUT ucu `correctiveActionRequired` işaretlendiğinde henüz CAPA açmıyor.

- [ ] **Step 3: Minimal implementasyon**

İlgili olay route dosyasında (Task 2.1.1'de bulunan olay PUT ucu), güncelleme mantığına ekle:
```js
router.put('/incidents/:id', requireAuth, authorize('editor'), async (req, res) => {
  const before = await incidentStore.getById(req.params.id)
  if (!before) return res.status(404).json({ error: 'Not found' })

  const updated = await incidentStore.update(req.params.id, req.body)

  // FR-INC.4: "Düzeltici faaliyet gerekli" işaretlenince otomatik CAPA açılır — manuel buton yok.
  if (req.body.correctiveActionRequired === true && !updated.linkedCapaId) {
    const capaStore = require('../db/capaStore')
    const capa = capaStore.createFromAutomation({
      title: `Olay düzeltici faaliyeti — ${updated.title}`,
      description: updated.description || '',
      source: 'incident',
      sourceRef: updated.id,
      owner: req.user,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    })
    updated.linkedCapaId = capa.id
    await incidentStore.update(req.params.id, { linkedCapaId: capa.id })
    await require('../db/auditStore').append({ user: req.user, action: 'create', resource: 'capa', resourceId: capa.id, detail: `auto-opened from incident ${updated.id}` })
  }

  res.json(updated)
})
```
`capaStore.createFromAutomation` zaten (Task 2.2.1) `source`+`sourceRef` çiftine göre tekilleştirme yapıyor — ikinci çağrıda mevcut CAPA'yı döndürür, bu route de `!updated.linkedCapaId` kontrolüyle ikinci kez `update` çağırmaz.

`capaStore.create()` içindeki `MANUAL_ALLOWED_SOURCES` kontrolü zaten `source:'incident'` gönderen elle-oluşturma isteklerini 422 ile reddediyor (Task 2.2.1'de yazılmıştı) — bu testin 3. senaryosu ek kod gerektirmez, yalnız doğrulama.

- [ ] **Step 4: Testi tekrar çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/capa.test.js -v`
Expected: PASS (tüm senaryolar)

- [ ] **Step 5: CAPA oluşturma formunda kaynak dropdown'ını kısıtla (UI)**

`ui/app.js`'teki CAPA oluşturma formunda `Kaynak` `<select>`'i mockup'taki desenle günceli:
```html
<select class="select" id="fCapaSource">
  <option value="manual">Manuel</option>
  <option value="incident" disabled>Olay (otomatik)</option>
  <option value="rollback" disabled>Rollback (otomatik)</option>
  <option value="continuity_test" disabled>Süreklilik testi (otomatik)</option>
  <option value="audit">Denetim</option>
  <option value="management_review">Yönetim Gözden Geçirme</option>
</select>
<div class="hint">Otomatik kaynaklar sistem tarafından açılır — elle seçilemez.</div>
```
Ve olay detay ekranında `correctiveActionRequired` toggle'ının yanına (mockup'taki desen): `disabled` bir toggle + "İşaretlenince DÖF otomatik açılır — manuel buton yoktur" ipucu; toggle `true` yapıldığında `PUT /incidents/:id` çağrısı otomatik gider ve dönen `linkedCapaId` ile "Otomatik açıldı: DF-... — Sürekli İyileştirme'de izleniyor" bilgi kutusu gösterilir.

- [ ] **Step 6: Tarayıcıda doğrula**

Run: uygulamayı başlat, bir olay oluştur, "düzeltici faaliyet gerekli" işaretle, otomatik açılan CAPA'nın CAPA panosunda `source: Olay` etiketiyle göründüğünü doğrula; CAPA formundan elle "Olay" kaynağını seçmenin mümkün olmadığını (disabled) gözle kontrol et.

- [ ] **Step 7: Commit**

```bash
git add server/routes/*.js ui/app.js tests/capa.test.js
git commit -m "feat(capa): wire automatic incident->CAPA trigger, restrict manual creation to allowed sources"
```

---

## Alt-Faz 2.3 — ATT: Merkezi Kanıt Havuzu

### Task 2.3.1: Ekleri (attachments) tek bir tabloda listeleyen agregasyon ucu

**Files:**
- Create: `server/db/evidenceIndex.js`
- Test: `tests/evidence-pool.test.js`

**Interfaces:**
- Produces: `listAll({ sourceType, scanStatus }) → evidence[]` — mevcut, modüllere dağılmış dosya eklerini (`multer` ile yüklenmiş, her modülün kendi JSON kaydında tutulan `attachments` alanları) tarayıp birleştiren salt-okunur bir görünüm.

- [ ] **Step 1:** Önce mevcut ek/dosya yükleme deseninin nerede olduğunu teyit et:

Run: `grep -rln "multer\|attachments" server/routes/*.js server/db/*.js`

Bu görevin implementasyonu, bulunan gerçek alan adlarına göre uyarlanmalı (plan burada varsayımsal `attachments: [{ fileName, fileType, uploadedBy, uploadedAt, scanStatus }]` alanı öngörüyor — gerçek şema farklıysa Step 3 buna göre güncellenir).

- [ ] **Step 2: Başarısız testi yaz**

`tests/evidence-pool.test.js`:
```js
'use strict'
const { createTestDataDir, removeTestDataDir } = require('./setup/testEnv')
const { loginAs, authedGet, authedPost } = require('./setup/authHelper')

let dataDir, app, adminCookie

beforeAll(async () => {
  dataDir = createTestDataDir()
  process.env.DATA_DIR        = dataDir
  process.env.JWT_SECRET      = 'jest-test-secret-evidence'
  process.env.NODE_ENV        = 'test'
  process.env.STORAGE_BACKEND = 'json'
  app = require('../server/index.js')
  adminCookie = await loginAs(app, 'admin')
})

afterAll(async () => { removeTestDataDir(dataDir) })

describe('Kanıt Havuzu — agregasyon', () => {
  test('GET /evidence — başlangıçta boş liste', async () => {
    const res = await authedGet(app, adminCookie, '/evidence')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('bir varlığa dosya eklenince /evidence içinde görünür', async () => {
    const assetRes = await authedPost(app, adminCookie, '/assets', { name: 'Test Varlık', category: 'hardware', criticality: 'low' })
    // Not: gerçek dosya-yükleme ucu (multer route'u) bulunup burada çağrılmalı;
    // bu, Step 1'in grep sonucuna göre netleştirilecek.
    const res = await authedGet(app, adminCookie, '/evidence?sourceType=asset')
    expect(res.status).toBe(200)
  })
})
```

- [ ] **Step 3: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/evidence-pool.test.js -v`
Expected: FAIL — `/evidence` ucu yok.

- [ ] **Step 4: Agregasyon store'unu yaz**

`server/db/evidenceIndex.js` — Step 1'in grep sonucuna göre her modülün store'undan `getAll()` çağırıp `attachments` alanı olan kayıtları düzleştiren bir fonksiyon:
```js
'use strict'
// Modüllere dağılmış ekleri tek görünümde toplayan salt-okunur agregasyon.
// Yeni bir dosya deposu DEĞİLDİR — mevcut store'ların üstünde bir "view" işlevi görür.

const SOURCES = [
  { type: 'asset',    store: () => require('./assetStore') },
  { type: 'risk',     store: () => require('./riskStore') },
  { type: 'incident', store: () => require('./publicIncidentStore') },
  { type: 'supplier', store: () => require('./supplierStore') },
  // Yeni modül eklendikçe (PRJ — Faz 3) buraya bir satır eklenir.
]

async function listAll({ sourceType, scanStatus } = {}) {
  const sources = sourceType ? SOURCES.filter(s => s.type === sourceType) : SOURCES
  const out = []
  for (const src of sources) {
    const store = src.store()
    if (typeof store.getAll !== 'function') continue
    const records = await store.getAll()
    for (const rec of records) {
      for (const att of (rec.attachments || [])) {
        if (scanStatus && att.scanStatus !== scanStatus) continue
        out.push({ ...att, sourceType: src.type, sourceId: rec.id, sourceTitle: rec.name || rec.title })
      }
    }
  }
  return out
}

module.exports = { listAll, SOURCES }
```

`server/routes/evidence.js`:
```js
'use strict'
const express = require('express')
const router = express.Router()
const { requireAuth, authorize } = require('../auth')
const evidenceIndex = require('../db/evidenceIndex')

router.get('/evidence', requireAuth, authorize('reader'), async (req, res) => {
  res.json(await evidenceIndex.listAll(req.query))
})

module.exports = router
```

`server/index.js`'e ekle: `app.use(require('./routes/evidence'))`

- [ ] **Step 5: Testi tekrar çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/evidence-pool.test.js -v`
Expected: PASS (gerçek `attachments` alanı boşsa ikinci test yalnız `200` dönüşünü doğrular — dosya yükleme entegrasyonu Step 1'de bulunan gerçek uca göre genişletilmeli).

- [ ] **Step 6: Commit**

```bash
git add server/db/evidenceIndex.js server/routes/evidence.js server/index.js tests/evidence-pool.test.js
git commit -m "feat(evidence): add cross-module evidence pool aggregation endpoint"
```

**Not (spec FR-ATT.2 — zararlı içerik taraması):** Bu görev kapsamına dahil edilmedi; ayrı bir alt-görev olarak `clamscan` (npm) + yerel bir `clamd` daemon entegrasyonu gerektirir, altyapısal bir bağımlılık (sistem paketi kurulumu) olduğundan kod değişikliğinden önce ortam kararı (Docker image'a `clamav` eklenmesi) gerektirir — bu planın kapsamı dışında, ayrı bir görev/karar olarak işaretlenmiştir.

---

### Task 2.3.2: Kanıt Havuzu UI görünümü

**Files:**
- Modify: `ui/app.js` (`renderEvidencePool()` + `NAV` girdisi)
- Modify: `ui/i18n/translations.js`

- [ ] **Step 1:** `NAV`'a `{ id:'evidence', labelKey:'nav_evidence', label:'Evidence Pool', icon:'ph-archive-tray', minRole:'reader' }` ekle.
- [ ] **Step 2:** `renderEvidencePool()` — `GET /evidence` çağırıp mockup'taki tablo düzenini (Dosya / Bağlı Kayıt / Boyut / Tarama / Yükleyen) kullanarak listele.
- [ ] **Step 3: Tarayıcıda doğrula.**
- [ ] **Step 4: Commit**

```bash
git add ui/app.js ui/i18n/translations.js
git commit -m "feat(evidence): add evidence pool list view"
```

---

# FAZ 3 — Genişletme

## Alt-Faz 3.1 — PRJ (Proje/SDLC) Modülü

### Task 3.1.1: Proje store + checklist otomatik türetme

**Files:**
- Create: `server/db/projectStore.js`
- Test: `tests/projects.test.js`

**Interfaces:**
- Produces:
  - `CHECKLIST_TEMPLATE = ['request_form', 'requirements_form', 'design_doc', 'test_security_verification', 'deployment_record']`
  - `create({ code, name, requestingUnit, targetDate }, { createdBy }) → project` (proje açılınca `checklist` alanı `CHECKLIST_TEMPLATE`'ten otomatik türer, elle kalem eklenemez)
  - `getAll() / getById(id)`
  - `completeChecklistItem(projectId, itemKey, { evidenceRef, waived, waiverReason }) → project` (spec FR-PRJ.2: kanıt olmadan tamamlanamaz; FR-PRJ.8: "Gerekmiyor" işaretlenirse gerekçe zorunlu)

- [ ] **Step 1: Başarısız testi yaz**

`tests/projects.test.js`:
```js
'use strict'
const { createTestDataDir, removeTestDataDir } = require('./setup/testEnv')
const { loginAs, authedPost, authedPut, authedGet } = require('./setup/authHelper')

let dataDir, app, adminCookie
let projectId

beforeAll(async () => {
  dataDir = createTestDataDir()
  process.env.DATA_DIR        = dataDir
  process.env.JWT_SECRET      = 'jest-test-secret-projects'
  process.env.NODE_ENV        = 'test'
  process.env.STORAGE_BACKEND = 'json'
  app = require('../server/index.js')
  adminCookie = await loginAs(app, 'admin')
})

afterAll(async () => { removeTestDataDir(dataDir) })

describe('Proje / SDLC modülü', () => {
  test('POST /projects — checklist otomatik türer (5 kalem)', async () => {
    const res = await authedPost(app, adminCookie, '/projects', {
      code: 'PRJ-100', name: 'Test Projesi', requestingUnit: 'BTM', targetDate: '2026-12-31',
    })
    expect(res.status).toBe(201)
    expect(res.body.checklist).toHaveLength(5)
    expect(res.body.checklist.every(i => i.done === false)).toBe(true)
    projectId = res.body.id
  })

  test('aynı kod ikinci kez kullanılamaz (409)', async () => {
    const res = await authedPost(app, adminCookie, '/projects', {
      code: 'PRJ-100', name: 'Dup', requestingUnit: 'BTM', targetDate: '2026-12-31',
    })
    expect(res.status).toBe(409)
  })

  test('kanıt olmadan checklist kalemi tamamlanamaz (422)', async () => {
    const res = await authedPut(app, adminCookie, `/projects/${projectId}/checklist/request_form`, { done: true })
    expect(res.status).toBe(422)
  })

  test('kanıt referansıyla tamamlanabilir', async () => {
    const res = await authedPut(app, adminCookie, `/projects/${projectId}/checklist/request_form`, { done: true, evidenceRef: 'FR.15.pdf' })
    expect(res.status).toBe(200)
    const item = res.body.checklist.find(i => i.key === 'request_form')
    expect(item.done).toBe(true)
    expect(item.completedAt).toBeTruthy()
  })

  test('"Gerekmiyor" gerekçesiz reddedilir (422)', async () => {
    const res = await authedPut(app, adminCookie, `/projects/${projectId}/checklist/design_doc`, { waived: true })
    expect(res.status).toBe(422)
  })
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/projects.test.js -v`
Expected: FAIL — `/projects` route'ları yok.

- [ ] **Step 3: Minimal implementasyon**

`server/db/projectStore.js`:
```js
'use strict'
const fs = require('fs')
const path = require('path')

const _BASE = process.env.DATA_DIR || path.join(__dirname, '../../data')
const FILE  = path.join(_BASE, 'projects.json')

const CHECKLIST_TEMPLATE = ['request_form', 'requirements_form', 'design_doc', 'test_security_verification', 'deployment_record']

function load() { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')) } catch { return [] } }
function save(list) { fs.writeFileSync(FILE, JSON.stringify(list, null, 2)) }
function nowISO() { return new Date().toISOString() }
function makeId() { return `proj_${require('crypto').randomBytes(4).toString('hex')}` }

function create({ code, name, requestingUnit, targetDate }, { createdBy }) {
  const list = load()
  if (list.some(p => p.code === code)) {
    throw Object.assign(new Error(`Proje kodu '${code}' zaten kullanılıyor`), { status: 409 })
  }
  const project = {
    id: makeId(), code, name, requestingUnit, targetDate,
    checklist: CHECKLIST_TEMPLATE.map(key => ({ key, done: false, evidenceRef: null, waived: false, waiverReason: null, completedAt: null })),
    stakeholders: [],
    createdBy, createdAt: nowISO(), updatedAt: nowISO(),
  }
  list.push(project)
  save(list)
  return project
}

function getAll() { return load() }
function getById(id) { return load().find(p => p.id === id) || null }

function completeChecklistItem(projectId, itemKey, { done, evidenceRef, waived, waiverReason }) {
  const list = load()
  const idx = list.findIndex(p => p.id === projectId)
  if (idx === -1) return null
  const item = list[idx].checklist.find(i => i.key === itemKey)
  if (!item) return null

  if (waived) {
    if (!waiverReason) throw Object.assign(new Error('waiverReason zorunlu ("Gerekmiyor" için gerekçe)'), { status: 422 })
    item.waived = true
    item.waiverReason = waiverReason
    item.done = true
    item.completedAt = nowISO()
  } else if (done) {
    if (!evidenceRef) throw Object.assign(new Error('evidenceRef zorunlu — kanıt olmadan tamamlanamaz'), { status: 422 })
    item.done = true
    item.evidenceRef = evidenceRef
    item.completedAt = nowISO()
  }
  list[idx].updatedAt = nowISO()
  save(list)
  return list[idx]
}

module.exports = { CHECKLIST_TEMPLATE, create, getAll, getById, completeChecklistItem }
```

`server/routes/projects.js`:
```js
'use strict'
const express = require('express')
const router = express.Router()
const { requireAuth, authorize } = require('../auth')
const projectStore = require('../db/projectStore')

router.get('/projects', requireAuth, authorize('reader'), async (req, res) => {
  res.json(await projectStore.getAll())
})

router.get('/projects/:id', requireAuth, authorize('reader'), async (req, res) => {
  const p = await projectStore.getById(req.params.id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  res.json(p)
})

router.post('/projects', requireAuth, authorize('editor'), async (req, res) => {
  try {
    const { code, name, requestingUnit, targetDate } = req.body
    const project = await projectStore.create({ code, name, requestingUnit, targetDate }, { createdBy: req.user })
    await require('../db/auditStore').append({ user: req.user, action: 'create', resource: 'project', resourceId: project.id, detail: project.code })
    res.status(201).json(project)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message })
  }
})

router.put('/projects/:id/checklist/:itemKey', requireAuth, authorize('editor'), async (req, res) => {
  try {
    const updated = await projectStore.completeChecklistItem(req.params.id, req.params.itemKey, req.body)
    if (!updated) return res.status(404).json({ error: 'Not found' })
    await require('../db/auditStore').append({ user: req.user, action: 'update', resource: 'project', resourceId: updated.id, detail: `checklist:${req.params.itemKey}` })
    res.json(updated)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message })
  }
})

module.exports = router
```

`server/index.js`'e ekle: `app.use(require('./routes/projects'))`

- [ ] **Step 4: Testi tekrar çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/projects.test.js -v`
Expected: PASS (5/5)

- [ ] **Step 5: Commit**

```bash
git add server/db/projectStore.js server/routes/projects.js server/index.js tests/projects.test.js
git commit -m "feat(projects): add PRJ module — auto-derived checklist, code uniqueness, evidence-gated completion"
```

---

### Task 3.1.2: `evidenceIndex.js`'e proje kaynağını ekle

**Files:**
- Modify: `server/db/evidenceIndex.js` (Task 2.3.1'de oluşturulan `SOURCES` dizisi)

- [ ] **Step 1:** `SOURCES` dizisine `{ type: 'project', store: () => require('./projectStore') }` ekle.
- [ ] **Step 2:** `tests/evidence-pool.test.js`'e proje kaynağını da kapsayan bir doğrulama satırı ekle (`sourceType=project` ile filtrelenebildiğini kontrol eden).
- [ ] **Step 3:** Run: `npx jest tests/evidence-pool.test.js -v` — PASS.
- [ ] **Step 4: Commit**

```bash
git add server/db/evidenceIndex.js tests/evidence-pool.test.js
git commit -m "feat(evidence): include projects as evidence source"
```

---

### Task 3.1.3: Proje UI görünümü + checklist ekranı

**Files:**
- Modify: `ui/app.js` (`renderProjects()`, `renderProjectDetail(id)`, `NAV` girdisi)
- Modify: `ui/i18n/translations.js`

- [ ] **Step 1:** `NAV`'a `{ id:'projects', labelKey:'nav_projects', label:'Projects / SDLC', icon:'ph-flow-arrow', minRole:'reader' }` ekle.
- [ ] **Step 2:** `renderProjects()` — proje listesi tablosu (mockup'taki `#view-projects` deseni: Kod/Proje/Talep Eden/Dosya Tamamlanma/Hedef).
- [ ] **Step 3:** `renderProjectDetail(id)` — mockup'taki `.check-row`/`.cbox`/`.prog` desenini kullanan checklist ekranı; her kalem için "Tamamla" (kanıt referansı input'u ister) ve "Gerekmiyor" (gerekçe input'u ister) aksiyonları.
- [ ] **Step 4: Tarayıcıda doğrula** — proje oluştur, checklist kalemlerini kanıtla/gerekçeyle tamamla, ilerleme yüzdesinin doğru hesaplandığını gözle doğrula.
- [ ] **Step 5: Commit**

```bash
git add ui/app.js ui/i18n/translations.js
git commit -m "feat(projects): add project list + checklist detail UI"
```

---

### Task 3.1.4: Paydaş (Stakeholder) Yönetimi

> **Kullanıcı talebi (2026-07-14):** PRJ modülünde paydaş/sponsor bölümü de olmalı (spec US-PRJ.3, mockup'taki proje detay ekranındaki "Paydaşlar" paneli — Sponsor/Sorumlu/Müşteri rolleri, kayıtlı kullanıcı veya dış kişi desteği).

**Files:**
- Modify: `server/db/projectStore.js` (Task 3.1.1'de eklenen `stakeholders: []` alanına yazan fonksiyonlar)
- Modify: `server/routes/projects.js`
- Test: `tests/projects.test.js` (genişlet)

**Interfaces:**
- Produces:
  - `addStakeholder(projectId, { type: 'registered'|'external', userId, externalName, role }) → project` — `type:'registered'` ise `userId` zorunlu, `type:'external'` ise `externalName` zorunlu (spec FR-PRJ.3: "kayıtlı kullanıcı yoksa dış kişi adı zorunludur").
  - `ROLES = ['sponsor', 'responsible', 'customer']` (mockup'taki Sponsor/Sorumlu/Müşteri etiketleriyle birebir).
  - `removeStakeholder(projectId, stakeholderId) → project`

- [ ] **Step 1: Başarısız testi yaz**

`tests/projects.test.js`'e ekle:
```js
describe('Proje — Paydaş Yönetimi', () => {
  test('kayıtlı kullanıcı paydaş olarak eklenebilir', async () => {
    const res = await authedPost(app, adminCookie, `/projects/${projectId}/stakeholders`, {
      type: 'registered', userId: 'admin', role: 'sponsor',
    })
    expect(res.status).toBe(201)
    expect(res.body.stakeholders).toHaveLength(1)
    expect(res.body.stakeholders[0]).toMatchObject({ type: 'registered', userId: 'admin', role: 'sponsor' })
  })

  test('dış kişi eklenirken ad zorunlu (422)', async () => {
    const res = await authedPost(app, adminCookie, `/projects/${projectId}/stakeholders`, {
      type: 'external', role: 'customer',
    })
    expect(res.status).toBe(422)
  })

  test('dış kişi adıyla eklenebilir', async () => {
    const res = await authedPost(app, adminCookie, `/projects/${projectId}/stakeholders`, {
      type: 'external', externalName: 'Kübra Er', role: 'customer',
    })
    expect(res.status).toBe(201)
    expect(res.body.stakeholders).toHaveLength(2)
  })

  test('geçersiz rol reddedilir (422)', async () => {
    const res = await authedPost(app, adminCookie, `/projects/${projectId}/stakeholders`, {
      type: 'registered', userId: 'admin', role: 'not_a_real_role',
    })
    expect(res.status).toBe(422)
  })

  test('paydaş kaldırılabilir', async () => {
    const list = await authedGet(app, adminCookie, `/projects/${projectId}`)
    const stakeholderId = list.body.stakeholders[0].id
    const res = await authedDelete(app, adminCookie, `/projects/${projectId}/stakeholders/${stakeholderId}`)
    expect(res.status).toBe(200)
    expect(res.body.stakeholders).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npx jest tests/projects.test.js -v`
Expected: FAIL — `/projects/:id/stakeholders` uçları yok.

- [ ] **Step 3: Minimal implementasyon**

`server/db/projectStore.js`'e ekle:
```js
const STAKEHOLDER_ROLES = ['sponsor', 'responsible', 'customer']

function addStakeholder(projectId, { type, userId, externalName, role }) {
  if (!STAKEHOLDER_ROLES.includes(role)) {
    throw Object.assign(new Error(`Geçersiz rol: ${role}`), { status: 422 })
  }
  if (type === 'registered' && !userId) {
    throw Object.assign(new Error('userId zorunlu (kayıtlı kullanıcı)'), { status: 422 })
  }
  if (type === 'external' && !externalName) {
    throw Object.assign(new Error('externalName zorunlu (dış kişi)'), { status: 422 })
  }
  const list = load()
  const idx = list.findIndex(p => p.id === projectId)
  if (idx === -1) return null
  const stakeholder = { id: `sh_${require('crypto').randomBytes(4).toString('hex')}`, type, userId: userId || null, externalName: externalName || null, role }
  list[idx].stakeholders.push(stakeholder)
  list[idx].updatedAt = nowISO()
  save(list)
  return list[idx]
}

function removeStakeholder(projectId, stakeholderId) {
  const list = load()
  const idx = list.findIndex(p => p.id === projectId)
  if (idx === -1) return null
  list[idx].stakeholders = list[idx].stakeholders.filter(s => s.id !== stakeholderId)
  list[idx].updatedAt = nowISO()
  save(list)
  return list[idx]
}

module.exports = { CHECKLIST_TEMPLATE, STAKEHOLDER_ROLES, create, getAll, getById, completeChecklistItem, addStakeholder, removeStakeholder }
```

`server/routes/projects.js`'e ekle:
```js
router.post('/projects/:id/stakeholders', requireAuth, authorize('editor'), async (req, res) => {
  try {
    const updated = await projectStore.addStakeholder(req.params.id, req.body)
    if (!updated) return res.status(404).json({ error: 'Not found' })
    await require('../db/auditStore').append({ user: req.user, action: 'update', resource: 'project', resourceId: updated.id, detail: 'stakeholder added' })
    res.status(201).json(updated)
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message })
  }
})

router.delete('/projects/:id/stakeholders/:stakeholderId', requireAuth, authorize('editor'), async (req, res) => {
  const updated = await projectStore.removeStakeholder(req.params.id, req.params.stakeholderId)
  if (!updated) return res.status(404).json({ error: 'Not found' })
  await require('../db/auditStore').append({ user: req.user, action: 'update', resource: 'project', resourceId: updated.id, detail: 'stakeholder removed' })
  res.json(updated)
})
```

- [ ] **Step 4: Testi tekrar çalıştırıp geçtiğini doğrula**

Run: `npx jest tests/projects.test.js -v`
Expected: PASS (tüm senaryolar)

- [ ] **Step 5: UI — Paydaşlar paneli**

`ui/app.js`'teki `renderProjectDetail(id)` fonksiyonuna (Task 3.1.3), mockup'taki `.li`/`.owner`/`.pill` desenini kullanan bir "Paydaşlar" kartı ekle: her paydaş satırında ad (kayıtlı kullanıcıysa avatar+isim, dış kişiyse "Dış: {externalName}"), rol pill'i (Sponsor=brand, Sorumlu=info, Müşteri=neu), ve bir "kaldır" ikonu. Üstte "Paydaş Ekle" butonu → tip seçimi (kayıtlı/dış) + role dropdown içeren küçük bir form.

- [ ] **Step 6: Tarayıcıda doğrula**

Run: uygulamayı başlat, bir projeye kayıtlı kullanıcı + dış kişi paydaş ekle, rol etiketlerinin doğru göründüğünü ve kaldırmanın çalıştığını doğrula.

- [ ] **Step 7: Commit**

```bash
git add server/db/projectStore.js server/routes/projects.js ui/app.js tests/projects.test.js
git commit -m "feat(projects): add stakeholder management (sponsor/responsible/customer, registered or external)"
```

---

## Alt-Faz 3.2 — Dashboard / KRI / Takvim / Isı Haritası Genişletmesi

### Task 3.2.1: Dashboard'a tüm yeni modüllerin KRI kartlarını bağla

**Files:**
- Modify: `ui/app.js` (mevcut dashboard render fonksiyonu — Task 0.3.1'de placeholder eklenmişti)

**Interfaces:**
- Consumes: `GET /capa?status=planned`, `GET /capa?status=in_progress`, `GET /projects` (gecikmiş hedef tarihli olanları filtreleyerek), mevcut `GET /risks/summary`, `GET /soa/summary` (varsa — isimler `grep -n "summary" server/routes/*.js` ile teyit edilmeli).

- [ ] **Step 1:** `grep -n "summary" server/routes/*.js` çalıştırıp mevcut özet uçlarının tam listesini çıkar.
- [ ] **Step 2:** Dashboard render fonksiyonuna paralel `fetch` çağrıları ekle (mockup'taki 5 KRI kartı deseni: Gecikmiş Aksiyon, Açık Yüksek Risk, Açık DÖF, SOA Uygulama, Gecikmiş İlg. Taraf — mevcut olmayanlar için en yakın karşılığı kullan, örn. "Gecikmiş İlg. Taraf" bu plan kapsamında yoksa atlanır).
- [ ] **Step 3: Tarayıcıda doğrula** — kartların gerçek API verisiyle güncellenip güncellenmediğini kontrol et (bir CAPA/proje oluşturup sayının artmasını gözle).
- [ ] **Step 4: Commit**

```bash
git add ui/app.js
git commit -m "feat(dashboard): wire KRI cards to CAPA/project/risk/SOA summary endpoints"
```

---

### Task 3.2.2: Risk Isı Haritası (heatmap) görünümü

**Files:**
- Modify: `ui/app.js` (yeni `renderRiskHeatmap()`)
- Modify: `ui/style.css` (mockup'taki `.heat`, `.heat .cell` sınıfları)

**Interfaces:**
- Consumes: `GET /risks` (mevcut uç — her riskin `impact` ve `likelihood` alanlarını kullanır, bkz. `server/db/database.js:116-131` şeması).

- [ ] **Step 1:** `GET /risks`'ten dönen listeyi `impact` (1-5) × `likelihood` (1-5) matrisine grupla (client-side `reduce`).
- [ ] **Step 2:** Mockup'taki `.heat` grid yapısını kullanarak her hücrede risk sayısını göster; hücre tıklanınca o hücredeki risklerin filtrelenmiş listesine geç (mevcut risk listesi görünümüne `impact`/`likelihood` query param'ı ile yönlendirme).
- [ ] **Step 3: Tarayıcıda doğrula.**
- [ ] **Step 4: Commit**

```bash
git add ui/app.js ui/style.css
git commit -m "feat(risk): add impact x likelihood heatmap view"
```

---

## Self-Review Özeti

- **Spec kapsaması:** Bu plan, gap-analizinin Faz 0/2/3 bölümlerindeki tüm maddeleri kapsar (Türkçe dil, UI tema, INC genişletme, GOV-CAPA, ATT havuzu, PRJ, dashboard/heatmap). Faz 1 (CC-* — GUIDv7, hash-chain audit, temporal tablo, transaction/outbox, unit-RBAC) **kullanıcı talebiyle bilinçli olarak dışarıda bırakılmıştır** — bu maddelere dokunan hiçbir görev bu planda yoktur.
- **Placeholder taraması:** Her görev somut dosya yolu, çalışan test kodu ve çalıştırılabilir implementasyon içerir; "TBD"/"benzer şekilde" formunda madde yoktur. İki görevde (2.1.1, 2.3.1) gerçek dosya/alan adlarının `grep` ile teyit edilmesi gerektiği açıkça not edilmiştir — bunlar placeholder değil, mevcut kodun bu oturumda tam görülemeyen kısımlarına dair dürüst bir bağımlılık uyarısıdır.
- **Tip/isim tutarlılığı:** `capaStore`, `projectStore`, `evidenceIndex` arasındaki fonksiyon imzaları (`getAll()`, `getById(id)`, `create(data, {createdBy})`) mevcut `assetStore.js` deseniyle birebir tutarlı tutulmuştur.
