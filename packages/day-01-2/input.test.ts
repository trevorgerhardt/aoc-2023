import { test, expect } from 'bun:test'
import { calibrateValue } from './index'

test('value should be 29', () => {
  expect(calibrateValue('two1nine')).toBe(29)
})

test('value should be 83', () => {
  expect(calibrateValue('eightwothree')).toBe(83)
})

const sum = (n: number[]) => n.reduce((p, c) => p + c, 0)

test('answer should be 142', () => {
  const testData: string[] = [
    'two1nine',
    'eightwothree',
    'abcone2threexyz',
    'xtwone3four',
    '4nineeightseven2',
    'zoneight234',
    '7pqrstsixteen'
  ]
  
  expect(sum(testData.map(calibrateValue))).toBe(281)
})

test('final answer should be ?', async () => {
  const inputFile = await Bun.file(import.meta.dir + '/../day-01/input.txt').text()
  const testData = inputFile.split('\n').filter(s => s.length > 0)

  expect(sum(testData.map(calibrateValue))).toBe(54530)
})