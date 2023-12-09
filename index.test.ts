import { describe, expect, test } from 'bun:test'

describe('aoc test setup', () => {
  test('env', () => {
    expect(process.env.COOKIE).toBeDefined()
  })
})
