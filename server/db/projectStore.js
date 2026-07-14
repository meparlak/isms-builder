// © 2026 — Proje / SDLC store (JSON dosya tabanlı, assetStore.js/capaStore.js deseni)
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
