import { describe, expect, test } from 'bun:test'
import { getInput, print } from '../utils'

const DAY = 20

const exampleInput1 = String.raw`

`.trim()

function parse(input: string) {
  return input.split('\n')
}

function calc(input: ReturnType<typeof parse>): number {
  print(`${input.length} values`)
  return 0
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calc(parse(exampleInput1))).toBe(19114)
    })

    test.skip('pt 2 should be', () => {
      expect(calc(parse(exampleInput1))).toBe(167409079868000)
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
