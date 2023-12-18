import { describe, expect, test } from 'bun:test'
import { getInput, print } from '../utils'

const DAY = 18

const exampleInput1 = String.raw`
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`.trim()

type Dir = 'U' | 'D' | 'L' | 'R'

function codeToDir (s: string): Dir {
  switch (s) {
    case '0': return 'R'
    case '1': return 'D'
    case '2': return 'L'
    case '3': return 'U'
  }
  return 'U'
}

const parse = (input: string) =>
  input
    .split('\n')
    .map(r => {
      const [d, m, c] = r.split(' ')
      const hexMeters = parseInt(c.slice(2, -2), 16)
      const dirCode = c.slice(-2, -1)
      return {
        d: codeToDir(dirCode),
        m: hexMeters,
        c: c.slice(1, -1) // remove parens
      }
    })

function calcPolygonArea (p: [number, number][]): number {
  let area = 0

  for (let i = 0; i < p.length; i++) {
    const j = (i + 1) % p.length
    area += p[i][0] * p[j][1]
    area -= p[i][1] * p[j][0]
  }

  return Math.abs(area / 2);
}

function calc(input: ReturnType<typeof parse>) {
  const trench: [number, number][] = [[0, 0]]
  let x = 0, y = 0
  let maxX = 0, maxY = 0, minX = 0, minY = 0
  for (const step of input) {
    for (let i = 0; i < step.m; i++) {
      if (step.d === 'U') y--
      if (step.d === 'D') y++
      if (step.d === 'L') x--
      if (step.d === 'R') x++
      trench.push([x, y])
      if (maxX < x) maxX = x
      if (maxY < y) maxY = y
      if (minX > x) minX = x
      if (minY > y) minY = y
    }
  }

  print('trench dug. Now calculating interior...')
  print('trench length', trench.length, 'x size', maxX - minX, 'y size', maxY - minY)

  return calcPolygonArea(trench) + ((trench.length - 1) / 2) + 1 
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test.skip('pt 1 should be', () => {
      expect(calc(parse(exampleInput1))).toBe(62)
    })

    test('pt 2 should be', () => {
      expect(calc(parse(exampleInput1))).toBe(952408144115)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    // console.log('result:', calc(parsedInput))
    console.log('result 2:', calc(parsedInput))
    expect(Bun).toBeDefined()
  })
})
