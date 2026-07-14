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

describe('i18n — tr çeviri kapsamı', () => {
  test('TRANSLATIONS içindeki her anahtarda tr alanı var', () => {
    global.window = {}
    delete require.cache[require.resolve('../ui/i18n/translations.js')]
    require('../ui/i18n/translations.js')
    const dict = global.window.TRANSLATIONS
    const missing = Object.keys(dict).filter(k => !dict[k].tr)
    expect(missing).toEqual([])
  })
})
