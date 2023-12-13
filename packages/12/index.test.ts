import { describe, expect, test } from 'bun:test'
import { getInput, nums } from '../utils'

const exampleInput1 = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`.trim()

function parseInput(input: string) {
  return input.split('\n').map((l) => {
    const [status, counts] = l.split(' ')
    return {
      status,
      groups: nums(counts, ','),
    }
  })
}

// No need for individual caches. Works for example code and input code alike.
const arrangementCache = new Map<string, number>()

function countArrangements(statuses: string, groups: number[]) {
  // Reached the end. If group left then not an additional arrangement.
  if (statuses.length === 0) return groups.length === 0 ? 1 : 0

  // No groups left. If statuses still include '#' not an additional arrangement.
  if (groups.length === 0) return statuses.includes('#') ? 0 : 1

  // Has this pattern been seen before?
  const key = statuses + groups.join(':')
  if (arrangementCache.has(key)) return arrangementCache.get(key)!

  let arrangements = 0
  const isBroken = statuses[0] === '#'
  const isWorking = statuses[0] === '.'
  const isUnknown = statuses[0] === '?'

  // Work through the current group
  if (isBroken || isUnknown) {
    const groupSize = groups[0]
    const groupNotWorking = !statuses.slice(0, groupSize).includes('.')
    const charAfterNotBroken = statuses[groupSize] !== '#'
    const end = statuses.length === groupSize
    if (
      groupSize <= statuses.length &&
      groupNotWorking &&
      (end || charAfterNotBroken)
    ) {
      arrangements += countArrangements(
        statuses.slice(groupSize + 1),
        groups.slice(1),
      )
    }
  }

  // Work through next character for full group
  if (isWorking || isUnknown) {
    arrangements += countArrangements(statuses.slice(1), groups)
  }

  arrangementCache.set(key, arrangements)
  return arrangements
}

function calcResults(input: ReturnType<typeof parseInput>): number {
  return input.reduce(
    (total, row) => total + countArrangements(row.status, row.groups),
    0,
  )
}

function unfold<T>(v: T, s = 5) {
  return Array(s).fill(v)
}

function calcResults2(input: ReturnType<typeof parseInput>): number {
  return input.reduce(
    (total, row) =>
      total +
      countArrangements(
        unfold(row.status).join('?'),
        unfold(row.groups).flat(),
      ),
    0,
  )
}

describe('2023-12', () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calcResults([parseInput(exampleInput1)[0]])).toBe(1)
      expect(calcResults(parseInput(exampleInput1))).toBe(21)
    })

    test('pt 2 should be', () => {
      expect(calcResults2([parseInput(exampleInput1)[1]])).toBe(16_384)
      expect(calcResults2(parseInput(exampleInput1))).toBe(525_152)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(12)
    const parsedInput = parseInput(inputFile)
    console.log('result:', calcResults(parsedInput))
    console.log('result 2:', calcResults2(parsedInput))
    expect(Bun).toBeDefined()
  })
})
