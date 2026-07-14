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

  test('PUT /capa/:id/progress — kapalı CAPA yeniden açılamaz (409)', async () => {
    const before = await authedGet(app, adminCookie, `/capa/${capaId}`)
    expect(before.body.status).toBe('closed')

    const res = await authedPut(app, adminCookie, `/capa/${capaId}/progress`, { progress: 50 })
    expect(res.status).toBe(409)

    const after = await authedGet(app, adminCookie, `/capa/${capaId}`)
    expect(after.body.status).toBe('closed')
    expect(after.body.progress).toBe(before.body.progress)
    expect(after.body.completedAt).toBe(before.body.completedAt)
  })
})

describe('CAPA — olaydan otomatik tetikleme', () => {
  test('olayda correctiveActionRequired=true işaretlenince CAPA otomatik açılır', async () => {
    const incRes = await require('supertest')(app).post('/public/incident').send({
      email: 'melder-capa1@example.com',
      incidentType: 'unauthorized_access',
      description: 'Yetkisiz erişim denemesi',
    })
    expect(incRes.status).toBe(201)
    const incId = incRes.body.id

    const flagRes = await authedPut(app, adminCookie, `/public/incident/${incId}`, { correctiveActionRequired: true })
    expect(flagRes.status).toBe(200)
    expect(flagRes.body.linkedCapaId).toBeTruthy()

    const capaListRes = await authedGet(app, adminCookie, '/capa?source=incident')
    const linked = capaListRes.body.find(c => c.id === flagRes.body.linkedCapaId)
    expect(linked).toBeTruthy()
    expect(linked.sourceRef).toBe(incId)

    const getRes = await authedGet(app, adminCookie, `/public/incident/${incId}`)
    expect(getRes.body.linkedCapaId).toBe(flagRes.body.linkedCapaId)
  })

  test('aynı olay ikinci kez işaretlenirse CAPA tekrar üretilmez (tekilleştirme)', async () => {
    const incRes = await require('supertest')(app).post('/public/incident').send({
      email: 'melder-capa2@example.com',
      incidentType: 'unauthorized_access',
      description: 'İkinci test olayı',
    })
    const incId = incRes.body.id
    const first  = await authedPut(app, adminCookie, `/public/incident/${incId}`, { correctiveActionRequired: true })
    const second = await authedPut(app, adminCookie, `/public/incident/${incId}`, { correctiveActionRequired: true })
    expect(second.body.linkedCapaId).toBe(first.body.linkedCapaId)

    const capaListRes = await authedGet(app, adminCookie, '/capa?source=incident')
    const matches = capaListRes.body.filter(c => c.sourceRef === incId)
    expect(matches.length).toBe(1)
  })

  test('POST /capa ile source=incident gönderilirse reddedilir (yalnız otomasyon açabilir)', async () => {
    const res = await authedPost(app, adminCookie, '/capa', { title: 'x', source: 'incident', owner: 'admin', dueDate: '2026-12-31' })
    expect(res.status).toBe(422)
  })
})
