export type Coord = { x: number; y: number }

export const sum = (n: number[]) => n.reduce((total, num) => total + num, 0)
export const sumWith = <T>(a: T[], fn: (v: T, i: number) => number) =>
  a.reduce((total, v, i) => total + fn(v, i), 0)
export const uniq = <T>(a: T[]): T[] => a.filter((v, i) => a.indexOf(v) === i)

export function transpose<T>(matrix: T[][]) {
  return matrix[0].map((_, c) => matrix.map((_, r) => matrix[r][c]))
}

export function matrixToString<T>(m: T[][]) {
  return m.map(r => r.join('')).join('\n')
}

/**
 * Parse groups of numbers from a string and return an array of those numbers.
 * @param s
 * @returns
 */
export const nums = (s: string, splitWith = ' ') =>
  s.split(splitWith).map(Number)

const baseUrl = 'https://adventofcode.com'
export async function getInput(day: number, year = 2023) {
  const filename = `${year}-${day}.txt`
  const filePath = `${import.meta.dir}/../../data/${filename}`
  const file = Bun.file(filePath)
  const exists = await file.exists()
  if (!exists) {
    console.log(`File ${filename} not found, fetching from ${baseUrl}.`)
    const Cookie = Bun.env.COOKIE
    if (!Cookie) throw new Error('process.env.COOKIE must be set')
    const headers = new Headers({ Cookie })
    const res = await fetch(`${baseUrl}/${year}/day/${day}/input`, { headers })
    const text = await res.text()
    await Bun.write(file, text.trim())
  }
  return Bun.file(filePath).text()
}
