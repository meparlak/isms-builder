'use strict'
// docs/analysis/i18n-tr-todo.json içindeki tr çevirilerini translations.js'e işler.
//
// Yaklaşım: translations.js içindeki her `TRANSLATIONS[key]` girdisi tek satırda
// tanımlanıyor (`key: { de: '...', en: '...', fr: '...', nl: '...' },`). Bu nedenle
// çok satırlı/iç içe regex yerine satır bazlı bir yaklaşım kullanılıyor: her satır
// `^\s*KEY:\s*\{ ... \}` kalıbına uyuyorsa ve KEY todo manifestinde varsa, kapanış
// süslü parantezinden hemen önce `, tr: '...'` eklenir. Bu, dosyanın gerçek
// biçimlendirmesine dayandığı için çok satırlı regex'lere göre çok daha güvenilirdir.
//
// Not: translations.js içinde birkaç anahtar (ör. search_noResultsFor,
// inc_reporterEmail) yanlışlıkla iki kez tanımlanmış (JS obje literal'inde son
// tanım geçerli olur). Bu script her iki satırı da bulup günceller — zararsızdır,
// çünkü etkin olan (son) satır zaten doğru tr değerini alır.
const fs = require('fs')
const path = require('path')

const TODO_FILE = path.join(__dirname, '../docs/analysis/i18n-tr-todo.json')
const TRANS_FILE = path.join(__dirname, '../ui/i18n/translations.js')

const todo = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'))
const src = fs.readFileSync(TRANS_FILE, 'utf8')
const lines = src.split('\n')

const KEY_LINE_RE = /^(\s*)([A-Za-z0-9_]+):(\s*)\{(.*)\}(,?)(\s*)$/

let patched = 0
let skipped = 0
let notFound = 0
const foundKeys = new Set()

const outLines = lines.map((line) => {
  const m = line.match(KEY_LINE_RE)
  if (!m) return line
  const [, indent, key, spaceAfterColon, body, trailingComma, trailingWs] = m
  if (!(key in todo)) return line
  const entry = todo[key]
  if (!entry.tr) {
    skipped++
    return line
  }
  foundKeys.add(key)
  // Aynı escaping stilini kullan: backslash önce, sonra tek tırnak ve kontrol karakterleri.
  const trValue = entry.tr
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
  patched++
  return `${indent}${key}:${spaceAfterColon}{${body}, tr: '${trValue}' }${trailingComma}${trailingWs}`
})

for (const key of Object.keys(todo)) {
  if (todo[key].tr && !foundKeys.has(key)) {
    notFound++
    console.warn(`[i18n-merge] anahtar bulunamadı veya format uyuşmuyor: ${key}`)
  }
}

fs.writeFileSync(TRANS_FILE, outLines.join('\n'))
console.log(`[i18n-merge] ${patched} satır güncellendi, ${skipped} atlandı (tr boş), ${notFound} anahtar dosyada bulunamadı.`)
