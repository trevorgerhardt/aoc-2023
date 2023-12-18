import { describe, expect, test } from 'bun:test'
import { Coord, getInput, print } from '../utils'

const DAY = 17

const exampleInput1 = String.raw`
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`.trim()

const exampleInput2 = `
111111111111
999999999991
999999999991
999999999991
999999999991
`.trim()

const parse = (input: string) =>
  input
    .split('\n')
    .map(r => r.split('').map(v => +v))

type Step = Coord & {
  dx: number
  dy: number
  m: number
  heatLoss: number
}

const toKey = (c: Step) => [c.x, c.y, c.dx, c.dy, c.m].join(',')

const turns = (s: Step, minMoves: number) => s.m >= minMoves 
  ? s.dx === 0
    ? [{dx: -1, dy: 0}, {dx: 1, dy: 0}]
    : [{dx: 0, dy: -1}, {dx: 0, dy: 1}]
  : []

function search(
  blocks: ReturnType<typeof parse>,
  minMoves = 4,
  maxMoves = 10
): number {
  const maxX = blocks[0].length - 1
  const maxY = blocks.length - 1
  const inBounds = (x: number, y: number) =>
    x >= 0 && x <= maxX && y >= 0 && y <= maxY
  let stepsChecked = 0
  let minHeatLoss = 0
  let steps: Step[] = [{
    x: 0, y: 0, dx: 1, dy: 0, heatLoss: 0, m: 0
  }, {
    x: 0, y: 0, dx: 0, dy: 1, heatLoss: 0, m: 0
  }]

  const seenSteps = new Set<string>()

  while (steps.length > 0) {
    const newSteps: Step[] = []

    for (const c of steps) {
      stepsChecked++
      const key = toKey(c)
      if (seenSteps.has(key)) continue

      // Delay checking this step
      if (c.heatLoss > minHeatLoss) {
        newSteps.push(c)
        continue
      }

      if (c.m >= minMoves && c.x === maxX && c.y === maxY) {
        print('Found finish. Total steps checked:', stepsChecked, 'Unique steps:', seenSteps.size)
        return c.heatLoss
      }

      seenSteps.add(key)

      let nextX = c.x + c.dx
      let nextY = c.y + c.dy
      if (c.m < maxMoves && inBounds(nextX, nextY)) {
        newSteps.push({
          x: nextX,
          y: nextY,
          dx: c.dx,
          dy: c.dy,
          m: c.m + 1,
          heatLoss: c.heatLoss + blocks[nextY][nextX]
        })
      } 

      for (const t of turns(c, minMoves)) {
        nextX = c.x + t.dx
        nextY = c.y + t.dy
        if (inBounds(nextX, nextY)) {
          newSteps.push({
            x: nextX,
            y: nextY,
            dx: t.dx,
            dy: t.dy,
            m: 1,
            heatLoss: c.heatLoss + blocks[nextY][nextX]
          })
        }
      }
    }

    steps = newSteps
    minHeatLoss++
  }

  throw 'Failed to find finish'
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(search(parse(exampleInput1), 0, 3)).toBe(102)
    })

    test('pt 2 should be', () => {
      expect(search(parse(exampleInput2))).toBe(71)
      expect(search(parse(exampleInput1))).toBe(94)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    expect(parsedInput.length).toBe(parsedInput[0].length)
    console.log('result:', search(parsedInput, 0, 3))
    console.log('result 2:', search(parsedInput))
    expect(Bun).toBeDefined()
  })
})
