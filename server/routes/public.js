// © 2026 Claude Hecker — ISMS Builder V 1.29 — AGPL-3.0
'use strict'
const express = require('express')
const router = express.Router()
const { requireAuth, authorize } = require('../auth')
const publicIncidentStore = require('../db/publicIncidentStore')

// Splash-Konfiguration öffentlich abrufbar (Login-Seite braucht sie vor Auth)
router.get('/public/splash', async (req, res) => {
  try {
    const orgSettingsStore = require('../db/orgSettingsStore')
    const s = await orgSettingsStore.get()
    const sp = s.splashScreen || {}
    res.json({ enabled: sp.enabled !== false, duration: Math.min(30, Math.max(1, Number(sp.duration) || 7)) })
  } catch { res.json({ enabled: true, duration: 7 }) }
})

// Öffentliche Gesellschaftsliste (kein Login nötig)
router.get('/public/entities', async (req, res) => {
  try {
    const entityStore = require('../db/entityStore')
    res.json((await entityStore.getAll()).map(e => ({ id: e.id, name: e.name })))
  } catch { res.json([]) }
})

// Jeder kann einen Vorfall melden
router.post('/public/incident', async (req, res) => {
  const { email, entityName, incidentType, description, measuresTaken, localContact, cleanedUp, severity, occurredAt, assetId, assetName } = req.body || {}
  if (!email || !incidentType || !description) {
    return res.status(400).json({ error: 'email, incidentType und description sind Pflichtfelder.' })
  }
  const incident = await publicIncidentStore.create({ email, entityName, incidentType, description, measuresTaken, localContact, cleanedUp, severity, occurredAt, assetId, assetName })
  res.status(201).json({ ok: true, refNumber: incident.refNumber, id: incident.id })
})

// CISO / contentowner: Liste aller gemeldeten Vorfälle
router.get('/public/incidents', requireAuth, authorize('contentowner'), async (req, res) => {
  const { status } = req.query
  res.json(await publicIncidentStore.getAll(status ? { status } : {}))
})

// CISO / contentowner: Einzelnen Vorfall abrufen
router.get('/public/incident/:id', requireAuth, authorize('contentowner'), async (req, res) => {
  const item = await publicIncidentStore.getById(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(item)
})

// CISO / contentowner: Vorfall zuweisen / aktualisieren
router.put('/public/incident/:id', requireAuth, authorize('contentowner'), async (req, res) => {
  let updated = await publicIncidentStore.update(req.params.id, req.body, req.user)
  if (!updated) return res.status(404).json({ error: 'Not found' })

  // FR-INC.4: "Düzeltici faaliyet gerekli" işaretlenince otomatik CAPA açılır — manuel buton yok.
  if (req.body.correctiveActionRequired === true && !updated.linkedCapaId) {
    const capaStore = require('../db/capaStore')
    const capa = await capaStore.createFromAutomation({
      title: `Olay düzeltici faaliyeti — ${updated.refNumber || updated.id}`,
      description: updated.description || '',
      source: 'incident',
      sourceRef: updated.id,
      owner: req.user,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    })
    updated = await publicIncidentStore.update(req.params.id, { linkedCapaId: capa.id }, req.user)
    await require('../db/auditStore').append({ user: req.user, action: 'create', resource: 'capa', resourceId: capa.id, detail: `auto-opened from incident ${updated.id}` })
  }

  res.json(updated)
})

// CISO / contentowner: Müdahale/izolasyon adımını işaretle
router.put('/public/incident/:id/response-step', requireAuth, authorize('contentowner'), async (req, res) => {
  const { step, done } = req.body || {}
  const updated = await publicIncidentStore.updateResponseStep(req.params.id, step, done, req.user)
  if (!updated) return res.status(404).json({ error: 'Not found' })
  await require('../db/auditStore').append({ user: req.user, action: 'update', resource: 'public-incident', resourceId: updated.id, detail: `response-step:${step}=${done}` })
  res.json(updated)
})

// Admin: Vorfall in Papierkorb verschieben (Soft-Delete)
router.delete('/public/incident/:id', requireAuth, authorize('admin'), async (req, res) => {
  const ok = await publicIncidentStore.delete(req.params.id, req.user)
  if (!ok) return res.status(404).json({ error: 'Not found' })
  await require('../db/auditStore').append({ user: req.user, action: 'delete', resource: 'public-incident', resourceId: req.params.id })
  res.json({ deleted: true })
})

// Admin: Vorfall endgültig löschen
router.delete('/public/incident/:id/permanent', requireAuth, authorize('admin'), async (req, res) => {
  const ok = await publicIncidentStore.permanentDelete(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Not found' })
  await require('../db/auditStore').append({ user: req.user, action: 'permanent_delete', resource: 'public-incident', resourceId: req.params.id })
  res.json({ deleted: true, permanent: true })
})

// Admin: Vorfall wiederherstellen
router.post('/public/incident/:id/restore', requireAuth, authorize('admin'), async (req, res) => {
  const item = await publicIncidentStore.restore(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  await require('../db/auditStore').append({ user: req.user, action: 'restore', resource: 'public-incident', resourceId: req.params.id })
  res.json(item)
})

module.exports = router
