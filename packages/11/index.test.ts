import { describe, expect, test } from 'bun:test'
import { Coord, getInput } from '../utils'

const exampleInput1 = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`.trim()

function parseInput(input: string) {
  const galaxies: Coord[] = []
  const gRows: boolean[] = []
  const gCols: boolean[] = []
  input.split('\n').forEach((l, y) => {
    gRows[y] = false
    l.split('').forEach((d, x) => {
      if (gCols[x] === undefined) gCols[x] = false
      if (d !== '.') {
        gCols[x] = true
        gRows[y] = true
        galaxies.push({ x, y })
      }
    })
  })
  return { galaxies, gRows, gCols }
}

function expandUniverse(
  galaxies: Coord[],
  gRows: boolean[],
  gCols: boolean[],
  expandBy: number,
) {
  return galaxies.map((g) => {
    const emptyRows = gRows.slice(0, g.y).filter((g) => g !== true).length
    const emptyCols = gCols.slice(0, g.x).filter((g) => g !== true).length
    return {
      x: g.x + emptyCols * (expandBy - 1),
      y: g.y + emptyRows * (expandBy - 1),
    }
  })
}

const calcDistance = (a: Coord, b: Coord) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

function calcGalaxyDistances(gs: Coord[]) {
  return gs.reduce(
    (total, g1, i) =>
      total +
      gs
        .slice(i + 1)
        .reduce((pairTotal, g2) => pairTotal + calcDistance(g1, g2), 0),
    0,
  )
}

function calcResults(
  results: ReturnType<typeof parseInput>,
  expandBy: number,
): number {
  return calcGalaxyDistances(
    expandUniverse(results.galaxies, results.gRows, results.gCols, expandBy),
  )
}

describe('2023-11', () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calcResults(parseInput(exampleInput1), 2)).toBe(374)
    })

    test('pt 2 should be', () => {
      expect(calcResults(parseInput(exampleInput1), 10)).toBe(1030)
      expect(calcResults(parseInput(exampleInput1), 100)).toBe(8410)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(11)
    const parsedInput = parseInput(inputFile)
    console.log('result:', calcResults(parsedInput, 2))
    console.log('result 2:', calcResults(parsedInput, 1_000_000))
    expect(Bun).toBeDefined()
  })
})
