import { describe, expect, test } from 'bun:test'
import { getInput } from '../utils'

function parseFile(file: string) {
  const [seedLine, ...mapSections] = file.split('\n\n')
  const seeds = Array.from(seedLine.match(/\d+/g)!).map(s => +s)

  const maps = mapSections.map(section => {
    const map: number[] = []
    const [, ...lines] = section.split('\n')
    for (const line of lines) {
      const [drs, srs, rl] = Array.from(line.match(/\d+/g)!).map(s => +s)
      for (let i = srs; i < srs + rl; i++) {
        map[i] = drs + (i - srs)
      }
    }
    return map
  })

  return [seeds, maps] as const
}

function closestLocation(seeds: number[], maps: number[][]) {
  let closest = Infinity
  for (const seed of seeds) {
    let id = seed
    for (const map of maps) {
      id = map[id] ?? id
    }
    if (id < closest) closest = id
  }
  return closest
}

function closestLocationRanges(seeds: number[], maps: number[][]) {
  let closest = Infinity
  for (let i = 0; i < seeds.length - 1; i += 2) {
    for (let seed = seeds[i]; seed < seeds[i] + seeds[i + 1]; seed++) {
      let id = seed
      for (const map of maps) {
        id = map[id] ?? id
      }
      if (id < closest) closest = id
    }
    console.log(`seed ${i} complete`)
  }
  return closest
}

describe('2023-05', () => {
  describe('test', async () => {
    const testFile = await Bun.file(
      `${import.meta.dir}/../../data/05-test.txt`,
    ).text()
    const [seeds, maps] = parseFile(testFile)
    test('pt 1 should be', () => {
      expect(maps.length).toEqual(7)
      expect(closestLocation(seeds, maps)).toBe(35)
    })

    test('p2 should be', () => {
      expect(closestLocationRanges(seeds, maps)).toBe(46)
    })
  })

  test.skip('result', async () => {
    const inputFile = await getInput(5)
    const [seeds, maps] = parseFile(inputFile)
    console.log('pt 1', closestLocation(seeds, maps))
    console.log('pt 2', closestLocationRanges(seeds, maps))
    expect(Bun).toBeDefined()
  })
})
