'use strict'
const { createTestDataDir, removeTestDataDir } = require('./setup/testEnv')
const { loginAs, authedGet, authedPost } = require('./setup/authHelper')

let dataDir, app, adminCookie, contentownerCookie

beforeAll(async () => {
  dataDir = createTestDataDir()
  process.env.DATA_DIR        = dataDir
  process.env.JWT_SECRET      = 'jest-test-secret-evidence'
  process.env.NODE_ENV        = 'test'
  process.env.STORAGE_BACKEND = 'json'
  app = require('../server/index.js')
  adminCookie        = await loginAs(app, 'admin')
  contentownerCookie = await loginAs(app, 'contentowner')
})

afterAll(async () => { removeTestDataDir(dataDir) })

describe('Kanıt Havuzu — agregasyon (/evidence)', () => {
  test('GET /evidence — başlangıçta boş liste, 200', async () => {
    const res = await authedGet(app, adminCookie, '/evidence')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(0)
  })

  test('bir hukuki sözleşme kaydına dosya eklenince /evidence içinde görünür', async () => {
    // Gerçek attachments deseni legalStore.js'de: bir sözleşme kaydı oluştur,
    // ardından gerçek multer ucu olan POST /legal/contracts/:id/attachments
    // ile dosya yükle (bkz. server/routes/legal.js, legalAttachRoutes).
    const contractRes = await authedPost(app, contentownerCookie, '/legal/contracts', {
      title:        'Test Sözleşme – Kanıt Havuzu',
      contractType: 'service',
      counterparty: 'Acme GmbH',
    })
    expect(contractRes.status).toBe(201)
    const contractId = contractRes.body.id

    const uploadRes = await require('supertest')(app)
      .post(`/legal/contracts/${contractId}/attachments`)
      .set('Cookie', contentownerCookie)
      .attach('file', Buffer.from('kanit-dosyasi-icerigi'), 'kanit.pdf')

    expect(uploadRes.status).toBe(201)

    const res = await authedGet(app, adminCookie, '/evidence?sourceType=legal_contract')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
    expect(res.body[0]).toMatchObject({
      sourceType:   'legal_contract',
      sourceId:     contractId,
      sourceTitle:  'Test Sözleşme – Kanıt Havuzu',
      originalName: 'kanit.pdf',
    })

    // Filtrelenmemiş /evidence içinde de görünmeli
    const all = await authedGet(app, adminCookie, '/evidence')
    expect(all.body.some(e => e.sourceId === contractId)).toBe(true)

    // Alakasız sourceType filtresi bu kaydı döndürmemeli
    const filtered = await authedGet(app, adminCookie, '/evidence?sourceType=bcm_bia')
    expect(filtered.body.some(e => e.sourceId === contractId)).toBe(false)
  })

  test('/evidence auth olmadan 401', async () => {
    const res = await require('supertest')(app).get('/evidence')
    expect(res.status).toBe(401)
  })
})
