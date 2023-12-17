import { describe, expect, test } from 'bun:test'
import { getInput, matrixToString, sumWith, transpose } from '../utils'

const DAY = 14

const exampleInput1 = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`.trim()

const exampleAfter1SpinCycle = `
.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....
`.trim()

function parse(input: string) {
  return input.split('\n').map(r => r.split(''))
}

function calcLoad(rockRows: string[][]) {
  return rockRows
    .toReversed()
    .reduce((l, r, i) => l + r.filter(r => r === 'O').length * (i + 1), 0)
}

function rollNorthF(rockRows: string[][]) {
  for (let x = 0; x < rockRows[0].length; x++) {
    let stopAt = 0
    for (let y = 0; y < rockRows.length; y++) {
      const r = rockRows[y][x]
      if (r === 'O') {
        rockRows[y][x] = '.'
        rockRows[stopAt][x] = 'O'
        stopAt += 1
      } else if (r === '#') {
        stopAt = y + 1
      }
    }
  }
  return rockRows
}

function rollSouthF(rockRows: string[][]) {
  for (let x = 0; x < rockRows[0].length; x++) {
    let stopAt = rockRows.length - 1
    for (let y = rockRows.length - 1; y >= 0; y--) {
      const r = rockRows[y][x]
      if (r === 'O') {
        rockRows[y][x] = '.'
        rockRows[stopAt][x] = 'O'
        stopAt -= 1
      } else if (r === '#') {
        stopAt = y - 1
      }
    }
  }
  return rockRows
}

function rollWestF(rockRows: string[][]) {
  for (let y = 0; y < rockRows.length; y++) {
    const row = rockRows[y]
    let stopAt = 0
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'O') {
        row[x] = '.'
        row[stopAt] = 'O'
        stopAt += 1
      } else if (row[x] === '#') {
        stopAt = x + 1
      }
    }
  }
  return rockRows
}

function rollEastF(rockRows: string[][]) {
  for (let y = 0; y < rockRows.length; y++) {
    const row = rockRows[y]
    let stopAt = row.length - 1
    for (let x = row.length - 1; x >= 0; x--) {
      if (row[x] === 'O') {
        row[x] = '.'
        row[stopAt] = 'O'
        stopAt -= 1
      } else if (row[x] === '#') {
        stopAt = x - 1
      }
    }
  }
  return rockRows
}

function spinCycle(rockRows: string[][]) {
  return rollEastF(rollSouthF(rollWestF(rollNorthF(rockRows))))
}

function spinCycles(rockRows: string[][], spins: number) {
  const formations: string[] = []
  const repeats: string[] = []
  for (let s = 0; s < spins; s++) {
    spinCycle(rockRows)
    const asStr = matrixToString(rockRows)
    if (formations.includes(asStr)) {
      // We made it back to a formation we've already seen
      if (repeats.includes(asStr)) {
        // We found a repeat in the cycle.
        const sizeDiff = formations.length - repeats.length
        return parse(repeats[((spins - sizeDiff) % repeats.length) - 1])
      }
      repeats.push(asStr)
    } else {
      formations.push(asStr)
    }
  }
  return rockRows
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calcLoad(rollNorthF(parse(exampleInput1)))).toBe(136)
    })

    test('pt 2 should be', () => {
      expect(spinCycle(parse(exampleInput1))).toEqual(
        parse(exampleAfter1SpinCycle),
      )
      expect(calcLoad(spinCycles(parse(exampleInput1), 1_000_000_000))).toBe(64)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    console.log('result:', calcLoad(rollNorthF(parsedInput)))
    console.log('result 2:', calcLoad(spinCycles(parsedInput, 1_000_000_000)))
    expect(Bun).toBeDefined()
  })
})
