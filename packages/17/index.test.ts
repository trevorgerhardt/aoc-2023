import { describe, expect, test } from 'bun:test'
import { Coord, Dir, coordToStr, getInput, print } from '../utils'

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

type Block = Coord & { d: Dir }

const parse = (input: string) =>
  input
    .split('\n')
    .map(r => r.split('').map(v => +v))

const canTurn = (path: Block[]) =>
  path.length >= 4 && path.slice(0, 4).every(b => b.d === path[0].d)

const mustTurn = (path: Block[]) =>
  path.length >= 10 && path.slice(0, 10).every(b => b.d === path[0].d)

const reverseDir: Record<Dir, Dir> = {
  n: 's',
  s: 'n',
  e: 'w',
  w: 'e'
}

function findNeighbors (path: Block[]): Block[] {
  const {x, y, d} = path[0]
  const neighbors: Block[] = ([
    {x, y: y + 1, d: 's'},
    {x: x + 1, y, d: 'e'},
    {x, y: y - 1, d: 'n'},
    {x: x - 1, y, d: 'w'}
  ] as Block[]).filter(v => v.d !== reverseDir[d])

  if (!canTurn(path)) return neighbors.filter(v => v.d === d)
  if (mustTurn(path)) return neighbors.filter(v => v.d !== d)
  return neighbors
}

const Loss = {
  MAX: Infinity
}

function search (
  path: Block[], 
  blocks: number[][],
  heatLoss: number,
  cache: Map<string, number>
): false | number {
  const curr = path[0]
  const {x, y} = curr // check bounds of current location
  if (x < 0 || y < 0 || x >= blocks[0].length || y >= blocks.length) return false
  if (path.length > 10 && path.slice(0, 10).every(b => b.d === path[0].d)) {
    return false
  }
  
  const totalHeatLoss = blocks[y][x] + heatLoss
  if (totalHeatLoss > Loss.MAX) return false // Bad path

  // Reached the end!
  if (y === (blocks.length - 1) && x === (blocks[0].length - 1)) {
    if (!path.slice(0, 4).every(b => b.d === curr.d)) return false // CANNOT STOP

    print(path.length, 'L:', totalHeatLoss, 'C:', cache.size, '\n', path.toReversed().map(p => coordToStr(p) + p.d).join(' '), '\n')

    if (totalHeatLoss < Loss.MAX) {
      print('\nNEW MINIMUM ------------\n', totalHeatLoss, '\n---------------------\n')
      Loss.MAX = totalHeatLoss
    }

    return totalHeatLoss
  }

  // Check the cache, find the index of the first path that doesn't match the current one.
  const turnIndex = path.findIndex(b => b.d !== curr.d)
  const cacheStr = canTurn(path) 
    ? coordToStr(curr) + curr.d
    : path.slice(0, turnIndex > 1 ? turnIndex : undefined).map(c => coordToStr(c) + c.d).join(' ')
  const minLossAtPath = cache.get(cacheStr)

  // We already found a more optimal path to this location, abandon this route.
  if (minLossAtPath && totalHeatLoss >= minLossAtPath) return false

  // Min loss to location with path calculated, cache it.
  cache.set(cacheStr, totalHeatLoss) 

  let minLoss = Infinity
  for (const neighbor of findNeighbors(path)) { 
    path.unshift(neighbor)
    const foundPath = search(path, blocks, totalHeatLoss, cache)
    if (foundPath !== false) {
      minLoss = Math.min(foundPath, minLoss)
    }
    path.shift()
  }
  
  return minLoss < Infinity ? minLoss : false
}

function calcLazyMax (blocks: ReturnType<typeof parse>) {
  let maxLoss = 0
  let x = 0, y = 0
  while (x !== blocks[0].length - 1 && y !== blocks.length - 1) {
    x++
    maxLoss += blocks[y][x]
    y++
    maxLoss += blocks[y][x]
  }
  return maxLoss
}

function maxEnergy(
  blocks: ReturnType<typeof parse>, 
  maxLoss?: number
): number {
  Loss.MAX = maxLoss ?? calcLazyMax(blocks)
  console.log('lazy max', maxLoss)
  const cache = new Map<string, number>()
  const startS = search([{x: 0, y: 1, d: 's'}], blocks, 0, cache)
  const startE = search([{x: 1, y: 0, d: 'e'}], blocks, 0, cache)
  return Math.min(startE || Infinity, startS || Infinity)
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test.skip('pt 1 should be', () => {
      expect(maxEnergy([
        [1, 2],
        [3, 4]
      ])).toBe(6)
      expect(maxEnergy(parse(exampleInput1), 102)).toBe(102)
    })

    test('pt 2 should be', () => {
      expect(maxEnergy(parse(exampleInput2), 100)).toBe(71)
      expect(maxEnergy(parse(exampleInput1), 102)).toBe(94)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    expect(parsedInput.length).toBe(parsedInput[0].length)
    // console.log('result:', maxEnergy(parsedInput, 859))
    console.log('result 2:', maxEnergy(parsedInput, 1256))
    expect(Bun).toBeDefined()
  })
})
