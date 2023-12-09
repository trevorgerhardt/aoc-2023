import { describe, expect, test } from 'bun:test'
import { getInput, nums } from '../utils'

const exampleInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim()

function parseInput(input: string) {
  return input.split('\n').map((l) => nums(l))
}

function diff(seq: number[]) {
  const diffSeq: number[] = []
  for (let i = 0; i < seq.length - 1; i++) {
    diffSeq[i] = seq[i + 1] - seq[i]
  }
  return diffSeq
}

function predictNextValue(seq: number[]): number {
  if (seq.every((v) => v === 0)) return 0
  return seq[seq.length - 1] + predictNextValue(diff(seq))
}

function predictPrevValue(seq: number[]): number {
  if (seq.every((v) => v === 0)) return 0
  return seq[0] - predictPrevValue(diff(seq))
}

function calcResults1(results: ReturnType<typeof parseInput>): number {
  return results.reduce((result, line) => result + predictNextValue(line), 0)
}

function calcResults2(results: ReturnType<typeof parseInput>): number {
  return results.reduce((result, line) => result + predictPrevValue(line), 0)
}

describe('2023-09', () => {
  describe('test', async () => {
    const parsedInput = parseInput(exampleInput)

    test('pt 1 should be', () => {
      expect(calcResults1(parsedInput)).toBe(114)
    })

    test('pt 2 should be', () => {
      expect(calcResults2(parsedInput)).toBe(2)
    })

    test('check input', () => {
      expect(
        predictNextValue(
          nums(
            `-6 -7 -8 -9 -10 -11 -12 -13 -14 -15 -16 -17 -18 -19 -20 -21 -22 -23 -24 -25 -26`,
          ),
        ),
      ).toBe(-27)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(9)
    const parsedInput = parseInput(inputFile)
    console.log('result:', calcResults1(parsedInput))
    console.log('result 2:', calcResults2(parsedInput))
    expect(Bun).toBeDefined()
  })
})
