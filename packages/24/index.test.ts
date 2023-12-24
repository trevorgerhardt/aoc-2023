import { describe, expect, test } from 'bun:test'
import {
  Coord,
  CoordZ,
  coordToStr,
  getInput,
  key,
  parse,
  print
} from '../utils'

const DAY = 24

const exampleInput1 = String.raw`
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`.trim()

type Hail = {
  p: CoordZ
  v: CoordZ
}

const toCoordZ = (s: string) =>
  s
    .trim()
    .split(/ +/g)
    .map(i => parseInt(i))

const P = (i: string) =>
  parse.lines(i, row => {
    const [ps, vs] = row.split('@').map(toCoordZ)
    return {
      p: { x: ps[0], y: ps[1], z: ps[2] },
      v: { x: vs[0], y: vs[1], z: vs[2] }
    } as Hail
  })

function subtractZ(a: CoordZ, b: CoordZ): CoordZ {
  return {
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z
  }
}

function crossProductZ(a: CoordZ, b: CoordZ): CoordZ {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x
  }
}

function dotProductZ(a: CoordZ, b: CoordZ): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function findPathIntersection3D(
  a: Hail,
  b: Hail,
  tolerance = 0.001
): CoordZ | null {
  print(key(a), key(b))
  const rp = subtractZ(a.p, b.p)
  const crossDir = crossProductZ(a.v, b.v)
  const crossRDir1 = crossProductZ(rp, a.v)

  if (dotProductZ(crossDir, crossDir) < tolerance) {
    // Lines are parallel, check if they are collinear
    if (dotProductZ(crossRDir1, crossDir) < tolerance) {
      // Lines are collinear, calculate intersection point
      const t = dotProductZ(rp, a.v) / dotProductZ(a.v, a.v)
      return {
        x: a.p.x + t * a.v.x,
        y: a.p.y + t * a.v.y,
        z: a.p.z + t * a.v.z
      }
    }
    // Lines are parallel but not collinear, no intersection
    return null
  }
  const t = dotProductZ(crossRDir1, b.v) / dotProductZ(crossDir, crossDir)
  const intersectionPoint = {
    x: a.p.x + t * a.v.x,
    y: a.p.y + t * a.v.y,
    z: a.p.z + t * a.v.z
  }

  // Verify if the intersection point lies on both lines
  const distanceToLine2 = subtractZ(intersectionPoint, b.p)
  if (Math.abs(dotProductZ(distanceToLine2, crossDir)) < tolerance) {
    return intersectionPoint
  }

  // The closest points on each line do not intersect
  return null
}

function findPathIntersection(
  a: Hail,
  b: Hail,
  tolerance = 0.001
): Coord | null {
  // Calculate determinant
  const det = a.v.x * b.v.y - a.v.y * b.v.x

  // If determinant is close to 0, lines are parallel and don't intersect
  if (Math.abs(det) < tolerance) return null

  // Calculate the relative position
  const rp = {
    x: b.p.x - a.p.x,
    y: b.p.y - a.p.y
  }

  // Calculate the parameter t for the intersection point on the first line
  const t1 = (rp.x * b.v.y - rp.y * b.v.x) / det
  const t2 = (rp.x * a.v.y - rp.y * a.v.x) / det
  if (t1 < 1 || t2 < 1) return null

  // Return the intersection point
  return {
    x: a.p.x + t1 * a.v.x,
    y: a.p.y + t1 * a.v.y
  }
}

function isWithin(c: Coord, min: number, max: number) {
  return c.x >= min && c.x <= max && c.y >= min && c.y <= max
}

function pathIntersections(
  input: { p: CoordZ; v: CoordZ }[],
  min: number,
  max: number
) {
  let totalIntersections = 0
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const intersection = findPathIntersection(input[i], input[j])
      if (intersection && isWithin(intersection, min, max)) {
        print(i, j, intersection)
        totalIntersections++
      }
    }
  }
  return totalIntersections
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(pathIntersections(P(exampleInput1), 7, 27)).toBe(2)
    })

    test.skip('pt 2 should be', () => {
      expect(hike(P(exampleInput1), false)).toBe(154)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    print(
      'result:',
      pathIntersections(P(inputFile), 200_000_000_000_000, 400_000_000_000_000)
    )
    expect(Bun).toBeDefined()
  })
})
