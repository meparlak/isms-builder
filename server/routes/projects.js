// © 2026 — Proje / SDLC route'ları
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
