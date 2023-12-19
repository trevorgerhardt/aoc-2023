import { describe, expect, test } from 'bun:test'
import { getInput, print } from '../utils'

const DAY = 19

const exampleInput1 = String.raw`
`.trim()

const parse = (input: string) => input.split('\n').map(r => r.split(''))

function calc(input: ReturnType<typeof parse>) {
  print(input.length)
  return 0
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calc(parse(exampleInput1))).toBe(62)
    })

    test.skip('pt 2 should be', () => {
      expect(calc(parse(exampleInput1))).toBe(952408144115)
    })
  })

  test.skip('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    console.log('result:', calc(parsedInput))
    // console.log('result 2:', calc(parsedInput))
    expect(Bun).toBeDefined()
  })
})
