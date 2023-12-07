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
  'J': -1,
  'Q': 10,
  'K': 11,
  'A': 12 
}

function getHandRank(cards: string[]) {
  const ct: Record<string, number> = {}
  for (const c of cards) ct[c] = (ct[c] ?? 0) + 1
  const cc = Object.entries(ct).toSorted((a, b) => b[1] - a[1])
  if (ct['J'] == null) { // No jokers
    switch (cc[0][1]) {
      case 5: return 6
      case 4: {
        return 5
      }
      case 3: {
        if (cc[1][1] === 2) return 4 // full-house
        return 3
      }
      case 2: {
        if (cc[1][1] === 2) return 2
        return 1
      }
      default:
        return 0
    }
  } else {
    switch (cc[0][1]) {
      case 5: return 6
      case 4: return 6
      case 3: {
        if (ct['J'] === 3) {
          return 4 + cc[1][1]
        } else {
          return 4 + ct['J']
        }
      }
      case 2: {
        if (ct['J'] === 2) {
          if (cc[1][1] === 2) {
            return 5 // 4 of a kind
          } else {
            return 3
          }
        } else {
          if (cc[1][1] === 2) {
            return 4 // full-house
          } else {
            return 3
          }
        }
      }
      default:
        return 1
    }
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
    expect(totalWinnings(hands)).toBe(5905)
  })
})

test('result', async () => {
  const inputFile = await Bun.file(`${import.meta.dir}/../../data/07-input.txt`).text()
  const hands = parseFile(inputFile)
  console.log('total winnings', totalWinnings(hands))
  expect(Bun).toBeDefined()
})