import { describe, expect, test } from 'bun:test'
import { getInput, sumWith } from '../utils'

const DAY = 15

const exampleInput1 = `
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`.trim()

const parse = (input: string) => input.split(',')

const HASH = (s: string) =>
  s.split('').reduce((v, _, i) => ((v + s.charCodeAt(i)) * 17) % 256, 0)

function HASHMAP(input: string[]) {
  const boxes: { l: string; f: number }[][] = Array(256)
    .fill(null)
    .map(() => [])
  for (const step of input) {
    const [label, focalLength] = step.split(/[=-]/)
    const box = boxes[HASH(label)]
    const lensIndex = box.findIndex(l => l.l === label)
    if (focalLength) {
      if (lensIndex > -1) box[lensIndex].f = +focalLength
      else box.push({ l: label, f: +focalLength })
    } else if (lensIndex > -1) {
      box.splice(lensIndex, 1)
    }
  }

  return sumWith(boxes, (box, bIndex) =>
    sumWith(box, (lens, i) => (bIndex + 1) * (i + 1) * lens.f),
  )
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(sumWith(parse(exampleInput1), HASH)).toBe(1320)
    })

    test('pt 2 should be', () => {
      expect(HASHMAP(parse(exampleInput1))).toBe(145)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    console.log('result:', sumWith(parsedInput, HASH))
    console.log('result 2:', HASHMAP(parsedInput))
    expect(Bun).toBeDefined()
  })
})
