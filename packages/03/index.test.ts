import { describe, expect, test } from 'bun:test'
import { getInput } from '../utils'

type Coord = [number, number]
type NumPos = {
  total: number
  digits: string[]
  coords: Coord[]
}

function isAdjacentToSymbol(coord: Coord, symbols: boolean[][]) {
  for (let y = coord[1] - 1; y <= coord[1] + 1; y++) {
    if (y < 0 || y >= symbols.length) continue
    for (let x = coord[0] - 1; x <= coord[0] + 1; x++) {
      if (x < 0 || x >= symbols[y].length) continue
      if (symbols[y][x]) return true
    }
  }
  return false
}

const isAdjacent = (n1: number, n2: number) =>
  n1 === n2 || n1 === n2 - 1 || n1 === n2 + 1

function getAdjacentPartNumbers(coord: Coord, partNums: NumPos[]) {
  const adjacent: NumPos[] = []
  for (const partNum of partNums) {
    for (const partCoord of partNum.coords) {
      if (
        isAdjacent(partCoord[0], coord[0]) &&
        isAdjacent(partCoord[1], coord[1])
      ) {
        adjacent.push(partNum)
        break
      }
    }
  }
  return adjacent
}

function sumOfParts(input: string) {
  let sum = 0
  const numberPositions: NumPos[] = []
  const symbolIndexes: boolean[][] = []
  const gearIndexes: Coord[] = []
  const lines = input.split('\n')
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    const symbols: boolean[] = []
    let numberPos: NumPos | null = null
    const chars = line.split('')
    for (let x = 0; x < chars.length; x++) {
      const c = chars[x]
      if (Number.isInteger(+c)) {
        if (numberPos == null) {
          numberPos = {
            total: 0,
            digits: [c],
            coords: [[x, y]],
          }
        } else {
          numberPos.digits.push(c)
          numberPos.coords.push([x, y])
        }
        symbols.push(false)
      } else {
        if (numberPos != null) {
          numberPos.total = +numberPos.digits.join('')
          numberPositions.push(numberPos)
          numberPos = null
        }

        if (c === '.') {
          symbols.push(false)
        } else {
          if (c === '*') {
            gearIndexes.push([x, y])
          }
          symbols.push(true)
        }
      }
    }

    if (numberPos != null) {
      numberPos.total = +numberPos.digits.join('')
      numberPositions.push(numberPos)
      numberPos = null
    }

    symbolIndexes.push(symbols)
  }

  for (const numberPos of numberPositions) {
    if (numberPos.coords.find(c => isAdjacentToSymbol(c, symbolIndexes))) {
      sum += numberPos.total
    }
  }

  let ratio = 0
  for (const gear of gearIndexes) {
    const adjacentPartNumbers = getAdjacentPartNumbers(gear, numberPositions)
    if (adjacentPartNumbers.length === 2) {
      ratio += adjacentPartNumbers[0].total * adjacentPartNumbers[1].total
    }
  }
  return { sum, ratio }
}

describe('2023-03', () => {
  describe('test', async () => {
    const testFile = await Bun.file(
      `${import.meta.dir}/../../data/03-test.txt`,
    ).text()
    const results = sumOfParts(testFile)
    test('sum of parts', () => {
      expect(results.sum).toBe(4361)
    })

    test('gear ratio', () => {
      expect(results.ratio).toBe(467835)
    })
  })

  describe('result', async () => {
    const inputFile = await getInput(3)
    const results = sumOfParts(inputFile)
    test('sum of parts', () => {
      expect(results.sum).toEqual(536202)
    })

    test('gear ratio', () => {
      expect(results.ratio).toBe(78272573)
    })
  })
})
