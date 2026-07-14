// © 2026 Claude Hecker — ISMS Builder V 1.29 — AGPL-3.0
'use strict'
const express = require('express')
const router = express.Router()
const { requireAuth, authorize } = require('../auth')
const evidenceIndex = require('../db/evidenceIndex')

// Kanıt havuzu — modüllere dağılmış dosya eklerini (bcm, governance, legal,
// şablonlar) tek bir salt-okunur listede birleştiren agregasyon ucu.
// Yeni bir dosya deposu değildir; mevcut store'ların üstünde bir görünüm.
router.get('/evidence', requireAuth, authorize('reader'), async (req, res) => {
  res.json(await evidenceIndex.listAll(req.query))
})

router.get('/evidence/sources', requireAuth, authorize('reader'), (req, res) => {
  res.json(evidenceIndex.SOURCES.map(s => s.type))
})

module.exports = router
