function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportCSV<T extends Record<string, unknown>>(rows: T[], filename: string) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(',')]
  for (const row of rows) {
    csv.push(headers.map((h) => {
      const v = row[h]
      const s = v == null ? '' : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))
  }
  download(filename, csv.join('\n'), 'text/csv;charset=utf-8')
}

export function exportExcelCSV<T extends Record<string, unknown>>(rows: T[], filename: string) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csv = [headers.join(',')]
  for (const row of rows) {
    csv.push(headers.map((h) => {
      const v = row[h]
      const s = v == null ? '' : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }).join(','))
  }
  download(filename, '﻿' + csv.join('\n'), 'application/vnd.ms-excel;charset=utf-8')
}
