'use strict'
const { createTestDataDir, removeTestDataDir } = require('./setup/testEnv')
const { loginAs, authedGet, authedPost, authedPut } = require('./setup/authHelper')

let dataDir, app, adminCookie
let incidentId

beforeAll(async () => {
  dataDir = createTestDataDir()
  process.env.DATA_DIR        = dataDir
  process.env.JWT_SECRET      = 'jest-test-secret-incresp'
  process.env.NODE_ENV        = 'test'
  process.env.STORAGE_BACKEND = 'json'
  app = require('../server/index.js')
  adminCookie = await loginAs(app, 'admin')
})

afterAll(async () => {
  removeTestDataDir(dataDir)
})

describe('Incident — müdahale/izolasyon kayıtları', () => {
  test('POST /public/incident oluşturulunca varsayılan responseLog dolu dizi olur', async () => {
    const createRes = await require('supertest')(app).post('/public/incident').send({
      email: 'melder@example.com',
      incidentType: 'unauthorized_access',
      description: 'Test olay açıklaması',
    })
    expect(createRes.status).toBe(201)
    incidentId = createRes.body.id

    const getRes = await authedGet(app, adminCookie, `/public/incident/${incidentId}`)
    expect(getRes.status).toBe(200)
    expect(Array.isArray(getRes.body.responseLog)).toBe(true)
    expect(getRes.body.responseLog.length).toBeGreaterThan(0)
    expect(getRes.body.responseLog.every(s => s.done === false)).toBe(true)
  })

  test('PUT /public/incident/:id/response-step izolasyon adımını işaretler', async () => {
    const res = await authedPut(app, adminCookie, `/public/incident/${incidentId}/response-step`, {
      step: 'source_ip_blocked', done: true,
    })
    expect(res.status).toBe(200)
    const step = res.body.responseLog.find(s => s.step === 'source_ip_blocked')
    expect(step.done).toBe(true)
    expect(step.doneBy).toBe('admin')
    expect(step.doneAt).toBeTruthy()
  })

  test('PUT /public/incident/:id/response-step bilinmeyen adım için 404 döner', async () => {
    const res = await authedPut(app, adminCookie, `/public/incident/${incidentId}/response-step`, {
      step: 'not_a_real_step', done: true,
    })
    expect(res.status).toBe(404)
  })
})

describe('Incident — severity/occurredAt/asset alanları ve correctiveActionRequired', () => {
  test('POST /public/incident severity/occurredAt/assetId/assetName kaydeder ve GET ile okunabilir', async () => {
    const createRes = await require('supertest')(app).post('/public/incident').send({
      email: 'melder2@example.com',
      incidentType: 'malware',
      description: 'Kritik bir olay açıklaması',
      severity: 'critical',
      occurredAt: '2026-07-10T08:30:00.000Z',
      assetId: 'asset-123',
      assetName: 'Web Sunucusu',
    })
    expect(createRes.status).toBe(201)
    const id = createRes.body.id

    const getRes = await authedGet(app, adminCookie, `/public/incident/${id}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.severity).toBe('critical')
    expect(getRes.body.occurredAt).toBe('2026-07-10T08:30:00.000Z')
    expect(getRes.body.assetId).toBe('asset-123')
    expect(getRes.body.assetName).toBe('Web Sunucusu')
  })

  test('POST /public/incident geçersiz/eksik severity için varsayılan "medium" kullanır', async () => {
    const createRes = await require('supertest')(app).post('/public/incident').send({
      email: 'melder3@example.com',
      incidentType: 'other',
      description: 'Severity belirtilmeyen olay',
    })
    expect(createRes.status).toBe(201)
    const getRes = await authedGet(app, adminCookie, `/public/incident/${createRes.body.id}`)
    expect(getRes.body.severity).toBe('medium')
    expect(getRes.body.occurredAt).toBeNull()
    expect(getRes.body.correctiveActionRequired).toBe(false)
  })

  test('PUT /public/incident/:id correctiveActionRequired alanını kalıcı olarak günceller', async () => {
    const res = await authedPut(app, adminCookie, `/public/incident/${incidentId}`, {
      correctiveActionRequired: true,
    })
    expect(res.status).toBe(200)
    expect(res.body.correctiveActionRequired).toBe(true)

    const getRes = await authedGet(app, adminCookie, `/public/incident/${incidentId}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.correctiveActionRequired).toBe(true)
  })
})
