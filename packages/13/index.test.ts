import { describe, expect, test } from 'bun:test'
import { getInput, sumWith, transpose } from '../utils'

const DAY = 13

const exampleInput1 = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`.trim()

function parse(input: string) {
  return input.split('\n\n')
}

function countDiffChars(s1: string, s2: string) {
  let diff = 0
  for (let i = 0; i < s1.length; i++) if (s1.at(i) !== s2.at(i)) diff++
  return diff
}

function rowIsReflected(rows: string[], rowIndex: number) {
  let diff = 0
  for (
    let r1 = rowIndex, r2 = rowIndex + 1;
    r1 >= 0 && r2 < rows.length;
    r1--, r2++
  ) {
    diff += countDiffChars(rows[r1], rows[r2])
    if (diff > 1) return false
  }
  return diff === 1
}

function calc(patternString: string) {
  const patternRows = patternString.split('\n')

  // Vertical reflection
  for (let r = 0; r < patternRows.length - 1; r++) {
    if (rowIsReflected(patternRows, r)) {
      return 100 * (r + 1)
    }
  }

  // Horizontal reflection
  const transposedPatternRows = transpose(
    patternRows.map(r => r.split('')),
  ).map(r => r.join(''))
  for (let r = 0; r < transposedPatternRows.length - 1; r++) {
    if (rowIsReflected(transposedPatternRows, r)) {
      return r + 1
    }
  }

  return 0
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test.skip('pt 1 should be', () => {
      expect(sumWith(parse(exampleInput1), calc)).toBe(405)
    })

    test('pt 2 should be', () => {
      expect(sumWith(parse(exampleInput1), calc)).toBe(400)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    // console.log('result:', calcResults(parsedInput))
    console.log('result 2:', sumWith(parsedInput, calc))
    expect(Bun).toBeDefined()
  })
})
