import { describe, expect, test } from 'bun:test'
import { Coord, coordToStr, getInput, key, parse, print } from '../utils'

const DAY = 23

const exampleInput1 = String.raw`
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`.trim()

const P = (i: string) => parse.chars(i)

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
]
const TICY = ['^', '<', 'v', '>']

const isRock = (c: Coord, m: string[][]) => m[c.y][c.x] === '#'
const coordsEqual = (a: Coord, b: Coord) => a.x === b.x && a.y === b.y
const coordKey = (c: Coord) => key({ x: c.x, y: c.y })
const edgeKey = (e: Edge) => `${coordKey(e.start)}:${coordKey(e.end)}`
const isOnMap = (c: Coord, m: string[][]) =>
  m[c.y] != null && m[c.y][c.x] != null

function getNeighbors(c: Coord): Coord[] {
  return DIRS.map(([dy, dx]) => ({ x: c.x + dx, y: c.y + dy }))
}

function isValidNeighborFilter(
  map: string[][],
  seen?: Set<string>,
  ice = false
) {
  return function filterFn(n: Coord, i: number) {
    if (!isOnMap(n, map)) return false
    const k = coordKey(n)
    const t = map[n.y][n.x]
    const tooIcy = ice && t === TICY[i]
    if (t === '#' || tooIcy || seen?.has(k)) return false
    return true
  }
}

function findLongest(
  map: string[][],
  curr: Coord,
  seen: Set<string>,
  totalSteps: number,
  ice: boolean
): number {
  if (map.length - 1 === curr.y) return totalSteps

  const neighbors = getNeighbors(curr).filter(
    isValidNeighborFilter(map, seen, ice)
  )
  let max = 0
  for (const n of neighbors) {
    const k = coordKey(n)
    seen.add(k)
    const newMax = findLongest(map, n, seen, totalSteps + 1, ice)
    seen.delete(k)
    max = Math.max(max, newMax)
  }

  return max
}

function hike(map: string[][], ice = true): number {
  const s = { x: map[0].findIndex(c => c === '.'), y: 0 }
  return findLongest(map, s, new Set<string>(coordKey(s)), 0, ice)
}

type Edge = {
  start: Node
  end: Node
  steps: number
}

type Node = Coord & {
  edges: Map<string, Edge>
}

function findNodes(map: string[][]) {
  const s: Node = {
    x: map[0].findIndex(c => c === '.'),
    y: 0,
    edges: new Map()
  }
  const e: Node = {
    x: map[map.length - 1].findIndex(c => c === '.'),
    y: map.length - 1,
    edges: new Map()
  }
  const nodes: Node[] = [s]
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') continue
      const neighbors = getNeighbors({ x, y }).filter(
        isValidNeighborFilter(map)
      )
      if (neighbors.length > 2) {
        nodes.push({ x, y, edges: new Map() })
      }
    }
  }
  nodes.push(e)
  return nodes
}

function findPairNodes(c: Coord, p: Coord, map: string[][], steps: number) {
  if (c.y === 0 || c.y === map.length - 1) return { c, steps }
  const neighbors = getNeighbors(c).filter(
    isValidNeighborFilter(map, new Set([coordKey(p)]))
  )
  if (neighbors.length === 0) throw 'Reached end unexpectedly.'
  if (neighbors.length > 1) return { c, steps }
  return findPairNodes(neighbors[0], c, map, steps + 1)
}

function sortCoords(a: Coord, b: Coord) {
  const yDiff = a.y - b.y
  return yDiff === 0 ? a.x - b.x : yDiff
}

function findEdges(map: string[][], nodes: Node[]) {
  const edges = new Map<string, Edge>()
  for (const node of nodes) {
    const pairNodes = getNeighbors(node)
      .filter(isValidNeighborFilter(map))
      .map(n => findPairNodes(n, node, map, 1))
    for (const { c, steps } of pairNodes) {
      const pairNode = nodes.find(n => coordsEqual(c, n))
      if (pairNode == null) throw 'No pair node found!'
      const [start, end] = [node, pairNode].toSorted(sortCoords) as [Node, Node]
      const e: Edge = {
        start,
        end,
        steps
      }
      const k = edgeKey(e)
      if (edges.has(k)) continue
      node.edges.set(k, e)
      pairNode.edges.set(k, e)
      edges.set(k, e)
    }
  }
  return edges
}

function hikeToNode(
  curr: Node,
  goal: Node,
  seen: Set<string>,
  steps: number
): number {
  const k = coordKey(curr)
  if (seen.has(coordKey(curr))) return 0
  if (curr === goal) return steps

  seen.add(k)
  let maxSteps = 0
  for (const { start, end, steps } of curr.edges.values()) {
    maxSteps = Math.max(
      maxSteps,
      hikeToNode(start === curr ? end : start, goal, seen, steps)
    )
  }
  seen.delete(k)

  return steps + maxSteps
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(hike(P(exampleInput1))).toBe(94)
    })

    test('pt 2 should be', () => {
      expect(hike(P(exampleInput1), false)).toBe(154)
    })

    test('pt 2 edges', () => {
      const map = P(exampleInput1)
      const nodes = findNodes(map)
      print(`found nodes: ${nodes.length}`)
      const edges = findEdges(map, nodes)
      print(`edges: ${edges.size}`)
      expect(hikeToNode(nodes[0], nodes.at(-1)!, new Set(), 0)).toBe(154)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    print('result:', hike(P(inputFile)))

    const map = P(inputFile)
    const nodes = findNodes(map)
    print(`found nodes: ${nodes.length}`)
    const edges = findEdges(map, nodes)
    print(`found edges: ${edges.size}`)
    ;[...edges.values()].map(e =>
      print('E', coordToStr(e.start), e.steps, coordToStr(e.end))
    )
    print('result 2:', hikeToNode(nodes[0], nodes.at(-1)!, new Set(), 0))
    expect(Bun).toBeDefined()
  })
})
