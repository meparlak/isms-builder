'use strict'
// Tüm çeviri anahtarlarını tarar, tr alanı eksik olanları listeler.
const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '../ui/i18n/translations.js')
const OUT = path.join(__dirname, '../docs/analysis/i18n-tr-todo.json')

// translations.js bir IIFE + window.TRANSLATIONS ataması içeriyor;
// Node'da window yok, sahte bir global ile yükleyip objeyi yakalıyoruz.
global.window = {}
require(SRC)
const dict = global.window.TRANSLATIONS

const todo = {}
let total = 0, missing = 0
for (const [key, entry] of Object.entries(dict)) {
  total++
  if (!entry.tr) {
    missing++
    todo[key] = { en: entry.en || entry.de || '', missingTr: true }
  }
}

fs.writeFileSync(OUT, JSON.stringify(todo, null, 2))
console.log(`[i18n-extract] ${total} anahtar taranadı, ${missing} tanesinde tr eksik. Çıktı: ${OUT}`)
