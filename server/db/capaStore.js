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
  if (c.status === 'closed') {
    throw Object.assign(new Error('Kapalı CAPA ilerleme güncellemesiyle yeniden açılamaz'), { status: 409 })
  }
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
// için ayrı, MANUAL_ALLOWED_SOURCES kontrolü yapmayan fonksiyon. Bu fonksiyon route
// katmanında DIŞARIYA açılmaz — yalnız sunucu içi kod (incident/rollback/continuity-test
// entegrasyonları) çağırabilir. (source, sourceRef) çiftine göre tekilleştirir.
function createFromAutomation({ title, description = '', source, sourceRef, owner, dueDate }) {
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
