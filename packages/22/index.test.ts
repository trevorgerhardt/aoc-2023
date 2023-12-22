import { describe, expect, test } from 'bun:test'
import { CoordZ, getInput, isSubsetOf, key, parse, sumWith } from '../utils'

const DAY = 22

const exampleInput1 = String.raw`
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`.trim()

type Brick = {
  idx: number
  dim: [CoordZ, CoordZ]
  isSupportedBy: Set<Brick>
  supports: Set<Brick>
}

const P = (i: string) =>
  parse
    .lines(i, l => parse.split(l, n => parse.nums(n, ','), '~'))
    .map(
      ([a, b], idx) =>
        ({
          idx,
          dim: [
            { x: a[0], y: a[1], z: a[2] },
            { x: b[0], y: b[1], z: b[2] },
          ],
          isSupportedBy: new Set<Brick>(),
          supports: new Set<Brick>(),
        }) as Brick,
    )
    // Sort by z values. First z is always lower.
    .toSorted((a, b) => a.dim[0].z - b.dim[0].z)

function genBrickSupports(bricks: Brick[]) {
  const brickSpace = new Map<string, Brick>()
  // Let bricks fall, in order
  return bricks.map(brick => {
    const [start, end] = brick.dim
    if (end.x < start.x || end.y < start.y || end.z < start.z)
      throw 'Ordering assumption is wrong.'

    // Check if the space under the brick is unoccupied
    while (start.z > 1 && brick.isSupportedBy.size === 0) {
      for (let x = start.x; x <= end.x; x++) {
        for (let y = start.y; y <= end.y; y++) {
          const supportBrick = brickSpace.get(key([x, y, start.z - 1]))
          if (supportBrick) {
            brick.isSupportedBy.add(supportBrick)
            supportBrick.supports.add(brick)
          }
        }
      }
      if (brick.isSupportedBy.size === 0) {
        start.z--
        end.z--
      }
    }

    for (let x = start.x; x <= end.x; x++) {
      for (let y = start.y; y <= end.y; y++) {
        for (let z = start.z; z <= end.z; z++) {
          brickSpace.set(key([x, y, z]), brick)
        }
      }
    }

    return brick
  })
}

function canDisintegrate(bricks: Brick[]): number {
  return sumWith(genBrickSupports(bricks), b => {
    if (b.supports.size === 0) return 1
    for (const supportBrick of b.supports) {
      if (supportBrick && supportBrick.isSupportedBy.size <= 1) {
        return 0
      }
    }
    return 1
  })
}

function chainReaction(bricks: Brick[]): number {
  return sumWith(genBrickSupports(bricks), brick => {
    if (brick.supports.size === 0) return 0

    const demolishedBricks = new Set<Brick>([brick])

    let supportBricks = brick.supports
    while (supportBricks.size > 0) {
      const nextSupportBricks = new Set<Brick>()
      for (const supportedBrick of supportBricks) {
        if (!isSubsetOf(supportedBrick.isSupportedBy, demolishedBricks))
          continue
        demolishedBricks.add(supportedBrick)
        for (const subBrick of supportedBrick.supports)
          nextSupportBricks.add(subBrick)
      }
      supportBricks = nextSupportBricks
    }

    return demolishedBricks.size - 1
  })
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(canDisintegrate(P(exampleInput1))).toBe(5)
    })

    test('pt 2 should be', () => {
      expect(chainReaction(P(exampleInput1))).toBe(7)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    console.log('result:', canDisintegrate(P(inputFile)))
    console.log('result 2:', chainReaction(P(inputFile)))
    expect(Bun).toBeDefined()
  })
})
