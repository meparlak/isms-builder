'use strict'
const fs = require('fs')
const path = require('path')

describe('i18n — Turkish locale desteği', () => {
  const tSrc = fs.readFileSync(path.join(__dirname, '../ui/i18n/t.js'), 'utf8')

  test('SUPPORTED dizisi tr içerir', () => {
    expect(tSrc).toMatch(/SUPPORTED\s*=\s*\[[^\]]*'tr'[^\]]*\]/)
  })

  test('detectBrowserLang tr önekini tanır', () => {
    expect(tSrc).toMatch(/nav\.startsWith\('tr'\)/)
  })
})
