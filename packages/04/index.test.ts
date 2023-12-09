import {describe, expect,test } from 'bun:test'

type Card = {
  matches: number
  points: number
}

function getCards (file: string) {
  return file.trim().split('\n').map(line => {
    const [winners, ours] = line.split(':')[1].split('|').map(s => Array.from(s.match(/\d+/g)!))
    const matches = ours.filter(o => winners.includes(o)).length
    const points = matches === 0 ? 0 : 1 * Math.pow(2, matches - 1)
    return {matches, points}
  })
}

const sum = (arr: number[]) => arr.reduce((p, v) => p + v, 0)
const sumCards = (cards: Card[]) => sum(cards.map(c => c.points))

function processCards(cards: Card[]): number {
  const extras: number[] = []
  for (let i = 0; i < cards.length; i++) {
    const repeat = (extras[i] ?? 0) + 1
    for (let j = i + 1; j <= i + cards[i].matches && j < cards.length; j++) {
      extras[j] = (extras[j] ?? 0) + repeat 
    }
  }
  return cards.length + sum(Object.values(extras))
}

describe('2023-04', async () => {
  describe('test', async () => {
    const testFile = await Bun.file(`${import.meta.dir}/../../data/04-test.txt`).text()
    const cards = getCards(testFile)
    test('pt 1 should be', () => {
      expect(cards.length).toEqual(6)
      expect(sumCards(cards)).toBe(13)
    })

    test('p2 should be', () => {
      expect(processCards(cards)).toBe(30)
    })
  })

  const inputFile = await Bun.file(`${import.meta.dir}/../../data/04-input.txt`).text()
  const cards = getCards(inputFile)
  console.log('pt 1', sumCards(cards))
  console.log('pt 2', processCards(cards))
})