import { test, expect } from 'bun:test'

type Color = 'r' | 'g' | 'b'
type Set = Record<Color, number>
type Game = {
  id: number
  sets: Set[]
}

async function parseInput (path: string) {
  let text = await Bun.file(path).text()
  let games: Game[] = []
  for (let game of text.split('\n')) {
    let [gameIdString, setsString] = game.split(':')
    let id = +gameIdString.slice('Game '.length)
    let sets: Set[] = []
    for (let setStr of setsString.split(';')) {
      let set: Set = {r: 0, g: 0, b: 0}
      for (let colorStr of setStr.split(',')) {
        let [count, color] = colorStr.trim().split(' ')
        set[color.slice(0, 1) as Color] = +count
      }
      sets.push(set)
    }
    games.push({id, sets})
  }
  return games
}

function isValidGame (game: Game, bag: Set) {
  for (let set of game.sets)
    if (set.r > bag.r || set.g > bag.g || set.b > bag.b) return false
  return true
}

function findMinSet (game: Game) {
  let r = 0, g = 0, b = 0
  for (let set of game.sets) {
    r = Math.max(r, set.r)
    g = Math.max(g, set.g)
    b = Math.max(b, set.b)
  }
  return {r, g, b}
}

let sumGames = (n: Game[]) => n.reduce((p, c) => p + c.id, 0)
let sumMinSetPower = (s: Set[]) => s.reduce((p, c) => p + (c.r * c.g * c.b), 0)

let exampleGames = await parseInput('./example.txt')
let exampleBag: Set = {r: 12, g: 13, b: 14}

let input = await parseInput('./input.txt')
let inputBag: Set = {r: 12, g: 13, b: 14}

test('first example should match', () => {
  expect(exampleGames[0].id).toBe(1)
  expect(exampleGames[0].sets[0]).toEqual({r: 4, g: 0, b: 3})
})

test('test valid games', () => {
  expect(isValidGame(exampleGames[0], exampleBag)).toBe(true)
  expect(isValidGame(exampleGames[1], exampleBag)).toBe(true)
  expect(isValidGame(exampleGames[2], exampleBag)).toBe(false)
  expect(isValidGame(exampleGames[3], exampleBag)).toBe(false)
  expect(isValidGame(exampleGames[4], exampleBag)).toBe(true)
})

test('example games sum', () => {
  expect(sumGames(exampleGames.filter(g => isValidGame(g, exampleBag)))).toBe(8)
})

test('example min sum power', () => {
  let minSet1 = findMinSet(exampleGames[0])
  expect(minSet1).toEqual({r: 4, g: 2, b: 6})
  expect(sumMinSetPower([minSet1])).toBe(48)
  expect(sumMinSetPower(exampleGames.map(findMinSet))).toBe(2286)
})

test('full games sum', () => {
  expect(sumGames(input.filter(g => isValidGame(g, inputBag)))).toBe(2207)
})

test('full min sum power', () => {
  expect(sumMinSetPower(input.map(findMinSet))).toBe(62241)
})