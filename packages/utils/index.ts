export const sum = (n: number[]) => n.reduce((sum, num) => sum + num, 0)
export const uniq = <T>(a: T[]): T[] => a.filter((v, i) => a.indexOf(v) === i)

/**
 * Parse groups of numbers from a string and return an array of those numbers.
 * @param s
 * @returns
 */
export const nums = (s: string, splitWith = ' ') =>
  s.split(splitWith).map(Number)

export async function getInput(day: number, year = 2023) {
  const filePath = `${import.meta.dir}/../../data/${year}-${day}.txt`
  const file = Bun.file(filePath)
  const exists = await file.exists()
  if (!exists) {
    console.log('File not found, fetching')
    const Cookie = Bun.env.COOKIE
    if (!Cookie) throw new Error('process.env.COOKIE must be set')
    const headers = new Headers({ Cookie })
    const res = await fetch(
      `https://adventofcode.com/${year}/day/${day}/input`,
      { headers },
    )
    const text = await res.text()
    await Bun.write(file, text.trim())
  }
  return Bun.file(filePath).text()
}
