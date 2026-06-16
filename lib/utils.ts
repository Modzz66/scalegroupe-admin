export function formatEuro(n: number) {
  return new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR', minimumFractionDigits:0 }).format(n)
}

export function formatDate(s: string) {
  return new Date(s).toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' })
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
}

export function exportCSV(data: Record<string, unknown>[], filename: string) {
  const csv = [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n')
  const blob = new Blob([csv], { type:'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click()
}
