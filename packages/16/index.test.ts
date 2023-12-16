import { describe, expect, test } from 'bun:test'
import { getInput, sumWith } from '../utils'

const DAY = 16

const exampleInput1 = String.raw`
.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....
`.trim()

type Dir = 'n' | 's' | 'w' | 'e'
type Tile = '.' | '|' | '-' | '\\' | '/'
type Beam = { x: number; y: number; d: Dir }

const parse = (input: string) =>
  input
    .replace(/\n/g, 'N')
    .split('N')
    .map((r) => r.split('') as Tile[])

function nextDirections(d: Dir, t: Tile): Dir[] {
  switch (t) {
    case '\\': {
      if (d === 'n') return ['w']
      if (d === 's') return ['e']
      if (d === 'e') return ['s']
      if (d === 'w') return ['n']
    }
    case '/': {
      if (d === 'n') return ['e']
      if (d === 's') return ['w']
      if (d === 'e') return ['n']
      if (d === 'w') return ['s']
    }
    case '|':
      if (d === 'w' || d === 'e') return ['n', 's']
      break
    case '-':
      if (d === 'n' || d === 's') return ['e', 'w']
      break
  }
  return [d]
}

function energized(
  tiles: ReturnType<typeof parse>,
  startBeam: Beam = { x: -1, y: 0, d: 'e' },
) {
  const beams: Beam[] = [startBeam]
  const energizedTiles: Dir[][][] = tiles.map((r) => r.map((_) => []))
  const height = tiles.length
  const width = tiles[0].length
  while (beams.length > 0) {
    beams.forEach((beam, beamIndex) => {
      // Move beam to next tile
      const y = beam.y + (beam.d === 'n' ? -1 : beam.d === 's' ? 1 : 0)
      const x = beam.x + (beam.d === 'e' ? 1 : beam.d === 'w' ? -1 : 0)
      const isOffMap = x < 0 || x >= width || y < 0 || y >= height

      // Remove beam if off the map or the new tile has already energized from this direction.
      if (isOffMap || energizedTiles[y][x].includes(beam.d)) {
        beams.splice(beamIndex, 1)
        return
      }

      // Increment energized tiles
      energizedTiles[y][x].push(beam.d)

      // Calculate new directions
      const [d1, d2] = nextDirections(beam.d, tiles[y][x])
      beam.x = x
      beam.y = y
      beam.d = d1

      // Add new beam if split occured
      if (d2) beams.push({ x: x, y: y, d: d2 })
    })
  }
  return sumWith(energizedTiles, (r) =>
    sumWith(r, (v) => (v.length > 0 ? 1 : 0)),
  )
}

function maxEnergy(tiles: ReturnType<typeof parse>) {
  let max = -Infinity
  for (let i = 0; i < Math.max(tiles.length, tiles[0].length); i++) {
    max = Math.max(
      max,
      energized(tiles, { d: 'e', x: -1, y: i }),
      energized(tiles, { d: 'w', x: tiles[0].length, y: i }),
      energized(tiles, { d: 's', x: i, y: -1 }),
      energized(tiles, { d: 'n', x: i, y: tiles.length }),
    )
  }
  return max
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(energized(parse(exampleInput1))).toBe(46)
    })

    test('pt 2 should be', () => {
      expect(maxEnergy(parse(exampleInput1))).toBe(51)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    console.log('result:', energized(parsedInput))
    console.log('result 2:', maxEnergy(parsedInput))
    expect(Bun).toBeDefined()
  })
})
