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
