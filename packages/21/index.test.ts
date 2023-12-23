import { describe, expect, test } from 'bun:test'
import { Coord, getInput, key, mod, parse } from '../utils'

const DAY = 21

const exampleInput1 = String.raw`
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`.trim()

const stepDirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

type Step = Coord & {
  stepsLeft: number
}
type Garden = string[][]

function nextSteps(
  garden: Garden,
  plots: Record<string, number>,
  step: Step,
): Step[] {
  const k = key(step.x, step.y)
  const my = mod(step.y, garden.length)
  const mx = mod(step.x, garden[0].length)

  if (garden[my][mx] === '#' || plots[k] >= step.stepsLeft) return []
  plots[k] = step.stepsLeft

  if (step.stepsLeft <= 0) return []
  return stepDirs.map(([dx, dy]) => ({
    x: step.x + dx,
    y: step.y + dy,
    stepsLeft: step.stepsLeft - 1,
  }))
}

function findReachablePlots(garden: Garden, maxSteps: number): number {
  const sy = garden.findIndex(line => line.includes('S'))
  const sx = garden[sy].indexOf('S')
  const plots = {
    [key(sx, sy)]: -1,
  }

  const steps: Step[] = [{ x: sx, y: sy, stepsLeft: maxSteps }]
  while (steps.length > 0) {
    const step = steps.shift()!
    steps.push(...nextSteps(garden, plots, step))
  }

  return Object.values(plots).filter(v => v % 2 === 0).length
}

function lagrangeFormula(i: [number, number, number]) {
  return [
    i[0] / 2 - i[1] + i[2] / 2,
    -3 * (i[0] / 2) + 2 * i[1] - i[2] / 2,
    i[0],
  ]
}

function plots2(garden: Garden, maxSteps: number, p = 72): number {
  if (maxSteps <= 1000) return findReachablePlots(garden, maxSteps)
  const WIDTH = garden.length
  const LF = lagrangeFormula([
    findReachablePlots(garden, p),
    findReachablePlots(garden, p + WIDTH),
    findReachablePlots(garden, p + WIDTH * 2),
  ])
  const T = (maxSteps - p) / WIDTH
  return LF[0] * T * T + LF[1] * T + LF[2]
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(findReachablePlots(parse.chars(exampleInput1), 6)).toBe(16)
    })

    test('pt 2 should be', () => {
      expect(plots2(parse.chars(exampleInput1), 10)).toBe(50)
      expect(plots2(parse.chars(exampleInput1), 50)).toBe(1594)
      expect(plots2(parse.chars(exampleInput1), 100)).toBe(6_536)
      expect(plots2(parse.chars(exampleInput1), 500)).toBe(167_004)
      expect(plots2(parse.chars(exampleInput1), 1000)).toBe(668_697)
    })

    test('pt 2 large', () => {
      expect(plots2(parse.chars(exampleInput1), 5000)).toBe(16_733_044)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    console.log('result:', findReachablePlots(parse.chars(inputFile), 64))
    console.log('result 2:', plots2(parse.chars(inputFile), 26_501_365))
    expect(Bun).toBeDefined()
  })
})
