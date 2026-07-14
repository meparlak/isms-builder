// © 2026 Claude Hecker — ISMS Builder V 1.29 — AGPL-3.0
'use strict'
// Modüllere dağılmış dosya eklerini (multer ile yüklenmiş, her modülün kendi
// kaydında tutulan `attachments` alanları) tek bir salt-okunur görünümde
// toplayan agregasyon katmanı.
//
// Bu bir YENİ dosya deposu DEĞİLDİR — mevcut store'ların üstünde bir "view"
// işlevi görür. Aşağıdaki SOURCES listesi, koda göre doğrulanmış gerçek
// alan adlarına dayanır (bkz. task-2.3.1-report.md):
//
//   - assetStore.js ve publicIncidentStore.js: dosya eki alanı YOK
//     (bu modüller kapsam dışı bırakıldı — bkz. rapor).
//   - riskStore.js ve supplierStore.js: dosya eki alanı YOK
//     (bu modüller de kapsam dışı bırakıldı).
//   - bcmStore.js: tek bir getAll() yok; üç alt-koleksiyon var
//     (bia/plans/exercises), her biri kendi getX() fonksiyonuyla okunur.
//     Ek şekli: { id, filename, storedName, size, uploadedBy, uploadedAt }.
//   - governanceStore.js: üç alt-koleksiyon (reviews/actions/meetings).
//     Ek şekli bcm ile aynı desende (bkz. server/routes/governance.js).
//   - legalStore.js: üç alt-nesne (contracts/ndas/privacyPolicies), her biri
//     kendi getAll()'una sahip. Ek şekli: { id, filename, originalName,
//     size, uploadedBy, uploadedAt, filePath }.
//   - şablonlar (server/storage.js → getTemplates): tek düz getTemplates({})
//     ile okunur. Ek şekli: { id, filename, originalName, size, uploadedBy,
//     uploadedAt } (server/routes/templates.js).
//
// Not: Hiçbir modülde `fileType` veya `scanStatus` alanı yok (FR-ATT.2
// zararlı içerik taraması bu görevin kapsamında değil — ayrı bir alt-görev).
// Bu yüzden `scanStatus` filtresi burada UYGULANMAMIŞTIR.

const SOURCES = [
  { type: 'bcm_bia',       fetch: async () => (await require('./bcmStore').getBia()) || [] },
  { type: 'bcm_plan',      fetch: async () => (await require('./bcmStore').getPlans()) || [] },
  { type: 'bcm_exercise',  fetch: async () => (await require('./bcmStore').getExercises()) || [] },

  { type: 'governance_review',  fetch: async () => (await require('./governanceStore').getReviews()) || [] },
  { type: 'governance_action',  fetch: async () => (await require('./governanceStore').getActions()) || [] },
  { type: 'governance_meeting', fetch: async () => (await require('./governanceStore').getMeetings()) || [] },

  { type: 'legal_contract',       fetch: async () => (await require('./legalStore').contracts.getAll()) || [] },
  { type: 'legal_nda',            fetch: async () => (await require('./legalStore').ndas.getAll()) || [] },
  { type: 'legal_privacy_policy', fetch: async () => (await require('./legalStore').privacyPolicies.getAll()) || [] },

  { type: 'template', fetch: async () => (await require('../storage').getTemplates({})) || [] },
  // Yeni modül eklendikçe (PRJ — Faz 3) buraya bir satır eklenir.
]

async function listAll({ sourceType } = {}) {
  const sources = sourceType ? SOURCES.filter(s => s.type === sourceType) : SOURCES
  const out = []
  for (const src of sources) {
    let records = []
    try {
      records = await src.fetch()
    } catch (e) {
      // Bir modülün deposu bu ortamda kurulu/erişilebilir değilse (ör.
      // eksik veri dosyası), agregasyonun tamamını düşürmek yerine sadece
      // o kaynağı atla.
      continue
    }
    for (const rec of records || []) {
      for (const att of (rec.attachments || [])) {
        out.push({
          ...att,
          sourceType:  src.type,
          sourceId:    rec.id,
          sourceTitle: rec.title || rec.name || '',
        })
      }
    }
  }
  return out
}

module.exports = { listAll, SOURCES }
