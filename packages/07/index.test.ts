import {describe, expect,test } from 'bun:test'

const cardRank: Record<string, number> = {
  '2': 0,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 5,
  '8': 6,
  '9': 7,
  'T': 8,
  'J': 9,
  'Q': 10,
  'K': 11,
  'A': 12 
}

function getHandRank(cards: string[]) {
  const values: Record<string, number> = {}
  for (const c of cards) values[c] = (values[c] ?? 0) + 1
  const sortedValues = Object.values(values).toSorted((a, b) => b - a)
  switch (sortedValues[0]) {
    case 5: return 6
    case 4: return 5
    case 3: {
      if (sortedValues[1] === 2) return 4
      return 3
    }
    case 2: {
      if (sortedValues[1] === 2) return 2
      return 1
    }
    default:
      return 0
  }
}

type Hand = {
  bid: number
  cards: string[]
  rank: number
}

function parseFile (file: string): Hand[] {
  return file.split('\n').map((line) => {
    const [type, bid] = line.split(' ')
    const cards = type.split('')
    return {
      bid: +bid,
      cards,
      rank: getHandRank(cards) 
    }
  })
}

function totalWinnings(hands: Hand[]) {
  const handsSorted = hands.toSorted((hand1, hand2) => {
    if (hand1.rank < hand2.rank) return -1
    if (hand1.rank > hand2.rank) return 1
    for (let i = 0; i < hand1.cards.length; i++) {
      if (cardRank[hand1.cards[i]] < cardRank[hand2.cards[i]]) return -1
      if (cardRank[hand1.cards[i]] > cardRank[hand2.cards[i]]) return 1
    }
    return 0
  })

  return handsSorted.reduce((tw, hand, rank) => tw + hand.bid * (rank + 1), 0)
}

describe('test', async () => {
  const testFile = await Bun.file(`${import.meta.dir}/../../data/07-test.txt`).text()
  const hands = parseFile(testFile)
  test('pt 1 should be', () => {
    expect(totalWinnings(hands)).toBe(6440)
  })
})

test('result', async () => {
  const inputFile = await Bun.file(`${import.meta.dir}/../../data/07-input.txt`).text()
  const hands = parseFile(inputFile)
  console.log('total winnings', totalWinnings(hands))
  expect(Bun).toBeDefined()
})