import { describe, expect, test } from 'bun:test'
import { getInput, print, sumWith } from '../utils'

const DAY = 19

const exampleInput1 = String.raw`
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`.trim()

type Range = [number, number]
type Label = 'x' | 'm' | 'a' | 's'
type RangeSet = Record<Label, Range>
type Part = { x: number; m: number; a: number; s: number }
type Dest = string | 'R' | 'A'
type Wf =
  | {
      c?: '='
      d: Dest
      match: (p: Part) => boolean
    }
  | {
      l: Label
      c: '>' | '<'
      v: number
      d: Dest
      match: (p: Part) => boolean
    }

const parse = (input: string) => {
  const [rulesStr, partsStr] = input.split('\n\n')
  const wfs: Record<string, Wf[]> = {}
  rulesStr.split('\n').map(row => {
    const [name, wf] = row.split('{')
    wfs[name] = wf
      .slice(0, -1)
      .split(',')
      .map<Wf>(r => {
        if (r.includes(':')) {
          const str = r.split(':')
          const [l, v] = str[0].split(/[<>]/)
          const match = (p: Part) =>
            str[0].includes('>') ? p[l as Label] > +v : p[l as Label] < +v
          return {
            l: l as Label,
            c: str[0].includes('>') ? '>' : '<',
            d: str[1],
            v: +v,
            match,
          } as Wf
        }
        return {
          d: r,
          match: (_: Part) => true,
        }
      })
  })
  const parts = partsStr.split('\n').map(row =>
    row
      .slice(1, -1)
      .split(',')
      .reduce((values, c) => {
        const [l, v] = c.split('=')
        values[l as Label] = +v
        return values
      }, {} as Part),
  )
  return { wfs, parts }
}

function partIsAccepted(p: Part, wfs: Record<string, Wf[]>) {
  let d: Dest = 'in'
  while (d !== 'R' && d !== 'A') {
    const rules = wfs[d]
    for (const rule of rules) {
      if (rule.match(p)) {
        d = rule.d
        break
      }
    }
  }
  return d === 'A'
}

function calcRatings(input: ReturnType<typeof parse>) {
  return sumWith(
    input.parts.filter(p => partIsAccepted(p, input.wfs)),
    p => p.a + p.m + p.x + p.s,
  )
}

const combinations = (r: Range) => r[1] - r[0] + 1
const combinationsForSet = (rs: RangeSet) =>
  Object.values(rs).reduce((t, r) => t * combinations(r), 1)

const startRangeSet: RangeSet = {
  x: [1, 4000],
  m: [1, 4000],
  a: [1, 4000],
  s: [1, 4000],
}

function uniqueCombinations({ wfs }: ReturnType<typeof parse>) {
  const rangeSets: RangeSet[] = []
  function processWorkflow(
    wfName: string,
    ri: number,
    rangeSet: Record<Label, [number, number]>,
  ) {
    if (wfName === 'R') return
    if (wfName === 'A') {
      rangeSets.push(rangeSet)
      return
    }

    const rule = wfs[wfName][ri]
    switch (rule.c) {
      case '>': {
        const range = rangeSet[rule.l]
        const r1: RangeSet = {
          ...rangeSet,
          [rule.l]: [rule.v + 1, range[1]],
        }
        const r2: RangeSet = {
          ...rangeSet,
          [rule.l]: [range[0], rule.v],
        }
        processWorkflow(rule.d, 0, r1)
        processWorkflow(wfName, ri + 1, r2)
        break
      }
      case '<': {
        const range = rangeSet[rule.l]
        const r1: RangeSet = {
          ...rangeSet,
          [rule.l]: [range[0], rule.v - 1],
        }
        const r2: RangeSet = {
          ...rangeSet,
          [rule.l]: [rule.v, range[1]],
        }
        processWorkflow(rule.d, 0, r1)
        processWorkflow(wfName, ri + 1, r2)
        break
      }
      default:
        return processWorkflow(rule.d, 0, rangeSet)
    }
  }
  processWorkflow('in', 0, startRangeSet)
  return sumWith(rangeSets, combinationsForSet)
}

// HOHOHO!
function lazyUniq({ wfs }: ReturnType<typeof parse>) {
  let combinations = 0
  for (let x = 1; x <= 4000; x++) {
    print(`x ${x}`)
    for (let m = 1; m <= 4000; m++) {
      print(`m ${m}`)
      for (let a = 1; a <= 4000; a++) {
        for (let s = 1; s <= 4000; s++) {
          if (partIsAccepted({ x, m, a, s }, wfs)) combinations++
        }
      }
    }
  }
  return combinations
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calcRatings(parse(exampleInput1))).toBe(19114)
    })

    test('pt 2 should be', () => {
      expect(uniqueCombinations(parse(exampleInput1))).toBe(167409079868000)
    })

    test.skip('lazy pt 2 should be', () => {
      expect(lazyUniq(parse(exampleInput1))).toBe(167409079868000)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    console.log('result:', calcRatings(parsedInput))
    console.log('result 2:', uniqueCombinations(parsedInput))
    expect(Bun).toBeDefined()
  })
})
