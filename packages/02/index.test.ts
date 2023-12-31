import { describe, expect, test } from 'bun:test'
import { getInput } from '../utils'

const exampleInput = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.trim()

type Color = 'r' | 'g' | 'b'
type Set = Record<Color, number>
type Game = {
  id: number
  sets: Set[]
}

async function parseInput(text: string) {
  const games: Game[] = []
  for (const game of text.split('\n')) {
    const [gameIdString, setsString] = game.split(':')
    const id = +gameIdString.slice('Game '.length)
    const sets: Set[] = []
    for (const setStr of setsString.split(';')) {
      const set: Set = { r: 0, g: 0, b: 0 }
      for (const colorStr of setStr.split(',')) {
        const [count, color] = colorStr.trim().split(' ')
        set[color.slice(0, 1) as Color] = +count
      }
      sets.push(set)
    }
    games.push({ id, sets })
  }
  return games
}

function isValidGame(game: Game, bag: Set) {
  for (const set of game.sets)
    if (set.r > bag.r || set.g > bag.g || set.b > bag.b) return false
  return true
}

function findMinSet(game: Game) {
  let r = 0
  let g = 0
  let b = 0
  for (const set of game.sets) {
    r = Math.max(r, set.r)
    g = Math.max(g, set.g)
    b = Math.max(b, set.b)
  }
  return { r, g, b }
}

const sumGames = (n: Game[]) => n.reduce((p, c) => p + c.id, 0)
const sumMinSetPower = (s: Set[]) => s.reduce((p, c) => p + c.r * c.g * c.b, 0)

const exampleGames = await parseInput(exampleInput)
const exampleBag: Set = { r: 12, g: 13, b: 14 }

const inputText = await getInput(2)
const input = await parseInput(inputText)
const inputBag: Set = { r: 12, g: 13, b: 14 }

describe('2023-02', () => {
  test('first example should match', () => {
    expect(exampleGames[0].id).toBe(1)
    expect(exampleGames[0].sets[0]).toEqual({ r: 4, g: 0, b: 3 })
  })

  test('test valid games', () => {
    expect(isValidGame(exampleGames[0], exampleBag)).toBe(true)
    expect(isValidGame(exampleGames[1], exampleBag)).toBe(true)
    expect(isValidGame(exampleGames[2], exampleBag)).toBe(false)
    expect(isValidGame(exampleGames[3], exampleBag)).toBe(false)
    expect(isValidGame(exampleGames[4], exampleBag)).toBe(true)
  })

  test('example games sum', () => {
    expect(sumGames(exampleGames.filter(g => isValidGame(g, exampleBag)))).toBe(
      8,
    )
  })

  test('example min sum power', () => {
    const minSet1 = findMinSet(exampleGames[0])
    expect(minSet1).toEqual({ r: 4, g: 2, b: 6 })
    expect(sumMinSetPower([minSet1])).toBe(48)
    expect(sumMinSetPower(exampleGames.map(findMinSet))).toBe(2286)
  })

  test('full games sum', () => {
    expect(sumGames(input.filter(g => isValidGame(g, inputBag)))).toBe(2207)
  })

  test('full min sum power', () => {
    expect(sumMinSetPower(input.map(findMinSet))).toBe(62241)
  })
})
