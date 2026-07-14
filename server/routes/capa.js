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
