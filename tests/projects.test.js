'use strict'
const { createTestDataDir, removeTestDataDir } = require('./setup/testEnv')
const { loginAs, authedPost, authedPut, authedGet } = require('./setup/authHelper')

let dataDir, app, adminCookie
let projectId

beforeAll(async () => {
  dataDir = createTestDataDir()
  process.env.DATA_DIR        = dataDir
  process.env.JWT_SECRET      = 'jest-test-secret-projects'
  process.env.NODE_ENV        = 'test'
  process.env.STORAGE_BACKEND = 'json'
  app = require('../server/index.js')
  adminCookie = await loginAs(app, 'admin')
})

afterAll(async () => { removeTestDataDir(dataDir) })

describe('Proje / SDLC modülü', () => {
  test('POST /projects — checklist otomatik türer (5 kalem)', async () => {
    const res = await authedPost(app, adminCookie, '/projects', {
      code: 'PRJ-100', name: 'Test Projesi', requestingUnit: 'BTM', targetDate: '2026-12-31',
    })
    expect(res.status).toBe(201)
    expect(res.body.checklist).toHaveLength(5)
    expect(res.body.checklist.every(i => i.done === false)).toBe(true)
    projectId = res.body.id
  })

  test('aynı kod ikinci kez kullanılamaz (409)', async () => {
    const res = await authedPost(app, adminCookie, '/projects', {
      code: 'PRJ-100', name: 'Dup', requestingUnit: 'BTM', targetDate: '2026-12-31',
    })
    expect(res.status).toBe(409)
  })

  test('kanıt olmadan checklist kalemi tamamlanamaz (422)', async () => {
    const res = await authedPut(app, adminCookie, `/projects/${projectId}/checklist/request_form`, { done: true })
    expect(res.status).toBe(422)
  })

  test('kanıt referansıyla tamamlanabilir', async () => {
    const res = await authedPut(app, adminCookie, `/projects/${projectId}/checklist/request_form`, { done: true, evidenceRef: 'FR.15.pdf' })
    expect(res.status).toBe(200)
    const item = res.body.checklist.find(i => i.key === 'request_form')
    expect(item.done).toBe(true)
    expect(item.completedAt).toBeTruthy()
  })

  test('"Gerekmiyor" gerekçesiz reddedilir (422)', async () => {
    const res = await authedPut(app, adminCookie, `/projects/${projectId}/checklist/design_doc`, { waived: true })
    expect(res.status).toBe(422)
  })
})
