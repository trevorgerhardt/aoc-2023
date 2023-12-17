import { describe, expect, test } from 'bun:test'
import inside from 'point-in-polygon-hao'
import { getInput } from '../utils'

type Coord = { x: number; y: number }
type Pipe = Coord & {
  type: string
  inLoop?: boolean
}

const exampleInput1 = `
.....
.S-7.
.|.|.
.L-J.
.....
`.trim()

const exampleInput2 = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trim()

const pt2Example1 = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`.trim()

const pt2Example2 = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`.trim()

const pt2Example3 = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`.trim()

function parseInput(input: string) {
  const start: Coord = { x: -1, y: -1 }
  const pipes = input.split('\n').map((l, y) =>
    l.split('').map((p, x) => {
      if (p === 'S') {
        start.x = x
        start.y = y
      }
      return { x, y, type: p }
    }),
  )
  return { pipes, start: pipes[start.y][start.x] }
}

const ce = (t: string) => t === '-' || t === 'L' || t === 'F' || t === 'S'
const cw = (t: string) => t === '-' || t === 'J' || t === '7' || t === 'S'
const cn = (t: string) => t === '|' || t === 'L' || t === 'J' || t === 'S'
const cs = (t: string) => t === '|' || t === '7' || t === 'F' || t === 'S'

function findNeighbors(pipe: Pipe, pipes: Pipe[][]): Pipe[] {
  const { x, y, type } = pipe
  const neighbors: Pipe[] = []
  if (x > 0 && cw(type)) {
    // Check west
    const westPipe = pipes[y][x - 1]
    if (ce(westPipe.type)) neighbors.push(westPipe)
  }
  if (x < pipes[y].length && ce(type)) {
    // Check east
    const eastPipe = pipes[y][x + 1]
    if (cw(eastPipe.type)) neighbors.push(eastPipe)
  }
  if (y > 0 && cn(type)) {
    // Check north
    const northPipe = pipes[y - 1][x]
    if (cs(northPipe.type)) neighbors.push(northPipe)
  }
  if (y < pipes.length && cs(type)) {
    const southPipe = pipes[y + 1][x]
    if (cn(southPipe.type)) neighbors.push(southPipe)
  }

  return neighbors
}

const minLoopLength = 4
function dfs(goal: Pipe, grid: Pipe[][], path: Pipe[]): false | Pipe[] {
  const curr = path.at(-1)!
  if (curr === goal && path.length >= minLoopLength) {
    return path // Loop found
  }

  for (const n of findNeighbors(curr, grid)) {
    if (n === path[path.length - 2]) continue // skip if previous node
    // Try this neighbor
    path.push(n)
    const foundPath = dfs(goal, grid, path)
    if (foundPath) return foundPath
    path.pop()
  }

  return false
}

function findLoop(start: Pipe, grid: Pipe[][]) {
  const path = dfs(start, grid, [start])
  return path ? path : []
}

function getEnclosedCells(loop: Pipe[], grid: Pipe[][]): Pipe[] {
  const coords: [number, number][] = []
  for (const l of loop) {
    coords.push([l.x, l.y])
    l.inLoop = true
  }
  const polygon = [coords]
  return grid.flat().filter(p => !p.inLoop && inside([p.x, p.y], polygon))
}

function calcResults1(results: ReturnType<typeof parseInput>): number {
  const { pipes, start } = results
  const loop = findLoop(start, pipes)
  return (loop.length - 1) / 2
}

function calcResults2(results: ReturnType<typeof parseInput>): number {
  const { pipes, start } = results
  const loop = findLoop(start, pipes)
  return getEnclosedCells(loop, pipes).length
}

describe('2023-10', () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calcResults1(parseInput(exampleInput1))).toBe(4)
      expect(calcResults1(parseInput(exampleInput2))).toBe(8)
    })

    test('pt 2 should be', () => {
      expect(calcResults2(parseInput(pt2Example1))).toBe(4)
      expect(calcResults2(parseInput(pt2Example2))).toBe(8)
      expect(calcResults2(parseInput(pt2Example3))).toBe(10)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(10)
    const parsedInput = parseInput(inputFile)
    console.log('result:', calcResults1(parsedInput))
    console.log('result 2:', calcResults2(parsedInput))
    expect(Bun).toBeDefined()
  })
})
